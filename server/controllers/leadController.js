import Lead from '../models/Lead.js';
import { calculateLeadMetrics, generateReportId } from '../utils/gpaCalculator.js';
import { generateEligibilityPdf } from '../services/pdfService.js';
import { sendEligibilityEmail } from '../services/emailService.js';
import { logger } from '../utils/logger.js';
import { Parser } from 'json2csv';

export const checkEligibility = async (req, res, next) => {
  try {
    const leadData = req.body;
    const { email } = leadData;

    // Check for duplicate email in MongoDB
    const existingLead = await Lead.findOne({ email: email.toLowerCase() });
    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: 'An evaluation report has already been registered for this email address. Please check your inbox or contact counseling.',
        errors: ['Duplicate email address found.']
      });
    }

    // Calculate GPAs & Criteria Verdict
    const metrics = calculateLeadMetrics(leadData);
    const reportId = generateReportId();

    // Generate PDF Report
    const pdfResult = await generateEligibilityPdf(leadData, metrics, reportId);

    // Save Lead to MongoDB Atlas
    const newLead = new Lead({
      report_id: reportId,
      name: leadData.name.trim(),
      email: email.toLowerCase().trim(),
      phone: leadData.phone.trim(),
      location: String(leadData.location || leadData.country || '').trim(),
      query: leadData.query ? String(leadData.query).trim() : '',
      neet_score: Number(leadData.neetScore) || 0,
      passing_year: String(leadData.passYear || '').trim(),
      marks_10: metrics.marks10Obj,
      marks_12: metrics.marks12Obj,
      calculated_gpa_10: metrics.sscGpa,
      calculated_gpa_12: metrics.hscGpa,
      is_eligible: metrics.isEligible,
      pdf_url: pdfResult.pdfWebUrl,
      submitted_at: new Date()
    });

    await newLead.save();
    logger.info(`[Lead Controller] New lead saved to MongoDB: ${newLead.name} (${newLead.email})`);

    // Dispatch Email asynchronously
    sendEligibilityEmail(newLead.email, newLead.name, reportId, pdfResult.pdfFilePath, metrics.isEligible);

    // Return standardized response format with the full saved student record
    res.status(201).json({
      success: true,
      message: 'Eligibility evaluation completed successfully.',
      data: {
        report_id: reportId,
        name: newLead.name,
        email: newLead.email,
        phone: newLead.phone,
        location: newLead.location,
        neet_score: newLead.neet_score,
        passing_year: newLead.passing_year,
        is_eligible: metrics.isEligible,
        gpa_10: metrics.sscGpa,
        gpa_12: metrics.hscGpa,
        combined_gpa: metrics.totalGpa,
        pdf_url: pdfResult.pdfWebUrl,
        failed_criteria: metrics.failedCriteria,
        submitted_at: newLead.submitted_at
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (req, res, next) => {
  try {
    const { search, eligibility, year, start_date, end_date, page = 1, limit = 50 } = req.query;

    const filter = {};

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { location: searchRegex },
        { report_id: searchRegex }
      ];
    }

    if (eligibility === '1' || eligibility === 'true') {
      filter.is_eligible = true;
    } else if (eligibility === '0' || eligibility === 'false') {
      filter.is_eligible = false;
    }

    if (year) {
      filter.passing_year = String(year).trim();
    }

    if (start_date || end_date) {
      filter.submitted_at = {};
      if (start_date) {
        filter.submitted_at.$gte = new Date(start_date);
      }
      if (end_date) {
        const endDateObj = new Date(end_date);
        endDateObj.setHours(23, 59, 59, 999);
        filter.submitted_at.$lte = endDateObj;
      }
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const leads = await Lead.find(filter)
      .sort({ submitted_at: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalLeads = await Lead.countDocuments(filter);

    // Compute Analytics Stats across entire collection
    const allLeads = await Lead.find({}).sort({ submitted_at: 1 });
    const totalCount = allLeads.length;
    const eligibleCount = allLeads.filter((l) => l.is_eligible).length;
    const ineligibleCount = totalCount - eligibleCount;
    
    let sumGpa = 0;
    let sumNeet = 0;
    const yearDist = {};
    const dailyMap = {};
    const locationMap = {};

    allLeads.forEach((l) => {
      const g10 = Number(l.calculated_gpa_10) || 0;
      const g12 = Number(l.calculated_gpa_12) || 0;
      sumGpa += (g10 + g12);
      sumNeet += (Number(l.neet_score) || 0);

      const yr = l.passing_year || 'Unknown';
      yearDist[yr] = (yearDist[yr] || 0) + 1;

      const loc = l.location || 'Unspecified';
      locationMap[loc] = (locationMap[loc] || 0) + 1;

      if (l.submitted_at) {
        const dateKey = new Date(l.submitted_at).toISOString().split('T')[0];
        if (!dailyMap[dateKey]) {
          dailyMap[dateKey] = { date: dateKey, total: 0, eligible: 0, ineligible: 0 };
        }
        dailyMap[dateKey].total += 1;
        if (l.is_eligible) dailyMap[dateKey].eligible += 1;
        else dailyMap[dateKey].ineligible += 1;
      }
    });

    const avgGpa = totalCount > 0 ? (sumGpa / totalCount).toFixed(2) : '0.00';
    const avgNeet = totalCount > 0 ? Math.round(sumNeet / totalCount) : 0;
    const conversionRate = totalCount > 0 ? Math.round((eligibleCount / totalCount) * 100) : 0;
    const dailyTrends = Object.values(dailyMap);

    res.status(200).json({
      success: true,
      message: 'Leads fetched successfully.',
      data: {
        leads,
        pagination: {
          total: totalLeads,
          page: pageNum,
          pages: Math.ceil(totalLeads / limitNum)
        },
        stats: {
          total: totalCount,
          eligible: eligibleCount,
          ineligible: ineligibleCount,
          avgGpa: avgGpa,
          avgNeet: avgNeet,
          conversionRate: conversionRate,
          yearDist: yearDist,
          dailyTrends: dailyTrends,
          topLocations: locationMap
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead record not found.',
        errors: ['No document matches the provided ID.']
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead record deleted successfully.',
      data: { id }
    });
  } catch (error) {
    next(error);
  }
};

export const bulkDeleteLeads = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No lead IDs provided for deletion.',
        errors: ['ids parameter must be a non-empty array.']
      });
    }

    const result = await Lead.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} lead record(s) deleted successfully.`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    next(error);
  }
};

export const resendLeadEmail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead record not found.',
        errors: ['No document matches the provided ID.']
      });
    }

    const pathModule = await import('path');
    const fsModule = await import('fs');
    const rootDir = pathModule.resolve();
    
    let pdfFilePath = '';
    if (lead.pdf_url) {
      const cleanRelativePath = lead.pdf_url.replace(/^resources\//, '');
      pdfFilePath = pathModule.join(rootDir, 'public', cleanRelativePath);
    }

    if (!pdfFilePath || !fsModule.existsSync(pdfFilePath)) {
      logger.info(`[Lead Controller] PDF not found on disk at "${pdfFilePath}" for ${lead.email}. Regenerating...`);
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
      pdfFilePath = pdfResult.pdfFilePath;
      lead.pdf_url = pdfResult.pdfWebUrl;
      await lead.save();
    }

    const mailRes = await sendEligibilityEmail(lead.email, lead.name, lead.report_id, pdfFilePath, lead.is_eligible);

    if (mailRes && mailRes.success) {
      return res.status(200).json({
        success: true,
        message: `Evaluation report email resent successfully to ${lead.email}.`,
        data: { email: lead.email, report_id: lead.report_id, messageId: mailRes.messageId }
      });
    } else {
      return res.status(500).json({
        success: false,
        message: `Failed to deliver email: ${mailRes ? mailRes.error : 'Unknown error'}`,
        errors: [mailRes ? mailRes.error : 'SMTP send failure']
      });
    }
  } catch (error) {
    next(error);
  }
};

export const exportCsv = async (req, res, next) => {
  try {
    const leads = await Lead.find({}).sort({ submitted_at: -1 });

    const fields = [
      { label: 'Report ID', value: 'report_id' },
      { label: 'Name', value: 'name' },
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
      { label: 'State/Location', value: 'location' },
      { label: 'NEET Score', value: 'neet_score' },
      { label: 'Passing Year', value: 'passing_year' },
      { label: 'Class 10 GPA', value: 'calculated_gpa_10' },
      { label: 'Class 12 GPA', value: 'calculated_gpa_12' },
      { label: 'Combined GPA', value: (row) => ((row.calculated_gpa_10 || 0) + (row.calculated_gpa_12 || 0)).toFixed(2) },
      { label: 'Eligibility Status', value: (row) => (row.is_eligible ? 'ELIGIBLE' : 'INELIGIBLE') },
      { label: 'Submission Date', value: (row) => new Date(row.submitted_at).toLocaleString() }
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(leads);

    res.header('Content-Type', 'text/csv');
    res.attachment(`MBBS_Leads_Report_${Date.now()}.csv`);
    return res.send(csv);
  } catch (error) {
    next(error);
  }
};
