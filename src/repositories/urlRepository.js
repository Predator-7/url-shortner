import URLModel from '../models/urlModel.js';

class URLRepository {
  async findByShortCode(shortCode) {
    return URLModel.get(shortCode);
  }

  async create(shortCode, longUrl, options) {
    const entry = {
      longUrl,
      shortCode,
      createdAt: new Date(),
      accessCount: 0,
      expiresAt: options.expiresAt || null,
    };
    await URLModel.set(shortCode, entry);
    return entry;
  }

  async incrementAccessCount(shortCode) {
    const urlEntry = await this.findByShortCode(shortCode);
    if (urlEntry) {
      urlEntry.accessCount += 1;
      await URLModel.set(shortCode, urlEntry);
    }
  }

  async cleanupExpiredUrls() {
    const now = new Date();
    const expiredEntries = await URLModel.findEntries(
      (entry) => entry.expiresAt && new Date(entry.expiresAt) < now
    );
    for (const { key } of expiredEntries) {
      await URLModel.delete(key);
    }
  }

  async findExistingURL(longUrl) {
    const entries = await URLModel.findEntries((entry) => entry.longUrl === longUrl);
    return entries.length > 0 ? entries[0].entry : null;
  }
}

export default new URLRepository();
