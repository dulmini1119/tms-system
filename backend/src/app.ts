import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimit';
import logger from './utils/logger';
import config from './config/environment';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import permissioRoutes from './modules/permissions/permission.routes';
// import other routes later...

const app: Application = express();

// CORS configuration (same as before)
const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    if (!origin || config.cors.allowedOrigins.includes(origin) || config.app.env === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  maxAge: 86400,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (config.app.env === 'development') {
  app.use(morgan('dev') as express.RequestHandler);
} else {
  app.use(morgan('combined', {
    stream: { write: (message: string) => logger.info(message.trim()) },
  }) as express.RequestHandler);
}

// Rate limiting — now applies to ALL routes (or you can move it inside specific routers if you want)
app.use(apiLimiter);   // ← applies globally (recommended)

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.app.env,
  });
});

// ROUTES WITHOUT ANY PREFIX
app.use('/auth', authRoutes);     // → POST /auth/register, etc.
app.use('/users', usersRoutes);   // → GET /users/me, etc.
app.use('/permissions', permissioRoutes); // → GET /permissions, etc.

// Add future routes exactly like this:
// app.use('/trips', tripsRoutes);
// app.use('/vehicles', vehiclesRoutes);
// etc.

// 404 & Error handlers (must stay last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;