// Fonnte WhatsApp API integration
const FONNTE_API_URL = "https://api.fonnte.com/send";

interface WhatsAppMessage {
	to: string;
	message: string;
}

export async function sendWhatsApp({ to, message }: WhatsAppMessage) {
	const apiKey = process.env.FONNTE_API_KEY;
	if (!apiKey) {
		return { success: false, error: "API key not configured" };
	}

	try {
		const response = await fetch(FONNTE_API_URL, {
			method: "POST",
			headers: {
				Authorization: apiKey,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				target: to,
				message,
				countryCode: "62",
			}),
		});

		const data = await response.json();
		return { success: data.status, data };
	} catch (error) {
		return { success: false, error: String(error) };
	}
}
