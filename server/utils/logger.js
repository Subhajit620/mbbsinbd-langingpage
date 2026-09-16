import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDir = path.join(__dirname, '../logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export const logger = {
  info: (msg) => {
    console.log(`[INFO] [${new Date().toISOString()}] ${msg}`);
  },
  error: (msg, err = '') => {
    const errorMsg = `[ERROR] [${new Date().toISOString()}] ${msg} ${err?.stack || err}\n`;
    console.error(errorMsg.trim());
    try {
      fs.appendFileSync(path.join(logDir, 'error.log'), errorMsg);
    } catch (e) {
      // Fallback
    }
  }
};
