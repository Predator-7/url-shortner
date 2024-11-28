import express from 'express';
import helmet from 'helmet';
import config from './config/config.js';
import urlRoutes from './routes/urlRoutes.js';

const app = express();

// Enhanced security
app.use(helmet());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true); // For rate-limiting & IP tracking

// Routes
app.use('/', urlRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start Server
const server = app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});

export default server;
