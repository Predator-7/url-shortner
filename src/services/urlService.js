import config from '../config/config.js';
import URLRepository from '../repositories/urlRepository.js';
import URLUtils from '../utils/urlUtils.js';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';

class URLService {
  constructor() {
    this.config = config;
    this.rateLimiter = this.initRateLimiter();
  }

  // Initialize rate limiter with Redis
  initRateLimiter() {
    const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    return new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: 'url_shortener_middleware',
      points: 10, // 10 requests
      duration: 1, // per 1 second
    });
  }

  // Generate a short URL using the configured BASE_URL
  generateShortUrl(shortCode) {
    return `${this.config.BASE_URL}/${shortCode}`;
  }

  // Create a new shortened URL
  async shortenURL(longUrl, options = {}, clientIp) {
    try {
      // Rate limiting
      await this.rateLimiter.consume(clientIp);

      // Validate URL
      if (!URLUtils.isValidURL(longUrl)) {
        throw new Error('Invalid URL');
      }

      // Check for an existing URL in the repository
      const existingEntry = await URLRepository.findExistingURL(longUrl);
      if (existingEntry) {
        return { shortUrl: this.generateShortUrl(existingEntry.shortCode) };
      }

      // Generate unique short code and calculate expiration
      const shortCode = URLUtils.generateShortCode();
      const expiresAt = URLUtils.calculateExpirationTTL(options.ttl);

      // Save the new URL entry in the repository
      const urlEntry = await URLRepository.create(shortCode, longUrl, { expiresAt });

      return { shortUrl: this.generateShortUrl(urlEntry.shortCode) };
    } catch (error) {
      if (error instanceof Error && error.message.includes('RateLimiterRes')) {
        throw new Error('Too many requests, please try again later');
      }
      throw error;
    }
  }

  // Fetch the redirect URL for a given short code
  async getRedirectURL(shortCode) {
    const urlEntry = await URLRepository.findByShortCode(shortCode);

    if (!urlEntry) {
      throw new Error('URL not found');
    }

    // Check if the URL has expired
    if (urlEntry.expiresAt && new Date(urlEntry.expiresAt) < new Date()) {
      throw new Error('URL has expired');
    }

    // Increment the access count for the URL
    await URLRepository.incrementAccessCount(shortCode);

    return urlEntry.longUrl;
  }

  // Get statistics for a given short code
  async getURLStats(shortCode) {
    const urlEntry = await URLRepository.findByShortCode(shortCode);

    if (!urlEntry) {
      throw new Error('URL not found');
    }

    return {
      longUrl: urlEntry.longUrl,
      accessCount: urlEntry.accessCount,
      createdAt: urlEntry.createdAt,
      expiresAt: urlEntry.expiresAt,
    };
  }
}

export default new URLService();
