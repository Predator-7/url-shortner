import config from '../config/config.js';
import URLRepository from '../repositories/urlRepository.js';
import URLUtils from '../utils/urlUtils.js';
import validationService from './validationService.js';

class URLService {
  constructor() {
    this.config = config;
  }

  // Shorten a long URL and create a new URL entry
  async shortenURL(longUrl, options = {}) {
    // Validate URL using the Utils layer
    if (!validationService.isValidURL(longUrl)) {
      throw new Error('Invalid URL');
    }

    // Check if URL already exists in the database
    const existingEntry = URLRepository.findExistingURL(longUrl);
    if (existingEntry) {
      return this.generateShortUrl(existingEntry.shortCode);
    }

    // Generate unique short code and calculate expiration
    const shortCode = URLUtils.generateShortCode();
    const expiresAt = URLUtils.calculateExpirationTTL(options.ttl);

    // Create and store the URL entry
    const urlEntry = URLRepository.create(shortCode, longUrl, { expiresAt });

    return this.generateShortUrl(shortCode);
  }

  // Helper function to generate the short URL response
  generateShortUrl(shortCode) {
    return {
      shortUrl: `${this.config.BASE_URL}/${shortCode}`,
      shortCode: shortCode
    };
  }

  // Get the long URL for the given shortCode (redirect)
  async getRedirectURL(shortCode) {
    const urlEntry = URLRepository.findByShortCode(shortCode);

    if (!urlEntry) {
      throw new Error('URL not found');
    }

    // Check if the URL has expired
    if (urlEntry.expiresAt && urlEntry.expiresAt < new Date()) {
      throw new Error('URL has expired');
    }

    // Increment the access count for the URL
    URLRepository.incrementAccessCount(shortCode);

    return urlEntry.longUrl;
  }

  // Get statistics about the given shortCode (access count, expiration, etc.)
  async getURLStats(shortCode) {
    const urlEntry = URLRepository.findByShortCode(shortCode);

    if (!urlEntry) {
      throw new Error('URL not found');
    }

    return {
      longUrl: urlEntry.longUrl,
      accessCount: urlEntry.accessCount,
      createdAt: urlEntry.createdAt,
      expiresAt: urlEntry.expiresAt
    };
  }
}

export default new URLService();
