import jwt from 'jsonwebtoken';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const ADMIN_USER = (process.env.ADMIN_USERNAME || process.env.ADMIN_USER || 'admin').trim();
    const ADMIN_PASS = (process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || 'aspiringlife2026').trim();

    if (!username || !password || username.trim() !== ADMIN_USER || password.trim() !== ADMIN_PASS) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator credentials.',
        errors: ['Authentication failed. Incorrect username or password.']
      });
    }

    const payload = {
      username: ADMIN_USER,
      role: 'admin'
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'aspiring_life_secret_key_2026_jwt_token', {
      expiresIn: '24h'
    });

    res.status(200).json({
      status: 'success',
      success: true,
      message: 'Admin authentication successful.',
      data: {
        username: ADMIN_USER,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Token authenticated.',
      data: {
        admin: req.admin
      }
    });
  } catch (error) {
    next(error);
  }
};
