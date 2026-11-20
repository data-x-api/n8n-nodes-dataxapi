// Unit tests against the built node in dist/. Every HTTP request is mocked.
const test = require('node:test');
const assert = require('node:assert/strict');
const { DataXApi } = require('../dist/nodes/DataXApi/DataXApi.node.js');
const { DataXApiApi } = require('../dist/credentials/DataXApiApi.credentials.js');

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

function envelope(items, nextCursor = null, amount = '0.02') {
	return {
		statusCode: 200,
		body: {
			code: 'ok',
			request_id: 'r-1',
			data: { items },
			page: { next_cursor: nextCursor, has_more: nextCursor !== null, returned: items.length },
			warnings: [],
			meta: {
				capability: 'x',
				fetched_at: '2026-10-29T00:00:00Z',
				billing: { amount, currency: 'USD', balance_after: '9.98' },
			},
		},
	};
}

function errorResponse(statusCode, code, charged = false) {
	return {
		statusCode,
		body: {
			code,
			request_id: 'r-err',
			message: 'The object does not exist',
			charged,
			retry: 'no',
			retry_after_seconds: null,
			param: null,
			docs_url: 'https://dataxapi.com/docs/errors/',
		},
	};
}

function run(params, responses, { continueOnFail = false, items = 1 } = {}) {
	const calls = [];
	const node = { id: '1', name: 'DataXAPI', type: 'n8n-nodes-dataxapi.dataXApi', typeVersion: 1, position: [0, 0], parameters: {} };
	const ctx = {
		getInputData: () => Array.from({ length: items }, () => ({ json: {} })),
		getNodeParameter: (name, _i, fallback) => (name in params ? params[name] : fallback),
		getNode: () => node,
		continueOnFail: () => continueOnFail,
		helpers: {
			async httpRequestWithAuthentication(credentialType, options) {
				calls.push({ credentialType, options });
				const next = responses.length > 1 ? responses.shift() : responses[0];
				return next;
			},
		},
	};
	return { calls, result: new DataXApi().execute.call(ctx) };
}

const { OPERATIONS, RESOURCES } = require('../dist/nodes/DataXApi/operations.js');

test('a generated operation: one GET with the credential, source label and a fresh idempotency key', async () => {
	const { calls, result } = run(
		{ resource: 'douyin', operation: 'douyin.users.videos.list', id: ' MS4wABC ', url: '' },
		[envelope([{ id: 'a' }, { id: 'b' }], 'c2')],
	);
	const [out] = await result;
	assert.equal(calls.length, 1, 'default is one page even when more exist');
	const { credentialType, options } = calls[0];
	assert.equal(credentialType, 'dataXApiApi');
	assert.equal(options.method, 'GET');
	assert.equal(options.url, 'https://api.dataxapi.com/v1/douyin/users/videos/list');
	assert.deepEqual(options.qs, { id: 'MS4wABC' });
	assert.equal(options.headers['X-Source'], 'n8n');
	assert.match(options.headers['Idempotency-Key'], UUID);
	assert.deepEqual(out.map((o) => o.json.id), ['a', 'b']);
	assert.deepEqual(out[0].pairedItem, { item: 0 });
});

test('paging follows next_cursor up to max pages, and stops on the last page', async () => {
	let r = run(
		{ resource: 'douyin', operation: 'douyin.videos.comments.list', id: '769', maxPages: 3 },
		[envelope([{ id: '1' }], 'c2'), envelope([{ id: '2' }], 'c3'), envelope([{ id: '3' }], 'c4')],
	);
	let [out] = await r.result;
	assert.equal(r.calls.length, 3);
	assert.equal(r.calls[1].options.qs.cursor, 'c2');
	assert.equal(r.calls[2].options.qs.cursor, 'c3');
	assert.notEqual(r.calls[0].options.headers['Idempotency-Key'], r.calls[1].options.headers['Idempotency-Key']);
	assert.equal(out.length, 3);
	r = run(
		{ resource: 'wechat_mp', operation: 'wechat_mp.accounts.articles.list', id: 'gh_1', maxPages: 5 },
		[envelope([{ id: '1' }], 'c2'), envelope([{ id: '2' }], null)],
	);
	await r.result;
	assert.equal(r.calls.length, 2);
});

