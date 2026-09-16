import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateEligibilityPdf = async (leadData, metrics, reportId) => {
  return new Promise((resolve, reject) => {
    try {
      const uploadDir = path.join(__dirname, '../public/uploads/pdf');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const cleanName = leadData.name ? leadData.name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase() : 'candidate';
      const pdfFileName = `MBBS_Eligibility_Report_${cleanName}_${Date.now()}.pdf`;
      const pdfFilePath = path.join(uploadDir, pdfFileName);

      // Create PDF Document with precise A4 dimensions (595.28 x 841.89 pt)
      const doc = new PDFDocument({ margin: 36, size: 'A4', autoFirstPage: true });
      const stream = fs.createWriteStream(pdfFilePath);
      doc.pipe(stream);

      // --- COLOR PALETTE & DESIGN TOKENS ---
      const darkNavy = '#0f172a';
      const brandTeal = '#0d9488';
      const accentSky = '#0284c7';
      const textDark = '#1e293b';
      const textMuted = '#64748b';
      const bgCard = '#f8fafc';
      const borderLine = '#cbd5e1';
      const successGreen = '#16a34a';
      const successBg = '#f0fdf4';
      const errorRed = '#dc2626';
      const errorBg = '#fef2f2';

      // Standardize Field Normalization
      const passYearVal = String(leadData.passYear ?? leadData.passing_year ?? '').trim();
      const neetVal = Number(leadData.neetScore ?? leadData.neet_score) || 0;
      const sscGpaVal = Number(metrics.sscGpa ?? leadData.calculated_gpa_10 ?? 0);
      const hscGpaVal = Number(metrics.hscGpa ?? leadData.calculated_gpa_12 ?? 0);
      const totalGpaVal = Number(metrics.totalGpa ?? (sscGpaVal + hscGpaVal)).toFixed(2);
      const isEligible = metrics.isEligible !== undefined ? Boolean(metrics.isEligible) : Boolean(leadData.is_eligible);

      // Outer Decorative Page Border
      doc.rect(20, 20, 555.28, 801.89).strokeColor('#e2e8f0').lineWidth(1).stroke();

      // -------------------------------------------------------------
      // 1. EXECUTIVE BRANDING HEADER BANNER
      // -------------------------------------------------------------
      doc.rect(20, 20, 555.28, 90).fill(darkNavy);
      doc.rect(20, 110, 555.28, 4).fill(brandTeal);

      // Embed Company Logo
      const logoPath = path.join(__dirname, '../../frontend/src/assets/logo.jpg');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 36, 32, { height: 62 });
      }

      // Branding Header Text
      doc
        .fillColor('#ffffff')
        .fontSize(19)
        .font('Helvetica-Bold')
        .text('ASPIRING LIFE CONSULTANCY', 125, 34);

      doc
        .fontSize(9.5)
        .font('Helvetica')
        .fillColor('#38bdf8')
        .text('MBBS IN BANGLADESH • ADMISSION EVALUATION DOSSIER', 125, 58);

      doc
        .fontSize(8)
        .fillColor('#94a3b8')
        .text('Official Equivalence & Eligibility Verification as per DGHS Bangladesh Regulations', 125, 72);

      // Right Header Badge
      doc.rect(435, 32, 125, 26).fill('rgba(255,255,255,0.1)');
      doc.fillColor('#ffffff').fontSize(8.5).font('Helvetica-Bold').text('OFFICIAL REPORT', 445, 41, { align: 'center', width: 105 });

      // -------------------------------------------------------------
      // 2. METADATA & DOSSIER REFERENCE STRIP
      // -------------------------------------------------------------
      let currentY = 126;
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      doc.fillColor(textDark);

      // Reference ID Box
      doc.rect(36, currentY, 260, 26).fill('#e0f2fe').stroke('#0284c7').stroke();
      doc.fillColor('#0369a1').fontSize(9).font('Helvetica-Bold').text(`REPORT REF ID: ${reportId}`, 48, currentY + 8);

      // Timestamp Box
      doc.rect(306, currentY, 253, 26).fill(bgCard).stroke(borderLine).stroke();
      doc.fillColor(textMuted).fontSize(8.5).font('Helvetica').text(`Evaluation Date: ${currentDate}`, 316, currentY + 8, { align: 'right', width: 233 });

      currentY += 36;

      // -------------------------------------------------------------
      // 3. CANDIDATE PROFILE SUMMARY CARD
      // -------------------------------------------------------------
      doc.rect(36, currentY, 523, 95).fill(bgCard).stroke(borderLine).stroke();

      // Card Title Header
      doc.rect(36, currentY, 523, 24).fill('#1e293b');
      doc.fillColor('#ffffff').fontSize(9.5).font('Helvetica-Bold').text('APPLICANT CANDIDATE DOSSIER', 48, currentY + 7);

      doc.fontSize(8.5).font('Helvetica').fillColor(textDark);

      // Left Profile Column
      doc.font('Helvetica-Bold').text('Candidate Name:', 50, currentY + 34);
      doc.font('Helvetica').text(leadData.name || 'N/A', 135, currentY + 34);

      doc.font('Helvetica-Bold').text('Email Address:', 50, currentY + 52);
      doc.font('Helvetica').text(leadData.email || 'N/A', 135, currentY + 52);

      doc.font('Helvetica-Bold').text('Contact Phone:', 50, currentY + 70);
      doc.font('Helvetica').text(leadData.phone || 'N/A', 135, currentY + 70);

      // Right Profile Column
      doc.font('Helvetica-Bold').text('State / Location:', 310, currentY + 34);
      doc.font('Helvetica').text(leadData.location || 'Not Specified', 410, currentY + 34);

      doc.font('Helvetica-Bold').text('Class 12 Passing Batch:', 310, currentY + 52);
      doc.font('Helvetica').text(`${passYearVal} Batch`, 410, currentY + 52);

      doc.font('Helvetica-Bold').text('NEET Qualification:', 310, currentY + 70);
      doc
        .font('Helvetica-Bold')
        .fillColor(neetVal >= 137 ? successGreen : errorRed)
        .text(`${neetVal} Marks (${neetVal >= 137 ? 'QUALIFIED' : 'UNDER REVIEW'})`, 410, currentY + 70);

      currentY += 108;

      // -------------------------------------------------------------
      // 4. ADMISSION ELIGIBILITY VERDICT BANNER
      // -------------------------------------------------------------
      if (isEligible) {
        doc.rect(36, currentY, 523, 64).fill(successBg).stroke('#22c55e').stroke();
        doc.rect(36, currentY, 6, 64).fill(successGreen);

        doc.fillColor(successGreen).fontSize(12.5).font('Helvetica-Bold').text('ELIGIBILITY VERDICT: DIRECT ADMISSION QUALIFIED', 52, currentY + 12);
        doc.fillColor('#15803d').fontSize(8.5).font('Helvetica').text(
          'Congratulations! Your academic profile meets all official DGHS Bangladesh criteria (Combined GPA >= 7.00, SSC/HSC GPA >= 3.50, Biology >= 60%, and NEET Qualified). You are eligible for direct seat allocation in top Bangladesh Medical Colleges.',
          52, currentY + 30, { width: 490 }
        );
      } else {
        doc.rect(36, currentY, 523, 64).fill(errorBg).stroke('#ef4444').stroke();
        doc.rect(36, currentY, 6, 64).fill(errorRed);

        doc.fillColor(errorRed).fontSize(12.5).font('Helvetica-Bold').text('ELIGIBILITY VERDICT: REQUIRES MANUAL ADMISSION REVIEW', 52, currentY + 12);
        doc.fillColor('#991b1b').fontSize(8.5).font('Helvetica').text(
          'Your scores do not strictly satisfy standard automated direct entry thresholds. An expert Aspiring Life counselor will manually review your marksheet to explore alternative college seat reservations and equivalence criteria.',
          52, currentY + 30, { width: 490 }
        );
      }

      currentY += 78;

      // -------------------------------------------------------------
      // 5. ACADEMIC EVALUATION & GPA MATRIX TABLE
      // -------------------------------------------------------------
      doc.fillColor(darkNavy).fontSize(11).font('Helvetica-Bold').text('ACADEMIC MARKS & CALCULATED GPAS', 36, currentY);
      currentY += 16;

      // Table Header Row
      doc.rect(36, currentY, 523, 22).fill(darkNavy);
      doc.fillColor('#ffffff').fontSize(8.5).font('Helvetica-Bold');
      doc.text('EXAMINATION LEVEL', 46, currentY + 6);
      doc.text('KEY SUBJECT SCORES & BREAKDOWN', 180, currentY + 6);
      doc.text('CALCULATED GPA', 455, currentY + 6);
      currentY += 22;

      // Class 10 Row
      doc.rect(36, currentY, 523, 46).fill('#ffffff').stroke(borderLine).stroke();
      doc.fillColor(textDark).fontSize(9).font('Helvetica-Bold').text('Class 10 (SSC)', 46, currentY + 16);

      const m10 = metrics.marks10Obj || {};
      const m10Line1 = (m10.sub1Name && m10.sub1Mark !== undefined)
        ? `${m10.sub1Name}: ${m10.sub1Mark} | ${m10.sub2Name || 'Sub2'}: ${m10.sub2Mark || 0} | ${m10.sub3Name || 'Sub3'}: ${m10.sub3Mark || 0}`
        : 'Class 10 Core Board Examination Subjects Evaluated';
      const m10Line2 = (m10.sub4Name && m10.sub4Mark !== undefined)
        ? `${m10.sub4Name}: ${m10.sub4Mark} | ${m10.sub5Name || 'Sub5'}: ${m10.sub5Mark || 0}`
        : 'SSC Equivalent Rule Validation Applied';

      doc.font('Helvetica').fontSize(8.5).fillColor('#475569');
      doc.text(m10Line1, 180, currentY + 10);
      doc.text(m10Line2, 180, currentY + 25);

      doc.font('Helvetica-Bold').fontSize(12).fillColor(brandTeal).text(`${sscGpaVal.toFixed(2)} / 5.00`, 455, currentY + 16);
      currentY += 46;

      // Class 12 Row
      doc.rect(36, currentY, 523, 46).fill(bgCard).stroke(borderLine).stroke();
      doc.fillColor(textDark).fontSize(9).font('Helvetica-Bold').text('Class 12 (HSC)', 46, currentY + 16);

      const m12 = metrics.marks12Obj || {};
      const m12Text1 = m12.phyMark !== undefined
        ? `Physics: ${m12.phyMark} | Chemistry: ${m12.chemMark}`
        : (m12.phy !== undefined ? `Physics: ${m12.phy} | Chemistry: ${m12.chem}` : 'Physics & Chemistry Scores Evaluated');
      
      const bioScore = m12.bioMark !== undefined ? m12.bioMark : (m12.bio !== undefined ? m12.bio : 'N/A');

      doc.font('Helvetica').fontSize(8.5).fillColor('#475569');
      doc.text(m12Text1, 180, currentY + 10);
      doc.font('Helvetica-Bold').fillColor(brandTeal).text(`Biology Score: ${bioScore} (DGHS Criteria Core)`, 180, currentY + 25);

      doc.font('Helvetica-Bold').fontSize(12).fillColor(brandTeal).text(`${hscGpaVal.toFixed(2)} / 5.00`, 455, currentY + 16);
      currentY += 46;

      // Combined Row
      doc.rect(36, currentY, 523, 28).fill('#e0f2fe').stroke('#0284c7').stroke();
      doc.fillColor('#0369a1').fontSize(10).font('Helvetica-Bold').text('TOTAL COMBINED GPA (SSC + HSC)', 46, currentY + 8);
      doc.fillColor('#0369a1').fontSize(13).font('Helvetica-Bold').text(`${totalGpaVal} / 10.00`, 455, currentY + 7);

      currentY += 42;

      // -------------------------------------------------------------
      // 6. DGHS BANGLADESH COMPLIANCE AUDIT CHECKLIST
      // -------------------------------------------------------------
      doc.fillColor(darkNavy).fontSize(11).font('Helvetica-Bold').text('DGHS BANGLADESH ADMISSION AUDIT CHECKLIST', 36, currentY);
      currentY += 16;

      const checklist = [
        { label: 'Class 10 (SSC) Minimum GPA Threshold (>= 3.50)', pass: sscGpaVal >= 3.5 },
        { label: 'Class 12 (HSC) Minimum GPA Threshold (>= 3.50)', pass: hscGpaVal >= 3.5 },
        { label: 'Total Combined GPA Score Threshold (>= 7.00)', pass: (sscGpaVal + hscGpaVal) >= 7.0 },
        { label: 'Class 12 Biology Minimum Score (>= 60% / GPA 3.50+)', pass: Number(bioScore) >= 60 || bioScore >= 3.5 },
        { label: 'HSC Passing Batch Criteria (2025 / 2026 Batch)', pass: ['2025', '2026', 2025, 2026].includes(passYearVal) },
        { label: 'NEET Qualification Score (>= Cutoff Criteria)', pass: neetVal >= 137 }
      ];

      checklist.forEach((item) => {
        doc.rect(36, currentY, 523, 20).fill(item.pass ? successBg : errorBg).stroke(item.pass ? '#bbf7d0' : '#fca5a5').stroke();
        doc.fillColor(item.pass ? successGreen : errorRed).fontSize(9).font('Helvetica-Bold');
        doc.text(item.pass ? '[✓ PASS]' : '[✗ REVIEW]', 46, currentY + 5);

        doc.fillColor(textDark).fontSize(8.5).font('Helvetica');
        doc.text(item.label, 120, currentY + 5);
        currentY += 24;
      });

      // -------------------------------------------------------------
      // 7. COUNSELOR HELPLINE & FOOTER SEAL BOX
      // -------------------------------------------------------------
      currentY += 10;
      doc.rect(36, currentY, 523, 58).fill(darkNavy).stroke(darkNavy).stroke();

      doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold').text('NEED ADMISSION ASSISTANCE? TALK TO OUR ACADEMIC COUNSELORS', 50, currentY + 10);
      doc.fillColor('#94a3b8').fontSize(8).font('Helvetica').text(
        'For official college selection, fee structure breakdown, hostel facilities, and DGHS equivalence certificate application:',
        50, currentY + 24
      );

      doc.fillColor('#38bdf8').fontSize(9).font('Helvetica-Bold').text(
        'Helpline: +91 90517 73700 / +91 98313 80826   |   Email: aspiringlifedrive@gmail.com',
        50, currentY + 40
      );

      // Page Footer Disclaimer
      doc.fontSize(7.5).font('Helvetica-Oblique').fillColor('#94a3b8').text(
        'Disclaimer: This evaluation dossier is auto-generated based on DGHS Bangladesh guidelines. Final seat confirmation is subject to document verification.',
        36, 815, { align: 'center', width: 523 }
      );

      doc.end();

      stream.on('finish', () => {
        const relativeWebUrl = `resources/uploads/pdf/${pdfFileName}`;
        logger.info(`[PDF Service] Generated upgraded PDF at: ${pdfFilePath}`);
        resolve({
          pdfFileName,
          pdfFilePath,
          pdfWebUrl: relativeWebUrl
        });
      });

      stream.on('error', (err) => {
        logger.error('PDF Stream Error:', err);
        reject(err);
      });
    } catch (err) {
      logger.error('PDF Generation Catch Error:', err);
      reject(err);
    }
  });
};
