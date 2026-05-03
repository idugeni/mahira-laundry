import { Client } from "@upstash/qstash";

const QSTASH_TOKEN = process.env.QSTASH_TOKEN;

const qstash = QSTASH_TOKEN
	? new Client({
			token: QSTASH_TOKEN,
		})
	: null;

function resolveDestinationUrl(url: string): string {
	if (/^https?:\/\//i.test(url)) {
		return url;
	}

	const appUrl = process.env.NEXT_PUBLIC_APP_URL;
	if (!appUrl) {
		throw new Error("NEXT_PUBLIC_APP_URL wajib diset untuk mengirim job QStash.");
	}

	return new URL(url, appUrl).toString();
}

export async function enqueueJob(
	url: string,
	body: Record<string, unknown>,
	options?: { delay?: number; retries?: number },
) {
	if (!qstash) {
		if (process.env.NODE_ENV === "production") {
			throw new Error("QSTASH_TOKEN wajib diset untuk mengirim job background.");
		}
		return false;
	}

	try {
		await qstash.publishJSON({
			url: resolveDestinationUrl(url),
			body,
			delay: options?.delay,
			retries: options?.retries || 3,
		});
		return true;
	} catch (_error) {
		if (process.env.NODE_ENV === "production") {
			throw _error;
		}
		return false;
	}
}
