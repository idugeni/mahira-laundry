import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export function safeCompare(a: string, b: string): boolean {
	const left = Buffer.from(a);
	const right = Buffer.from(b);

	return left.length === right.length && timingSafeEqual(left, right);
}

export function sha512Hex(input: string): string {
	return createHash("sha512").update(input).digest("hex");
}

export function hmacSha256Hex(secret: string, payload: string): string {
	return createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifySharedWebhookSecret(request: Request, body: string, secret: string): boolean {
	const headerSecret =
		request.headers.get("x-webhook-secret") ??
		request.headers.get("x-supabase-webhook-secret") ??
		request.headers.get("x-mahira-webhook-secret");

	if (headerSecret && safeCompare(headerSecret, secret)) {
		return true;
	}

	const authorization = request.headers.get("authorization");
	if (authorization?.startsWith("Bearer ") && safeCompare(authorization.slice(7), secret)) {
		return true;
	}

	const signature =
		request.headers.get("x-webhook-signature") ?? request.headers.get("x-supabase-signature");
	if (!signature) {
		return false;
	}

	const expectedHex = hmacSha256Hex(secret, body);
	const expectedPrefixed = `sha256=${expectedHex}`;

	return safeCompare(signature, expectedHex) || safeCompare(signature, expectedPrefixed);
}
