import nodemailer from 'nodemailer';
import fs from 'fs';
import { logger } from '../utils/logger.js';

export const sendEligibilityEmail = async (candidateEmail, candidateName, reportId, pdfFilePath, isEligible) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL || 'aspiringlifedrive@gmail.com',
        pass: process.env.SMTP_PASSWORD || 'mdrdaltgzjcwqzlk'
      }
    });

    const subject = `Your MBBS in Bangladesh Eligibility Evaluation Report (${reportId})`;
    
    const bodyText = `Dear ${candidateName},

Thank you for calculating your MBBS admission eligibility with Aspiring Life.

Your profile has been evaluated based on the official DGHS (Directorate General of Health Services) Bangladesh criteria.

Verdict: ${isEligible ? 'ELIGIBLE FOR DIRECT ADMISSION' : 'UNDER MANUAL REVIEW'}
Report ID: ${reportId}

Please find your official detailed PDF report attached to this email.

If you have any questions or need guidance regarding college selections, fee structures, and application procedures, our academic counselors are ready to assist you.

Warm regards,
Admissions Team
Aspiring Life Consultancy
Email: aspiringlifedrive@gmail.com
Phone: +91 90517 73700 / +91 98313 80826`;

    const attachments = [];
    if (pdfFilePath && fs.existsSync(pdfFilePath)) {
      attachments.push({
        filename: `MBBS_Eligibility_Report_${reportId}.pdf`,
        path: pdfFilePath
      });
    } else {
      logger.warn(`[Nodemailer] PDF attachment file not found on disk at "${pdfFilePath}". Sending text-only email.`);
    }

    const mailOptions = {
      from: `"Aspiring Life Admissions" <${process.env.SMTP_EMAIL || 'aspiringlifedrive@gmail.com'}>`,
      to: candidateEmail,
      subject: subject,
      text: bodyText,
      attachments: attachments
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`[Nodemailer] Email dispatched to ${candidateEmail}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`[Nodemailer Exception] Failed to send email to ${candidateEmail}:`, error);
    return { success: false, error: error.message };
  }
};
