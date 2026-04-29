import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export const publicApiLimiter = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(10, "10 s"),
	prefix: "mahira:ratelimit:public",
});

export const authLimiter = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(5, "60 s"),
	prefix: "mahira:ratelimit:auth",
});

export const formLimiter = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(3, "60 s"),
	prefix: "mahira:ratelimit:form",
});

export const apiLimiter = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(30, "10 s"),
	prefix: "mahira:ratelimit:api",
});
