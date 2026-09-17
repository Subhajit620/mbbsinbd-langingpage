import fs from 'fs';
import express from 'express'; // Express server initialized
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import leadRoutes from './routes/leadRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { logger } from './utils/logger.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect MongoDB Atlas
connectDB();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for production deployment
      }
    },
    credentials: true
  })
);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
    errors: ['Rate limit exceeded.']
  }
});
app.use('/api', limiter);

// Request Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Public Static Uploads (PDF Reports)
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/resources', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Dynamic PDF Auto-Regeneration Fallback Handler
app.get(['/resources/uploads/pdf/:filename', '/uploads/pdf/:filename', '/public/uploads/pdf/:filename'], async (req, res) => {
  const { filename } = req.params;
  const pdfPath = path.join(__dirname, 'public/uploads/pdf', filename);

  if (fs.existsSync(pdfPath)) {
    return res.sendFile(pdfPath);
  }

  logger.info(`[Dynamic PDF Handler] Requested PDF "${filename}" not on disk. Auto-generating report...`);

  try {
    const Lead = (await import('./models/Lead.js')).default;
    const { generateEligibilityPdf } = await import('./services/pdfService.js');
    const { calculateLeadMetrics } = await import('./utils/gpaCalculator.js');

    // Search Lead strictly by pdf_url or report_id or name in filename
    let lead = await Lead.findOne({ pdf_url: { $regex: filename, $options: 'i' } });

    if (!lead) {
      const match = filename.match(/Report_(.*?)_\d+\.pdf$/i);
      if (match && match[1]) {
        const cleanSearchName = match[1].replace(/_/g, ' ');
        const nameRegex = new RegExp(cleanSearchName.split(' ').join('.*'), 'i');
        lead = await Lead.findOne({ name: nameRegex });
      }
    }

    if (lead) {
      const leadData = {
        ...lead.toObject(),
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        location: lead.location,
        neetScore: lead.neet_score,
        passYear: lead.passing_year,
        marks_10: lead.marks_10,
        marks_12: lead.marks_12,
        calculated_gpa_10: lead.calculated_gpa_10,
        calculated_gpa_12: lead.calculated_gpa_12,
        is_eligible: lead.is_eligible
      };
      const metrics = calculateLeadMetrics(leadData);
      const pdfResult = await generateEligibilityPdf(leadData, metrics, lead.report_id);
      
      lead.pdf_url = pdfResult.pdfWebUrl;
      await lead.save();

      return res.sendFile(pdfResult.pdfFilePath);
    }
  } catch (err) {
    logger.error('Dynamic PDF Fallback Error:', err);
  }

  return res.status(404).json({
    success: false,
    message: `PDF Report file "${filename}" could not be found or regenerated.`,
    errors: ['File missing on server.']
  });
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Aspiring Life MERN API Server is healthy and running.',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes);

// Modal / Direct Inquiry Endpoint
app.post('/api/submit', async (req, res, next) => {
  try {
    const { name, email, phone, country, location, neetScore, passYear, query } = req.body;
    if (!name || !email) {
      return res.status(400).json({ status: 'error', message: 'Name and email are required.' });
    }

    const Lead = (await import('./models/Lead.js')).default;
    const { generateReportId } = await import('./utils/gpaCalculator.js');

    const newLead = new Lead({
      report_id: generateReportId(),
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      phone: String(phone || 'N/A').trim(),
      location: String(country || location || '').trim(),
      query: String(query || 'Modal Inquiry').trim(),
      neet_score: Number(neetScore) || 0,
      passing_year: String(passYear || new Date().getFullYear()).trim(),
      marks_10: { inquiry: true },
      marks_12: { inquiry: true },
      calculated_gpa_10: 0,
      calculated_gpa_12: 0,
      is_eligible: true,
      pdf_url: '',
      submitted_at: new Date()
    });

    await newLead.save();
    logger.info(`[Modal Lead] Saved inquiry for: ${newLead.name} (${newLead.email})`);

    return res.status(200).json({
      status: 'success',
      message: 'Inquiry submitted successfully.',
      data: { report_id: newLead.report_id }
    });
  } catch (err) {
    logger.error('Modal Inquiry Submit Error:', err);
    return res.status(500).json({ status: 'error', message: 'Failed to submit inquiry.' });
  }
});

// Serve Client Static Build if available
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use('/landing-page', express.static(clientDistPath));
  app.use(express.static(clientDistPath));
  app.get(['/landing-page/*', '/admin', '/admin-login', '/thank-you'], (req, res, next) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/uploads') || req.originalUrl.startsWith('/public')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: [${req.method}] ${req.originalUrl}`,
    errors: ['Invalid endpoint.']
  });
});

// Centralized Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`[Express] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
