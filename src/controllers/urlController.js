import URLService from '../services/urlService.js';

class URLController {
  async shorten(req, res) {
    try {
      const { url, ttl } = req.body;
      const { shortUrl } = await URLService.shortenURL(url, { ttl });
      res.status(201).json({ shortUrl });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getStats(req, res) {
    try {
      const { shortCode } = req.params;
      const stats = await URLService.getURLStats(shortCode);
      res.json(stats);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async redirect(req, res) {
    try {
      const { shortCode } = req.params;
      const longUrl = await URLService.getRedirectURL(shortCode);
      res.redirect(longUrl);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

export default new URLController();
