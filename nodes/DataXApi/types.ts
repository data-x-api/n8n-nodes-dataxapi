export interface Resource {
	value: string;
	name: string;
}

export interface Field {
	name: string;
	displayName: string;
	kind: 'string' | 'number' | 'options';
	// Sent as a list; the form takes it comma-separated.
	list: boolean;
	required: boolean;
	options?: Array<{ name: string; value: string }>;
	default: string;
	description: string;
	placeholder: string;
}

export interface Operation {
	endpoint: string;
	resource: string;
	name: string;
	description: string;
	pages: boolean;
	fields: Field[];
}
