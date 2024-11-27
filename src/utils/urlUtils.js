import { nanoid } from 'nanoid';
import config from '../config/config.js';

class URLUtils {

  static generateShortCode() {
    return nanoid(config.URL_CODE_LENGTH);
  }

  static calculateExpirationTTL(ttl) {
    return new Date(Date.now() + (ttl || config.DEFAULT_TTL_HOURS) * 3600000);
  }
}

export default URLUtils;
