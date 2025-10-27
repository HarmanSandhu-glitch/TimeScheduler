import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: process.env.PORT || 3333,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/timescheduler',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM || 'noreply@timescheduler.com',
  CORS_ORIGIN: 'http://localhost:5173',
  SESSION_START_TIME: process.env.SESSION_START_TIME || '00:00',
  SESSION_END_TIME: process.env.SESSION_END_TIME || '23:45',
  SESSION_INTERVAL: parseInt(process.env.SESSION_INTERVAL) || 15,
};

export default config;