test('start cursor option is sent on the first call', async () => {
	const { calls, result } = run(
		{ resource: 'wechat_mp', operation: 'wechat_mp.accounts.articles.list', id: 'gh_1', options: { cursor: 'abc' } },
		[envelope([])],
	);
	await result;
	assert.deepEqual(calls[0].options.qs, { id: 'gh_1', cursor: 'abc' });
});

test('an operation without pages makes one call whatever Max Pages says', async () => {
	const { calls, result } = run(
		{ resource: 'wechat_mp', operation: 'wechat_mp.articles.metrics', url: 'https://mp.weixin.qq.com/s?__biz=1', maxPages: 5 },
		[envelope([{ reads: 1 }], 'c2')],
	);
	await result;
	assert.equal(calls.length, 1);
});

test('pages output keeps billing and paging', async () => {
	const { result } = run(
		{ resource: 'douyin', operation: 'douyin.videos.search', query: 'coffee', sort: 'latest', published_within: '', output: 'pages' },
		[envelope([{ id: '1' }], 'c2', '0.02')],
	);
	const [out] = await result;
	assert.equal(out.length, 1);
	assert.equal(out[0].json.billing.amount, '0.02');
	assert.equal(out[0].json.page.next_cursor, 'c2');
	assert.equal(out[0].json.endpoint, 'douyin.videos.search');
	assert.deepEqual(out[0].json.params, { query: 'coffee', sort: 'latest' });
});

test('a list field goes as a JSON body; optional numbers left at 0 are not sent', async () => {
	let r = run(
		{ resource: 'douyin', operation: 'douyin.index.keywords.history', keywords: '咖啡，CityWalk, 露营', since: '2026-09-01', until: '2026-09-30' },
		[envelope([])],
	);
	await r.result;
	assert.equal(r.calls[0].options.method, 'POST');
	assert.deepEqual(r.calls[0].options.body, { keywords: ['咖啡', 'CityWalk', '露营'], since: '2026-09-01', until: '2026-09-30' });
	r = run(
		{ resource: 'douyin', operation: 'douyin.xingtu.creators.search', query: '美妆', followers_min: 10000, followers_max: 0 },
		[envelope([])],
	);
	await r.result;
	assert.deepEqual(r.calls[0].options.qs, { query: '美妆', followers_min: '10000' });
});

test('find is the free catalog search and returns one item per endpoint', async () => {
	const { calls, result } = run(
		{ resource: 'any', operation: 'find', need: ' 公众号文章阅读数 ', platform: '' },
		[
			{
				statusCode: 200,
				body: {
					code: 'ok',
					data: {
						matches: [
							{
								type: 'capability',
								id: 'wechat_mp.articles.metrics',
								url: '/apis/wechat_mp/articles/metrics/',
								name: { en: 'WeChat Official Account article stats' },
								summary: { en: 'reads' },
								required: ['url'],
								pricing: { per: 'call', price: '0.02' },
								example: { params: { url: 'https://mp.weixin.qq.com/s?__biz=1' } },
							},
							{ type: 'board', id: 'x' },
						],
					},
				},
			},
		],
	);
	const [out] = await result;
	assert.equal(calls[0].options.url, 'https://api.dataxapi.com/v1/catalog/search');
	assert.deepEqual(calls[0].options.qs, { query: '公众号文章阅读数' });
	assert.deepEqual(out.map((o) => o.json.endpoint), ['wechat_mp.articles.metrics']);
	assert.equal(out[0].json.price, '0.02');
	assert.equal(out[0].json.docs, 'https://dataxapi.com/apis/wechat_mp/articles/metrics/');
});

