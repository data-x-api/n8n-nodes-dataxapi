import { randomUUID } from 'crypto';
import {
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
	type IDataObject,
	type IExecuteFunctions,
	type IHttpRequestOptions,
	type INodeExecutionData,
	type INodeProperties,
	type INodeType,
	type INodeTypeDescription,
	type JsonObject,
} from 'n8n-workflow';
import { OPERATIONS, RESOURCES } from './operations';
import {
	callEndpoint,
	cleanParams,
	endpointPath,
	operationRoute,
	resultItems,
	toQuery,
	usesBody,
	type Params,
	type Route,
} from './routes';

const BASE_URL = 'https://api.dataxapi.com';
const SOURCE = 'n8n';
const ANY = 'any';

const byName = <T extends { name: string }>(a: T, b: T) => a.name.localeCompare(b.name);

// One "Operation" dropdown per platform, its operations in alphabetical order; the default is the one customers use most.
function operationProperties(): INodeProperties[] {
	const props: INodeProperties[] = RESOURCES.map((resource) => {
		const ops = OPERATIONS.filter((op) => op.resource === resource.value);
		const mostUsed = ops[0].endpoint;
		const property: INodeProperties = {
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			default: mostUsed,
			noDataExpression: true,
			displayOptions: { show: { resource: [resource.value] } },
			options: ops
				.map((op) => ({
					name: op.name,
					value: op.endpoint,
					description: op.description,
					action: `${resource.name}: ${op.name.toLowerCase()}`,
				}))
				.sort(byName),
		};
		return property;
	});
	props.push({
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [ANY] } },
		options: [
			{
				name: 'Call',
				value: 'call',
				description: "Call any of DataXAPI's 237 endpoints by its ID, at that endpoint's price",
				action: 'Call any endpoint',
			},
			{
				name: 'Find',
				value: 'find',
				description: 'Free: endpoints for a need described in plain words, with price and parameters',
				action: 'Find an endpoint',
			},
		],
		default: 'find',
	});
	return props;
}

// The generated operations' own fields, each shown only under its operation.
function fieldProperties(): INodeProperties[] {
	const props: INodeProperties[] = [];
	for (const op of OPERATIONS) {
		for (const field of op.fields) {
			const show = { show: { resource: [op.resource], operation: [op.endpoint] } };
			const base = {
				displayName: field.displayName,
				name: field.name,
				required: field.required,
				description: field.description,
				displayOptions: show,
			};
			if (field.kind === 'options') {
				const options = [...(field.options ?? [])].sort(byName);
				if (!field.required && !field.default) options.unshift({ name: 'Any', value: '' });
				props.push({ ...base, type: 'options', options, default: field.default });
			} else if (field.kind === 'number') {
				props.push({ ...base, type: 'number', default: 0 });
			} else {
				props.push({ ...base, type: 'string', default: '', placeholder: field.placeholder });
			}
		}
	}
	return props;
}

const PAGED = OPERATIONS.filter((op) => op.pages).map((op) => op.endpoint);

