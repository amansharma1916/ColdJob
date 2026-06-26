import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import router from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';
import { sanitize } from './middleware/sanitize.js';
import { requestLogger } from './utils/logger.js';

const createApp = () => {
  const app = express();

  // 1. Security headers
  app.use(helmet());

  // 2. CORS
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // 3. Global rate limiter
  app.use('/api', globalRateLimiter);

  // 4. Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 5. Request logger
  app.use(requestLogger);

  // 6. Input sanitization
  app.use(sanitize);

  // 7. Routes
  app.use('/api/v1', router);

  // 8. Health check
  app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
  });

  // 9. 404 handler
  app.use(notFound);

  // 10. Global error handler
  app.use(errorHandler);

  return app;
};

export default createApp;