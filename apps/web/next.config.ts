import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : "*.supabase.co";

const nextConfig: NextConfig = {

	reactCompiler: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: supabaseHostname,
				pathname: "/storage/v1/object/public/**",
			},


			{
				protocol: "https",
				hostname: "images.unsplash.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "i.pravatar.cc",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "ui-avatars.com",
				pathname: "/**",
			},
		],
		unoptimized: true,
	},

	env: {
		NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "10mb",
		},
	},
};

export default nextConfig;
