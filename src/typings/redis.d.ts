import '@types/redis';
declare module 'redis' {
  export interface RedisClient {
    setAsync(key: string, value: string): Promise<void>;
    getAsync(key: string): Promise<string>;
  }
}
