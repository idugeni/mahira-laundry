/**
 * Utilities for exporting data to various formats
 */

/**
 * Converts JSON data to CSV and triggers browser download
 */
export function exportToCSV(data: any[], filename: string) {
	if (data.length === 0) return;

	// 1. Get headers
	const headers = Object.keys(data[0]);

	// 2. Build CSV string
	const csvRows = [];

	// Add headers row
	csvRows.push(headers.join(","));

	// Add data rows
	for (const row of data) {
		const values = headers.map((header) => {
			const val = row[header];
			const escaped = `${val}`.replace(/"/g, '""'); // Escape double quotes
			return `"${escaped}"`; // Wrap in double quotes
		});
		csvRows.push(values.join(","));
	}

	const csvContent = csvRows.join("\n");

	// 3. Create blob and download
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");

	link.setAttribute("href", url);
	link.setAttribute("download", `${filename}_${Date.now()}.csv`);
	link.style.visibility = "hidden";

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
