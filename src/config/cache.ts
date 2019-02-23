import mongoose from 'mongoose';
import redis from 'redis';
import util from 'util';

const client = redis.createClient(process.env.redisUrl as string);

client.getAsync = util.promisify(client.get);
client.setAsync = util.promisify(client.set);

// Monkey patch mongoose exec method
const exec = mongoose.Query.prototype.exec;

// mongoose.Query.prototype.cache = function(options = {}) {
//   this.useCache = true;

//   this.hashKey = JSON.stringify(options.key || '');

//   return this;
// };

mongoose.Query.prototype.exec = async function() {
  // if (!this.useCache) {
  //   return exec.apply(this, arguments);
  // }
  console.log(this.getQuery());
  /* tslint:disable-next-line */
  console.log(this);
  // const key = JSON.stringify({ ...this.getQuery, collection: this.mongooseCollection.name });
  // const cacheValue = await client.hget(this.hashKey, key);
  // if (cacheValue) {
  //   const doc = JSON.parse(cacheValue);
  //   return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(doc);
  // }
  return exec.apply(this, arguments);
  // client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);
  // return result;
};
