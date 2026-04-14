// QRIS static payment helper
export function generateQRISUrl(amount: number, orderId: string) {
	// In production, this would use Midtrans QRIS API
	return `https://api.sandbox.midtrans.com/v2/qris/${orderId}?amount=${amount}`;
}
