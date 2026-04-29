interface JsonLdProps {
	data: unknown;
	id?: string;
}

function serializeJsonLd(data: unknown) {
	return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data, id }: JsonLdProps) {
	const json = serializeJsonLd(data);

	return (
		<script
			id={id}
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Valid JSON-LD injection
			dangerouslySetInnerHTML={{ __html: json }}
		/>
	);
}
