import React from "react";

interface JsonLdProps {
	data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Valid JSON-LD injection
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
}
