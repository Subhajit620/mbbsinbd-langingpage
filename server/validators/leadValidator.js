import { body, validationResult } from 'express-validator';

export const validateLeadSubmission = [
  body('name').trim().notEmpty().withMessage('Candidate name is required.'),
  body('email').isEmail().withMessage('Please provide a valid email address.').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Contact phone number is required.'),
  body('neetScore').isInt({ min: 0, max: 720 }).withMessage('NEET score must be between 0 and 720.'),
  body('passYear').notEmpty().withMessage('Class 12 passing year is required.'),
  body('c12Sub3Mark').isInt({ min: 0, max: 100 }).withMessage('Biology marks must be between 0 and 100.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please check your inputs.',
        errors: errors.array().map((e) => e.msg)
      });
    }
    next();
  }
];

export const validateAuthLogin = [
  body('username').trim().notEmpty().withMessage('Username is required.'),
  body('password').notEmpty().withMessage('Password is required.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials payload.',
        errors: errors.array().map((e) => e.msg)
      });
    }
    next();
  }
];
