export default {
    PORT: process.env.PORT || 3000,
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    URL_CODE_LENGTH: 8,
    DEFAULT_TTL_HOURS: 24 * 7, // 1 week
    MAX_URL_LENGTH: 2048,
    ALLOWED_PROTOCOLS: ['http:', 'https:']
  };