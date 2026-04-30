import { redis } from "@/lib/upstash/redis";

const PREFIX = "mahira:cache";

export async function cache<T>(
	key: string,
	fetcher: () => Promise<T>,
	ttlSeconds: number,
): Promise<T> {
	const fullKey = `${PREFIX}:${key}`;

	try {
		if (redis) {
			const cached = await redis.get<string>(fullKey);
			if (cached !== null) {
				return JSON.parse(cached) as T;
			}
		}
	} catch {
		// Cache miss or parse error — proceed to fetch
	}

	const data = await fetcher();

	if (redis) {
		try {
			await redis.set(fullKey, JSON.stringify(data), { ex: ttlSeconds });
		} catch {
			// Redis write failure — non-critical, data still returned
		}
	}

	return data;
}

export async function invalidateCache(pattern: string): Promise<void> {
	if (redis) {
		try {
			const fullPattern = `${PREFIX}:${pattern}`;
			const keys = await redis.keys(fullPattern);
			if (keys.length > 0) {
				await redis.del(...keys);
			}
		} catch {
			// Invalidation failure — non-critical
		}
	}
}
