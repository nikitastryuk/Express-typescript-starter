import mongoose from 'mongoose';
import redis, { RedisClient } from 'redis';
import util from 'util';

let redisClient: RedisClient;

// TODO: Replace with CacheService class
// Just experimenting
export function startRedisConnection() {
  redisClient = redis.createClient();

  redisClient.hgetAsync = util.promisify(redisClient.hget);
  redisClient.hsetAsync = util.promisify(redisClient.hset);

  // Monkey patch mongoose exec method
  const exec = mongoose.Query.prototype.exec;

  mongoose.Query.prototype.cache = function(options: any = {}) {
    this.useCache = true;
    // Dynamic top-level hashKey
    this.hashKey = JSON.stringify(options.hashKey || '');

    return this;
  };

  mongoose.Query.prototype.exec = async function() {
    // No cache
    if (!this.useCache) {
      return exec.apply(this, arguments);
    }

    // {...query, collection: name }
    const key = JSON.stringify({ ...this.getQuery(), collection: this.mongooseCollection.name });
    // Get cache
    const cacheValue = await redisClient.hgetAsync(this.hashKey, key);
    if (cacheValue) {
      const value = JSON.parse(cacheValue);
      // Mongoose exec expects us to return mongoose documents
      return Array.isArray(value) ? value.map(item => new this.model(item)) : new this.model(value);
    }

    const result = await exec.apply(this, arguments);
    // Set cache
    // key: ...hashkey
    // value:  { nestedKey: ...key, nestedValue: ...result }
    if (result) {
      redisClient.hsetAsync(this.hashKey, key, JSON.stringify(result));
    }
    return result;
  };
}

export function stopRedisConnection() {
  redisClient.quit();
}

export function removeHashKeyFromCache(hashKey: any) {
  redisClient.del(JSON.stringify(hashKey));
}