export class DataXApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'DataXAPI',
		name: 'dataXApi',
		icon: { light: 'file:../../icons/dataxapi.svg', dark: 'file:../../icons/dataxapi.dark.svg' },
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description:
			'Public data from Douyin, Xiaohongshu, WeChat Official Accounts and Channels, Weibo, Bilibili, Zhihu, Kuaishou, TikTok, YouTube, X and Reddit. No sign-in to your own platform accounts; charged per call, errors are not charged.',
		defaults: {
			name: 'DataXAPI',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'dataXApiApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					...RESOURCES.map((r) => ({ name: r.name, value: r.value })),
					{ name: 'Any Endpoint', value: ANY },
				].sort(byName),
				default: 'douyin',
			},
			...operationProperties(),
			{
				displayName:
					'No sign-in to your own platform account is needed. Each page is one call, charged on its own from your DataXAPI balance; errors are not charged. Each operation states its price.',
				name: 'billingNotice',
				type: 'notice',
				default: '',
			},
			...fieldProperties(),
			// Any endpoint
			{
				displayName: 'What Data',
				name: 'need',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'e.g. xiaohongshu note comments',
				description: 'The data you need, in plain words, Chinese or English',
				displayOptions: { show: { resource: [ANY], operation: ['find'] } },
			},
			{
				displayName: 'Platform',
				name: 'platform',
				type: 'string',
				default: '',
				placeholder: 'e.g. wechat_channels',
				description: 'Optional, to narrow it down: douyin, xiaohongshu, wechat_mp, wechat_channels, tiktok and so on',
				displayOptions: { show: { resource: [ANY], operation: ['find'] } },
			},
			{
				displayName: 'Endpoint ID',
				name: 'endpoint',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'douyin.users.get',
				description: 'The endpoint ID; Any Endpoint → Find gives it',
				displayOptions: { show: { resource: [ANY], operation: ['call'] } },
			},
			{
				displayName: 'Parameters (JSON)',
				name: 'parameters',
				type: 'json',
				required: true,
				default: '{}',
				placeholder: '{"query": "coffee", "sort": "latest"}',
				description: 'The endpoint parameters as a JSON object; Any Endpoint → Find gives an example',
				displayOptions: { show: { resource: [ANY], operation: ['call'] } },
			},
			// Paging and output
			{
				displayName: 'Max Pages',
				name: 'maxPages',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 100 },
				default: 1,
				description: 'Stop after this many pages. Each page is one call, charged on its own; errors are not charged.',
				displayOptions: { show: { operation: [...PAGED, 'call'] } },
			},
			{
				displayName: 'Output',
				name: 'output',
				type: 'options',
				options: [
					{
						name: 'One Item per Result',
						value: 'items',
						description: 'Each post, comment or account becomes its own n8n item',
					},
					{
						name: 'One Item per Page',
						value: 'pages',
						description: 'Each call becomes one item with endpoint, params, data, page, billing and warnings',
					},
				],
				default: 'items',
				displayOptions: { hide: { operation: ['find'] } },
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: { show: { operation: [...PAGED, 'call'] } },
				options: [
					{
						displayName: 'Start Cursor',
						name: 'cursor',
						type: 'string',
						default: '',
						description:
							'Leave empty to start from the first page. To continue, paste page.next_cursor from an earlier run.',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const inputs = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < inputs.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const op = this.getNodeParameter('operation', i) as string;

			if (resource === ANY && op === 'find') {
				const result = await findEndpoints(
					this,
					i,
					this.getNodeParameter('need', i, '') as string,
					this.getNodeParameter('platform', i, '') as string,
				);
				if ('error' in result) {
					if (this.continueOnFail()) {
						returnData.push({ json: { error: result.error.message }, pairedItem: { item: i } });
						continue;
					}
					throw result.error;
				}
				for (const match of result.matches) returnData.push({ json: match, pairedItem: { item: i } });
				continue;
			}

			let route: Route;
			try {
				route =
					resource === ANY
						? callEndpoint(
								this.getNodeParameter('endpoint', i, '') as string,
								this.getNodeParameter('parameters', i, '{}'),
							)
						: operationRoute(op, (name) => this.getNodeParameter(name, i, ''));
			} catch (error) {
				const message = `${(error as Error).message} Nothing was charged.`;
				if (this.continueOnFail()) {
					returnData.push({ json: { error: message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), message, { itemIndex: i });
			}

			const paged = resource === ANY || PAGED.includes(route.endpoint);
			const maxPages = paged ? Math.max(1, Math.floor(this.getNodeParameter('maxPages', i, 1) as number)) : 1;
			const output = this.getNodeParameter('output', i, 'items') as string;
			const options = (paged ? this.getNodeParameter('options', i, {}) : {}) as IDataObject;
			let cursor = (options.cursor as string) || (route.params.cursor as string) || '';

			for (let page = 0; page < maxPages; page++) {
				const result = await callDataXApi(this, i, route.endpoint, { ...route.params, cursor });
				if ('error' in result) {
					if (this.continueOnFail()) {
						returnData.push({
							json: { error: result.error.message, description: result.error.description },
							pairedItem: { item: i },
						});
						break;
					}
					throw result.error;
				}

				const envelope = result.envelope;
				const meta = (envelope.meta ?? {}) as IDataObject;
				const pageInfo = (envelope.page ?? null) as IDataObject | null;

				if (output === 'pages') {
					returnData.push({
						json: {
							request_id: envelope.request_id,
							endpoint: route.endpoint,
							params: route.params as IDataObject,
							data: envelope.data,
							page: pageInfo,
							warnings: envelope.warnings ?? [],
							billing: meta.billing ?? null,
							fetched_at: meta.fetched_at ?? null,
						} as IDataObject,
						pairedItem: { item: i },
					});
				} else {
					for (const item of resultItems(envelope.data)) {
						returnData.push({ json: item as IDataObject, pairedItem: { item: i } });
					}
				}

				const next = pageInfo?.next_cursor as string | null | undefined;
				if (!next || pageInfo?.has_more === false) break;
				cursor = next;
			}
		}

		return [returnData];
	}
}

async function send(
	ctx: IExecuteFunctions,
	request: IHttpRequestOptions,
): Promise<{ statusCode: number; body: IDataObject }> {
	const response = (await ctx.helpers.httpRequestWithAuthentication.call(ctx, 'dataXApiApi', {
		...request,
		json: true,
		ignoreHttpStatusErrors: true,
		returnFullResponse: true,
	})) as { statusCode: number; body: unknown };
	return { statusCode: response.statusCode, body: (response.body ?? {}) as IDataObject };
}

function apiError(ctx: IExecuteFunctions, itemIndex: number, statusCode: number, body: IDataObject): NodeApiError {
	const code = typeof body.code === 'string' ? body.code : 'http_error';
	const message = typeof body.message === 'string' ? body.message : `HTTP ${statusCode}`;
	let charged = 'Nothing was charged.';
	if (body.charged === null) {
		charged = `Whether it was charged is not known; look up /v1/calls/${String(body.request_id)}.`;
	}
	return new NodeApiError(ctx.getNode(), body as JsonObject, {
		message: `DataXAPI ${code}: ${message}`,
		description: `${charged}${body.retry ? ` Retry: ${String(body.retry)}.` : ''}${
			body.request_id ? ` Request ID: ${String(body.request_id)}.` : ''
		}`,
		httpCode: String(statusCode),
		itemIndex,
	});
}

// The catalog search is free and calls no data endpoint.
async function findEndpoints(
	ctx: IExecuteFunctions,
	itemIndex: number,
	need: string,
	platform: string,
): Promise<{ matches: IDataObject[] } | { error: NodeApiError | NodeOperationError }> {
	if (!need.trim()) {
		return { error: new NodeOperationError(ctx.getNode(), 'Describe the data you need.', { itemIndex }) };
	}
	const { statusCode, body } = await send(ctx, {
		method: 'GET',
		url: `${BASE_URL}/v1/catalog/search`,
		qs: toQuery(cleanParams({ query: need.trim(), platform: platform.trim() })),
		headers: { Accept: 'application/json', 'X-Source': SOURCE },
	});
	if (statusCode < 200 || statusCode >= 300) return { error: apiError(ctx, itemIndex, statusCode, body) };
	const data = (body.data ?? {}) as IDataObject;
	const matches = ((data.matches ?? []) as IDataObject[])
		.filter((m) => m.type === 'capability')
		.map((m) => {
			const pricing = (m.pricing ?? {}) as IDataObject;
			return {
				endpoint: m.id,
				name: m.name,
				summary: m.summary,
				required: m.required,
				price: pricing.price,
				per: pricing.per,
				example_params: ((m.example ?? {}) as IDataObject).params ?? {},
				docs: `https://dataxapi.com${String(m.url ?? '/apis/')}`,
			} as IDataObject;
		});
	return { matches };
}

async function callDataXApi(
	ctx: IExecuteFunctions,
	itemIndex: number,
	endpoint: string,
	rawParams: Params,
): Promise<{ envelope: IDataObject } | { error: NodeApiError }> {
	const params = cleanParams(rawParams);
	const post = usesBody(params);
	const request: IHttpRequestOptions = {
		method: post ? 'POST' : 'GET',
		url: BASE_URL + endpointPath(endpoint),
		headers: {
			Accept: 'application/json',
			'X-Source': SOURCE,
			// A fresh key per call: a workflow run again is a new call.
			'Idempotency-Key': randomUUID(),
		},
	};
	if (post) request.body = params as IDataObject;
	else request.qs = toQuery(params);

	const { statusCode, body } = await send(ctx, request);
	if (statusCode >= 200 && statusCode < 300 && typeof body === 'object') return { envelope: body };
	return { error: apiError(ctx, itemIndex, statusCode, body) };
}
