import validator from 'validator';
import config from '../config/config.js';

class ValidationService {
  isValidURL(url) {
    try {
      // Check if URL is valid and not too long
      if (!url || url.length > config.MAX_URL_LENGTH) {
        return false;
      }

      // Validate URL syntax
      const parsedUrl = new URL(url);

      // Check protocol
      if (!config.ALLOWED_PROTOCOLS.includes(parsedUrl.protocol)) {
        return false;
      }

      // Additional checks
      return validator.isURL(url, {
        protocols: config.ALLOWED_PROTOCOLS.map(p => p.replace(':', '')),
        require_protocol: true,
        require_valid_protocol: true
      });
    } catch (error) {
      return false;
    }
  }
}

export default new ValidationService();