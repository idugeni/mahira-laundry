import { Client } from "@upstash/qstash";

const QSTASH_TOKEN = process.env.QSTASH_TOKEN;

if (!QSTASH_TOKEN) {
	throw new Error("QSTASH_TOKEN must be set");
}

export const qstash = new Client({
	token: QSTASH_TOKEN,
});

export async function enqueueJob(
	url: string,
	body: Record<string, unknown>,
	options?: { delay?: number; retries?: number },
) {
	if (!process.env.QSTASH_TOKEN) {
		console.warn("[QStash] QSTASH_TOKEN not set, skipping job enqueue");
		return;
	}

	try {
		await qstash.publishJSON({
			url,
			body,
			delay: options?.delay,
			retries: options?.retries || 3,
		});
	} catch (error) {
		console.error("[QStash] Failed to enqueue job:", error);
	}
}
