// Writes nodes/DataXApi/operations.ts, one operation per chosen DataXAPI endpoint, from the live catalog:
//   node scripts/generate-operations.mjs [catalog.json]
// Reads https://api.dataxapi.com/v1/catalog (free, no key) unless a saved copy is given, then rewrites the
// operation tables in README.md and README.zh-CN.md. Run it again when the catalog or the prices change.
import { readFileSync, writeFileSync } from 'node:fs';

// The endpoints the most accounts called in the 30 days to 2026-11-20 (DataXAPI's own call records, internal
// accounts left out), then four for the platforms abroad. The same list as the Dify plugin's.
const CHOSEN = [
	'xiaohongshu.notes.search', 'douyin.videos.search', 'wechat_mp.accounts.articles.list', 'douyin.videos.comments.list',
	'douyin.videos.metrics', 'douyin.videos.get', 'douyin.users.videos.list', 'wechat_mp.articles.get', 'douyin.users.get',
	'xiaohongshu.notes.get', 'douyin.users.search', 'douyin.index.keywords.history', 'douyin.trends.list', 'wechat.posts.search',
	'wechat_channels.videos.search', 'wechat.accounts.search', 'wechat_channels.videos.get', 'xiaohongshu.notes.comments.list',
	'wechat_channels.users.videos.list', 'xiaohongshu.users.notes.list', 'weibo.posts.search', 'bilibili.videos.search',
	'xiaohongshu.users.get', 'xiaohongshu.pgy.keywords.history', 'wechat_mp.articles.metrics', 'wechat_channels.videos.comments.list',
	'douyin.index.keywords.related', 'zhihu.posts.search', 'kuaishou.videos.search', 'douyin.xingtu.creators.search',
	'tiktok.videos.search', 'youtube.videos.transcript.get', 'x.posts.search', 'reddit.posts.search',
];

// Resource (platform) shown in the node, its Chinese name, and the words its endpoints' names start with.
const RESOURCES = {
	douyin: ['Douyin', '抖音', 'Douyin '],
	xiaohongshu: ['Xiaohongshu (RedNote)', '小红书', 'Xiaohongshu '],
	wechat_mp: ['WeChat Official Account', '微信公众号', 'WeChat Official Account '],
	wechat_channels: ['WeChat Channels', '视频号', 'WeChat Channels '],
	wechat: ['WeChat Search', '微信搜一搜', 'WeChat Search '],
	weibo: ['Weibo', '微博', 'Weibo '],
	bilibili: ['Bilibili', 'B站', 'Bilibili '],
	zhihu: ['Zhihu', '知乎', 'Zhihu '],
	kuaishou: ['Kuaishou', '快手', 'Kuaishou '],
	tiktok: ['TikTok', 'TikTok', 'TikTok '],
	youtube: ['YouTube', 'YouTube', 'YouTube '],
	x: ['X (Twitter)', 'X（推特）', 'X '],
	reddit: ['Reddit', 'Reddit', 'Reddit '],
};
// Where an endpoint sits in the node when not under its own namespace.
const RESOURCE_OF = { 'wechat.accounts.search': 'wechat_mp' };

