import URLModel from '../models/urlModel.js';

class URLRepository {
  // Find URL entry by shortCode
  findByShortCode(shortCode) {
    return URLModel.getDatabase().get(shortCode);
  }

  // Create a new URL entry in the database
  create(shortCode, longUrl, options = {}) {
    const entry = {
      longUrl,
      shortCode,
      createdAt: new Date(),
      accessCount: 0,
      expiresAt: options.expiresAt || null,
      ...options,
    };

    URLModel.getDatabase().set(shortCode, entry);
    return entry;
  }

  // Increment the access count of a URL entry
  incrementAccessCount(shortCode) {
    const urlEntry = this.findByShortCode(shortCode);
    if (urlEntry) {
      urlEntry.accessCount += 1;
    }
    return urlEntry;
  }

  // Cleanup expired URLs
  cleanupExpiredUrls() {
    const now = new Date();
    for (const [shortCode, entry] of URLModel.getDatabase().entries()) {
      if (entry.expiresAt && entry.expiresAt < now) {
        URLModel.getDatabase().delete(shortCode);
      }
    }
  }

  // Find an existing URL entry by its long URL
  findExistingURL(longUrl) {
    for (const [, entry] of URLModel.getDatabase().entries()) {
      if (entry.longUrl === longUrl) {
        return entry;
      }
    }
    return null;
  }
}

export default new URLRepository();
