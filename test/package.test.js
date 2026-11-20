// Checks on the package metadata and the workflow templates.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

test('package.json follows the community node rules', () => {
	assert.equal(pkg.name, 'n8n-nodes-dataxapi');
	assert.ok(pkg.keywords.includes('n8n-community-node-package'));
	assert.equal(pkg.license, 'MIT');
	assert.deepEqual(pkg.author, { name: 'DataXAPI', email: 'support@dataxapi.com' });
	assert.equal(pkg.repository.url, 'https://github.com/data-x-api/n8n-nodes-dataxapi.git');
	assert.equal(pkg.dependencies, undefined, 'no runtime dependencies');
	for (const file of [...pkg.n8n.nodes, ...pkg.n8n.credentials]) {
		assert.ok(fs.existsSync(path.join(root, file)), `${file} is built`);
	}
});

const templatesDir = path.join(root, 'templates');
const templates = fs.readdirSync(templatesDir).filter((f) => f.endsWith('.json'));

test('there are 3 to 5 templates', () => {
	assert.ok(templates.length >= 3 && templates.length <= 5, String(templates.length));
});

for (const file of templates) {
	test(`template ${file} uses only this node and built-in nodes`, () => {
		const wf = JSON.parse(fs.readFileSync(path.join(templatesDir, file), 'utf8'));
		assert.ok(wf.name && Array.isArray(wf.nodes) && wf.connections);
		const names = new Set(wf.nodes.map((n) => n.name));
		let dataxapi = 0;
		for (const node of wf.nodes) {
			assert.ok(
				node.type === 'n8n-nodes-dataxapi.dataXApi' || node.type.startsWith('n8n-nodes-base.'),
				`${file}: ${node.type}`,
			);
			if (node.type === 'n8n-nodes-dataxapi.dataXApi') {
				dataxapi++;
				assert.ok(node.credentials && node.credentials.dataXApiApi, `${file}: credential`);
				assert.ok(node.parameters.resource && node.parameters.operation, `${file}: resource and operation`);
			}
		}
		assert.ok(dataxapi >= 1, `${file} uses the DataXAPI node`);
		for (const [from, outs] of Object.entries(wf.connections)) {
			assert.ok(names.has(from), `${file}: connection from ${from}`);
			for (const branch of outs.main) for (const c of branch) assert.ok(names.has(c.node), `${file}: to ${c.node}`);
		}
		const text = JSON.stringify(wf);
		assert.ok(!/dx_[A-Za-z0-9]{8,}/.test(text), `${file} carries no key`);
	});
}

test('public text keeps to the wording rules', () => {
	const forbidden = /tikhub|scrapecreators|rnote\.dev|twitterapi\.io|justoneapi|just one api|极致了|上游|供应商|转售|退款|refund/i;
	for (const file of ['README.md', 'README.zh-CN.md', 'templates/README.md', 'nodes/DataXApi/operations.ts', ...templates.map((t) => `templates/${t}`)]) {
		assert.ok(!forbidden.test(fs.readFileSync(path.join(root, file), 'utf8')), file);
	}
});
