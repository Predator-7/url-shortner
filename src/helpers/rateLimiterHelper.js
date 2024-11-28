import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';
import config from '../config/config.js';

class RateLimiterHelper {
  constructor() {
    const redisClient = new Redis(config.REDIS_URL);
    this.rateLimiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: 'rate_limit',
      points: config.RATE_LIMIT_POINTS,
      duration: config.RATE_LIMIT_DURATION,
    });
  }

  async consume(key) {
    try {
      await this.rateLimiter.consume(key);
    } catch {
      throw new Error('Too many requests, please try again later');
    }
  }
}

export default new RateLimiterHelper();