const LABELS = {
	query: 'Search Terms', sort: 'Sort', published_within: 'Published Within', type: 'Type', keyword: 'Keyword',
	keywords: 'Keywords', since: 'From Date', until: 'To Date', followers_min: 'Followers At Least',
	followers_max: 'Followers At Most', cpm_min: 'CPM At Least', cpm_max: 'CPM At Most', gender: 'Gender',
	duration: 'Duration', lang: 'Language', board: 'Board', tab: 'Tab', export_id: 'Search Result Video ID',
};
// Paging is the node's own option; the plugin always asks for the standard view.
const SKIP = new Set(['view', 'fields', 'include', 'cursor']);
const SMALL = new Set(['a', 'an', 'and', 'as', 'at', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to']);

const title = (text) =>
	text
		.split(' ')
		.map((w, i) => (i > 0 && SMALL.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
		.join(' ');
const short = (text) => {
	let head = text.split(/[,;:(]/)[0].trim().replace(/^The /, '');
	if (head.length > 40) head = head.slice(0, 40).replace(/\s\S*$/, '');
	return title(head);
};
const valueName = (v) => title(v.replace(/_/g, ' '));
const price = (p) => (p.per === 'item' ? `$${p.price} an item, at most $${p.max_charge} a call` : `$${p.price} a call`);
const priceZh = (p) => (p.per === 'item' ? `每条 $${p.price}，一次最多 $${p.max_charge}` : `$${p.price} 一次`);

const catalog = process.argv[2]
	? JSON.parse(readFileSync(process.argv[2], 'utf8'))
	: await (await fetch('https://api.dataxapi.com/v1/catalog')).json();
const { capabilities, params: common, revision, prices } = catalog.data;
const caps = new Map(capabilities.map((c) => [c.id, c]));
const missing = CHOSEN.filter((id) => !caps.has(id));
if (missing.length) throw new Error(`not in the catalog: ${missing.join(', ')}`);

const operations = CHOSEN.map((id) => {
	const cap = caps.get(id);
	const resource = RESOURCE_OF[id] ?? cap.namespace;
	if (!RESOURCES[resource]) throw new Error(`no resource for ${id}`);
	const prefix = RESOURCES[resource][2];
	const bare = cap.name.en.startsWith(prefix) ? cap.name.en.slice(prefix.length) : cap.name.en;
	const fields = Object.entries(cap.params)
		.filter(([name]) => !SKIP.has(name))
		.map(([name, spec]) => {
			const kind = common[name]?.type ?? 'string';
			const doc = spec.doc?.en ?? common[name]?.en ?? name;
			const example = Array.isArray(spec.example) ? spec.example.join(',') : spec.example;
			return {
				name,
				displayName: LABELS[name] ?? short(doc),
				kind: spec.values ? 'options' : kind === 'integer' ? 'number' : 'string',
				list: kind === 'string[]',
				required: Boolean(spec.required),
				options: spec.values ? spec.values.map((v) => ({ name: valueName(v), value: v })) : undefined,
				default: spec.default ?? '',
				description: `${doc}${kind === 'string[]' ? '. Several separated by commas' : ''}`,
				placeholder: example === undefined || example === null ? '' : `e.g. ${example}`,
			};
		})
		.sort((a, b) => Number(b.required) - Number(a.required));
	return {
		endpoint: id,
		resource,
		name: title(bare),
		description: `${cap.summary.en} ${price(cap.pricing)}; errors are not charged.`,
		pages: (cap.request_params ?? []).includes('cursor'),
		fields,
		zh: { name: cap.name.zh, summary: cap.summary.zh, price: priceZh(cap.pricing) },
		en: { summary: cap.summary.en, price: price(cap.pricing) },
	};
});

const resources = Object.entries(RESOURCES)
	.filter(([key]) => operations.some((op) => op.resource === key))
	.map(([key, [en, zh]]) => ({ value: key, name: en, zh }));

const forNode = ({ zh, en, ...op }) => op;
writeFileSync(
	'nodes/DataXApi/operations.ts',
	`// Written by scripts/generate-operations.mjs from DataXAPI's catalog ${revision}, price book ${prices.version}.\n` +
		`// Do not edit by hand: run the script again.\n\n` +
		`import type { Operation, Resource } from './types';\n\n` +
		`export const RESOURCES: Resource[] = ${JSON.stringify(resources.map(({ zh, ...r }) => r), null, '\t')};\n\n` +
		`export const OPERATIONS: Operation[] = ${JSON.stringify(operations.map(forNode), null, '\t')};\n`,
);

function table(lang) {
	const lines = [];
	const resourceOf = (op) => resources.find((r) => r.value === op.resource);
	if (lang === 'zh') {
		lines.push('| 平台 | 操作 | 拿到什么 | 价格 |', '|---|---|---|---|');
		for (const op of operations) lines.push(`| ${resourceOf(op).zh} | ${op.zh.name} | ${op.zh.summary} | ${op.zh.price} |`);
		lines.push('| 任意接口 | 找接口 | 用一句话描述要的数据，列出能用的接口、价格和参数 | 免费 |');
		lines.push('| 任意接口 | 调用 | 用接口编号加参数调用全部 237 个接口里的任何一个 | 按该接口的价格 |');
	} else {
		lines.push('| Resource | Operation | What it returns | Price |', '|---|---|---|---|');
		for (const op of operations) lines.push(`| ${resourceOf(op).name} | ${op.name} | ${op.en.summary} | ${op.en.price} |`);
		lines.push('| Any Endpoint | Find | Endpoints for a need described in plain words, with price and parameters | free |');
		lines.push("| Any Endpoint | Call | Any of the 237 endpoints by its ID | that endpoint's price |");
	}
	return lines.join('\n');
}
const START = '<!-- operations:start -->';
const END = '<!-- operations:end -->';
for (const [file, lang] of [['README.md', 'en'], ['README.zh-CN.md', 'zh']]) {
	const body = readFileSync(file, 'utf8');
	const at = body.indexOf(START);
	const to = body.indexOf(END);
	if (at < 0 || to < 0) throw new Error(`${file} has no ${START} … ${END} markers`);
	writeFileSync(file, `${body.slice(0, at + START.length)}\n${table(lang)}\n${body.slice(to)}`);
}
console.log(`${operations.length} operations in ${resources.length} resources from catalog ${revision}, price book ${prices.version}`);
