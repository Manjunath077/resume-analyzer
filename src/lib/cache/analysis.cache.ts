import { getRedisConnection } from "@/lib/redis/redis.connection";

const CACHE_TTL = 60 * 60 * 24 * 2; // 2 days

export async function getCachedAnalysis(key: string) {
    const redis = getRedisConnection(); // Get the Redis connection instance
    const data = await redis.get(key);

    if (!data) return null;

    return JSON.parse(data);
}

export async function setCachedAnalysis(key: string, value: any) {
    const redis = getRedisConnection(); // Get the Redis connection instance
    await redis.set(
        key,
        JSON.stringify(value),
        "EX",
        CACHE_TTL
    );
}

// Optional: Add a function to delete cached analysis
export async function deleteCachedAnalysis(key: string) {
    const redis = getRedisConnection();
    await redis.del(key);
}

// Optional: Add a function to check if analysis exists in cache
export async function hasCachedAnalysis(key: string): Promise<boolean> {
    const redis = getRedisConnection();
    const exists = await redis.exists(key);
    return exists === 1;
}