test('call any endpoint: GET with joined lists, POST when ids are given', async () => {
	let r = run(
		{ resource: 'any', operation: 'call', endpoint: 'douyin.users.get', parameters: '{"id":"MS4w1","fields":["id","name"]}' },
		[{ statusCode: 200, body: { code: 'ok', request_id: 'r', data: { id: 'MS4w1', name: 'n' }, meta: {} } }],
	);
	const [out] = await r.result;
	assert.equal(r.calls[0].options.method, 'GET');
	assert.deepEqual(r.calls[0].options.qs, { id: 'MS4w1', fields: 'id,name' });
	assert.equal(out[0].json.name, 'n');
	r = run({ resource: 'any', operation: 'call', endpoint: 'x.users.get', parameters: { ids: ['1', '2'] } }, [envelope([])]);
	await r.result;
	assert.equal(r.calls[0].options.method, 'POST');
	assert.deepEqual(r.calls[0].options.body, { ids: ['1', '2'] });
	assert.equal(r.calls[0].options.qs, undefined);
});

test('bad input is refused before any request', async () => {
	for (const params of [
		{ resource: 'any', operation: 'call', endpoint: '../v1/account', parameters: '{}' },
		{ resource: 'any', operation: 'call', endpoint: 'douyin.users.get', parameters: 'not json' },
		{ resource: 'any', operation: 'call', endpoint: 'douyin.users.get', parameters: '[1]' },
		{ resource: 'douyin', operation: 'douyin.videos.search', query: '  ' },
		{ resource: 'douyin', operation: 'douyin.xingtu.creators.search', query: 'a', followers_min: 'many' },
	]) {
		const { calls, result } = run(params, [envelope([])]);
		await assert.rejects(result, (err) => err.constructor.name === 'NodeOperationError' && /Nothing was charged/.test(err.message));
		assert.equal(calls.length, 0);
	}
});

test('an API error becomes a NodeApiError that says nothing was charged', async () => {
	const { result } = run({ resource: 'douyin', operation: 'douyin.videos.comments.list', id: '1' }, [errorResponse(404, 'not_found')]);
	await assert.rejects(result, (err) => {
		assert.equal(err.constructor.name, 'NodeApiError');
		assert.match(err.message, /not_found/);
		assert.match(err.description, /Nothing was charged/);
		return true;
	});
});

test('unknown settlement points to the call lookup', async () => {
	const { result } = run({ resource: 'douyin', operation: 'douyin.videos.comments.list', id: '1' }, [errorResponse(500, 'settlement_unknown', null)]);
	await assert.rejects(result, (err) => /\/v1\/calls\/r-err/.test(err.description));
});

test('continue on fail turns errors into items', async () => {
	const { result } = run(
		{ resource: 'douyin', operation: 'douyin.videos.comments.list', id: '1' },
		[errorResponse(404, 'not_found')],
		{ continueOnFail: true },
	);
	const [out] = await result;
	assert.equal(out.length, 1);
	assert.match(out[0].json.error, /not_found/);
});

test('the node description lists every generated operation under its resource, options in order', () => {
	const props = new DataXApi().description.properties;
	const resource = props.find((p) => p.name === 'resource');
	assert.deepEqual(resource.options.map((o) => o.name), [...resource.options.map((o) => o.name)].sort((a, b) => a.localeCompare(b)));
	assert.equal(resource.options.length, RESOURCES.length + 1);
	for (const r of RESOURCES) {
		const op = props.find((p) => p.name === 'operation' && p.displayOptions.show.resource[0] === r.value);
		const mine = OPERATIONS.filter((o) => o.resource === r.value).map((o) => o.endpoint);
		assert.deepEqual(op.options.map((o) => o.value).sort(), [...mine].sort());
		assert.ok(mine.includes(op.default));
		for (const o of op.options) assert.match(o.description, /errors are not charged/);
	}
	assert.equal(OPERATIONS.length, 34);
});

test('credential uses Bearer auth and a free test request', () => {
	const cred = new DataXApiApi();
	assert.equal(cred.name, 'dataXApiApi');
	assert.equal(cred.authenticate.properties.headers.Authorization, '=Bearer {{$credentials.apiKey}}');
	assert.equal(cred.test.request.baseURL + cred.test.request.url, 'https://api.dataxapi.com/v1/account');
	assert.equal(cred.test.request.method, 'GET');
	assert.match(cred.properties[0].description, /\?ref=n8n/);
});
