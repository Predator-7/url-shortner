import express from 'express';
import config from './config/config.js';
import urlRoutes from './routes/urlRoutes.js';
import urlRepository from './repositories/urlRepository.js';


const app = express();

// Middleware
app.use(express.json());
app.use('/', urlRoutes);

// Periodic cleanup of expired URLs
setInterval(() => {
  urlRepository.cleanupExpiredUrls();
}, 60 * 60 * 1000); // Every hour

// Start server
const server = app.listen(config.PORT, () => {
  console.log(`URL Shortener running on port ${config.PORT}`);
});

export default server;