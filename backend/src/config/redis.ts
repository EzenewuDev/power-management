import Redis from 'ioredis';
import { config } from './index';

export const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

export const cacheKeys = {
  currentStatus: (zoneId: number) => `power:status:${zoneId}`,
  allStatus: 'power:status:all',
  predictions: (zoneId: number) => `power:predictions:${zoneId}`,
  userSession: (userId: number) => `session:user:${userId}`,
};

export const getCurrentStatus = async (zoneId?: number) => {
  if (zoneId) {
    const status = await redis.get(cacheKeys.currentStatus(zoneId));
    return status ? JSON.parse(status) : null;
  }
  const allStatus = await redis.get(cacheKeys.allStatus);
  return allStatus ? JSON.parse(allStatus) : null;
};

export const setCurrentStatus = async (zoneId: number, status: any) => {
  const key = cacheKeys.currentStatus(zoneId);
  await redis.setex(key, 300, JSON.stringify(status)); // 5 minute TTL
  
  // Update all status cache
  const allStatus = await getAllStatus();
  const updated = { ...allStatus, [zoneId]: status };
  await redis.setex(cacheKeys.allStatus, 300, JSON.stringify(updated));
};

export const getAllStatus = async () => {
  const allStatus = await redis.get(cacheKeys.allStatus);
  return allStatus ? JSON.parse(allStatus) : {};
};

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});
