import { createClient } from 'redis';


class URLModel {
  constructor() {
    this.redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    this.redisClient.on('error', (err) => {
      console.error('Redis Client Error', err);
    });
  }

  async connect() {
    if (!this.redisClient.isOpen) {
      await this.redisClient.connect();
    }
  }

  async set(key, value) {
    await this.connect();
    await this.redisClient.set(key, JSON.stringify(value));
  }

  async get(key) {
    await this.connect();
    const data = await this.redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async delete(key) {
    await this.connect();
    await this.redisClient.del(key);
  }

  async findEntries(predicate) {
    await this.connect();
    const keys = await this.redisClient.keys('*');
    const entries = await Promise.all(
      keys.map(async (key) => {
        const entry = await this.get(key);
        return { key, entry };
      })
    );
    return entries.filter(({ entry }) => predicate(entry));
  }
}

export default new URLModel();