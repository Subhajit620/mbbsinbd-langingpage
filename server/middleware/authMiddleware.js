import jwt from 'jsonwebtoken';

export const protectAdmin = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'aspiring_life_secret_key_2026_jwt_token');
      req.admin = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access. Token expired or invalid.',
        errors: [error.message]
      });
    }
  }

  return res.status(401).json({
    success: false,
    message: 'Unauthorized access. No token provided.',
    errors: ['Missing authorization token.']
  });
};
