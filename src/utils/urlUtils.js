import { nanoid } from 'nanoid';
import validator from 'validator';
import config from '../config/config.js';

class URLUtils {
  // Generate a unique short code for the URL
  static generateShortCode() {
    return nanoid(config.URL_CODE_LENGTH);
  }

  // Calculate expiration time-to-live (TTL) for the URL
  static calculateExpirationTTL(ttl) {
    return new Date(Date.now() + (ttl || config.DEFAULT_TTL_HOURS) * 3600000);
  }

  // Validate the URL
  static isValidURL(url) {
    try {
      if (!url || url.length > config.MAX_URL_LENGTH) {
        return false;
      }

      const parsedUrl = new URL(url);

      if (!config.ALLOWED_PROTOCOLS.includes(parsedUrl.protocol)) {
        return false;
      }

      return validator.isURL(url, {
        protocols: config.ALLOWED_PROTOCOLS.map((p) => p.replace(':', '')),
        require_protocol: true,
        require_valid_protocol: true,
      });
    } catch (error) {
      return false;
    }
  }
}

export default URLUtils;
