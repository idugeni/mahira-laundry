import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactCompiler: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.supabase.co",
				pathname: "/storage/v1/object/public/**",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				pathname: "/**",
			},
		],
	},
	env: {
		NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
	},
	experimental: {
		serverActions: {
			allowedOrigins: [
				"*.ngrok-free.app",
				"8af7-2001-448a-b010-1857-48b4-4f4-6cd4-fc70.ngrok-free.app",
			],
		},
	},
};

export default nextConfig;
