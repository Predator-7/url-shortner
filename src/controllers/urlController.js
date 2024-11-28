import URLService from '../services/urlService.js';

class URLController {
  async shorten(req, res, next) {
    try {
      const { url, ttl } = req.body;
      const clientIp = req.ip;
      const response = await URLService.shortenURL(url, { ttl }, clientIp);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const { shortCode } = req.params;
      const stats = await URLService.getURLStats(shortCode);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  async redirect(req, res, next) {
    try {
      const { shortCode } = req.params;
      const longUrl = await URLService.getRedirectURL(shortCode);
      res.redirect(longUrl);
    } catch (error) {
      next(error);
    }
  }
}

export default new URLController();
