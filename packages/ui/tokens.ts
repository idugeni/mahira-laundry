// Brand design tokens untuk Mahira Laundry Jakarta
export const brandTokens = {
	colors: {
		primary: {
			50: "#e6f5ee",
			100: "#b3e0cd",
			200: "#80cbac",
			300: "#4db68b",
			400: "#26a673",
			500: "#1a6b4a", // brand primary teal
			600: "#155c3f",
			700: "#104d34",
			800: "#0b3e29",
			900: "#062f1e",
		},
		accent: {
			50: "#fdf8e8",
			100: "#f9e9b8",
			200: "#f5da88",
			300: "#f0cb58",
			400: "#ecbf35",
			500: "#d4a017", // brand accent gold
			600: "#b88a14",
			700: "#9c7411",
			800: "#805e0e",
			900: "#64480b",
		},
		neutral: {
			50: "#f8f9fa",
			100: "#f1f3f5",
			200: "#e9ecef",
			300: "#dee2e6",
			400: "#ced4da",
			500: "#adb5bd",
			600: "#868e96",
			700: "#495057",
			800: "#343a40",
			900: "#212529",
		},
		success: "#22c55e",
		warning: "#f59e0b",
		danger: "#ef4444",
		info: "#3b82f6",
	},
	fonts: {
		heading: "'Plus Jakarta Sans', sans-serif",
		body: "'Inter', sans-serif",
		mono: "'JetBrains Mono', monospace",
	},
	spacing: {
		xs: "0.25rem",
		sm: "0.5rem",
		md: "1rem",
		lg: "1.5rem",
		xl: "2rem",
		"2xl": "3rem",
		"3xl": "4rem",
	},
	borderRadius: {
		sm: "0.375rem",
		md: "0.5rem",
		lg: "0.75rem",
		xl: "1rem",
		"2xl": "1.5rem",
		full: "9999px",
	},
} as const;

export type BrandTokens = typeof brandTokens;
