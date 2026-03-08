// This file:
// Creates one Redis connection,  Used by :
// BullMQ Queue
// BullMQ Worker
// Future caching
// Rate limiting

// This is called a singleton pattern - you only create one messenger and reuse it everywhere, which saves resources and ensures everyone talks to the same messenger.

import { Redis, RedisOptions } from "ioredis";

let redis: Redis | null = null;

export function getRedisConfig(): RedisOptions {
  return {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
  };
}

export function getRedisConnection(): Redis {
  if (!redis) {
    redis = new Redis(getRedisConfig());

    redis.on("connect", () => {
      console.log("✅ Redis connected");
    });

    redis.on("error", (err) => {
      console.error("❌ Redis error:", err);
    });
  }

  return redis;
}