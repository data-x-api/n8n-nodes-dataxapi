// Turns the node's fields into one DataXAPI request.

import { OPERATIONS } from './operations';
import type { Operation } from './types';

export type Params = Record<string, unknown>;

export interface Route {
	endpoint: string;
	params: Params;
}

export const ENDPOINT_ID = /^[a-z0-9_]+(\.[a-z0-9_]+)+$/;

// A request carrying one of these goes as POST with a JSON body.
export const BODY_PARAMS = ['ids', 'keywords'];

export class RouteError extends Error {}

export function operation(endpoint: string): Operation {
	const op = OPERATIONS.find((o) => o.endpoint === endpoint);
	if (!op) throw new RouteError(`Unknown operation "${endpoint}".`);
	return op;
}

// Reads one generated operation's fields through `get`.
export function operationRoute(endpoint: string, get: (name: string) => unknown): Route {
	const op = operation(endpoint);
	const params: Params = {};
	for (const field of op.fields) {
		const raw = get(field.name);
		// A number field cannot be left empty in n8n; 0 on an optional one means not set.
		const unset = field.kind === 'number' && !field.required && Number(raw) === 0;
		if (unset || raw === undefined || raw === null || (typeof raw === 'string' && raw.trim() === '')) {
			if (field.required) throw new RouteError(`"${field.displayName}" is required.`);
			continue;
		}
		if (field.list) {
			const items = (Array.isArray(raw) ? raw : String(raw).replace(/，/g, ',').split(','))
				.map((v) => String(v).trim())
				.filter(Boolean);
			if (items.length) params[field.name] = items;
		} else if (field.kind === 'number') {
			const n = Number(raw);
			if (!Number.isFinite(n)) throw new RouteError(`"${field.displayName}" must be a number.`);
			params[field.name] = Math.trunc(n);
		} else {
			params[field.name] = typeof raw === 'string' ? raw.trim() : raw;
		}
	}
	return { endpoint: op.endpoint, params };
}

export function callEndpoint(endpoint: string, raw: unknown): Route {
	const id = (endpoint ?? '').trim();
	if (!ENDPOINT_ID.test(id)) {
		throw new RouteError(
			'The endpoint ID must look like "douyin.videos.comments.list"; find one with Any Endpoint → Find.',
		);
	}
	let params: unknown = raw;
	if (raw === undefined || raw === null || (typeof raw === 'string' && raw.trim() === '')) {
		params = {};
	} else if (typeof raw === 'string') {
		try {
			params = JSON.parse(raw);
		} catch {
			params = undefined; // reported as "not a JSON object" below
		}
	}
	if (typeof params !== 'object' || params === null || Array.isArray(params)) {
		throw new RouteError('Parameters must be a JSON object.');
	}
	return { endpoint: id, params: params as Params };
}

export function endpointPath(endpoint: string): string {
	return '/v1/' + endpoint.split('.').join('/');
}

export function cleanParams(params: Params): Params {
	const out: Params = {};
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null || value === '') continue;
		if (Array.isArray(value) && value.length === 0) continue;
		out[key] = value;
	}
	return out;
}

export function usesBody(params: Params): boolean {
	return BODY_PARAMS.some((name) => name in params);
}

export function toQuery(params: Params): Record<string, string> {
	const qs: Record<string, string> = {};
	for (const [key, value] of Object.entries(params)) {
		qs[key] = Array.isArray(value) ? value.map(String).join(',') : String(value);
	}
	return qs;
}

// One call returns data.items (a list) or a single object.
export function resultItems(data: unknown): Array<Record<string, unknown>> {
	if (data && typeof data === 'object') {
		const record = data as Record<string, unknown>;
		if (Array.isArray(record.items)) return record.items as Array<Record<string, unknown>>;
		if (record.item && typeof record.item === 'object') {
			return [record.item as Record<string, unknown>];
		}
		return [record];
	}
	return [];
}
