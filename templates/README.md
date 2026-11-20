# Workflow templates / 工作流模板

Each file is an n8n workflow you can import (**Workflows → Import from File**). They use only the DataXAPI node and
n8n's built-in nodes. After importing: pick your DataXAPI credential on the DataXAPI node, replace the `REPLACE_ME`
values, and for the webhook templates paste your own webhook address.

每个文件都是可以直接导入 n8n 的工作流（**Workflows → Import from File**），只用 DataXAPI 节点和 n8n 自带节点。导入后：在 DataXAPI 节点上选你的凭证，把 `REPLACE_ME` 换成真实值；带 webhook 的模板填上你自己的 webhook 地址。

Prices below were read from <https://dataxapi.com/prices.json> under price book 19 (2026-11-17); the endpoint page at [dataxapi.com/apis](https://dataxapi.com/apis/) is the reference. An error is not charged.

Templates that watch several platforms list one item per account, post or keyword in a Code node, each with the endpoint to call and its parameters, and send them through the DataXAPI node's **Any Endpoint → Call**. Find other endpoints with **Any Endpoint → Find**, which is free.

下面的价格取自 <https://dataxapi.com/prices.json>（价格版本 19，2026-11-17），以 [dataxapi.com/apis](https://dataxapi.com/zh/apis/) 上的接口页为准。出错不收费。

盯多个平台的模板，在 Code 节点里每个账号、作品或关键词列一条，写明要调的接口和参数，交给 DataXAPI 节点的 **Any Endpoint → Call**。别的接口用 **Any Endpoint → Find** 找，免费。

The "seen before" check uses n8n workflow static data, which is saved only in production runs of an active workflow,
not in manual test runs.

“没见过的才推送”靠 n8n 的工作流静态数据，只在激活后的正式运行里保存，手动测试运行不保存。

## 1. `wechat-mp-articles-to-google-sheets.json`

**EN.** Every day at 9:00, reads the newest page (about 10 articles) of one WeChat Official Account and appends the
articles not seen before to a Google Sheet (columns `id`, `title`, `url`, `published_at`, `digest`).
Calls: 1 a run, endpoint `wechat_mp.accounts.articles.list` at $0.02 a call, so $0.02 a day per account. An account
that publishes more than a page a day needs **Max Pages** raised, one more call per page.

**中文。** 每天 9:00 读一个公众号的第一页（新发的在前，约 10 篇），把没见过的文章追加到 Google Sheets（列：`id`、`title`、`url`、`published_at`、`digest`）。
调用：每次运行 1 次，接口 `wechat_mp.accounts.articles.list` 每次 $0.02，即每个号每天 $0.02。一天发文超过一页的号要调大 **Max Pages**，每多一页多一次调用。

## 2. `competitor-new-posts-to-webhook.json`

**EN.** Every 6 hours, reads the newest page of each account in the **Accounts to watch** Code node (one endpoint and its parameters per account) and sends posts not
seen before to a Slack incoming webhook. For a Feishu (Lark) bot, change the body to
`{"msg_type": "text", "content": {"text": ...}}`.
Calls: 1 per account a run. The example's 3 accounts are Douyin ($0.002), Xiaohongshu ($0.02) and TikTok ($0.002):
$0.024 a run, 4 runs a day, $0.096 a day.

**中文。** 每 6 小时读 **Accounts to watch** 里每个账号的第一页（新发的在前），把没见过的作品发到 Slack 的 incoming webhook。用飞书机器人的话，把请求体改成 `{"msg_type": "text", "content": {"text": ...}}`。
调用：每个账号每次运行 1 次。示例里 3 个账号是抖音（$0.002）、小红书（$0.02）、TikTok（$0.002）：每次运行 $0.024，一天 4 次，每天 $0.096。

## 3. `comment-keyword-alert.json`

**EN.** Every hour, reads the newest page of comments under each post in **Posts to watch**, and sends new comments
containing any of your keywords to a webhook.
Calls: 1 per post a run. The example's 2 posts are a Douyin video ($0.002) and a WeChat Official Account article
($0.02): $0.022 a run, 24 runs a day, $0.528 a day. Fewer posts or a longer interval cost less.

**中文。** 每小时读 **Posts to watch** 里每条作品的第一页评论，把含关键词的新评论发到 webhook。
调用：每条作品每次运行 1 次。示例里 2 条是抖音视频（$0.002）和公众号文章（$0.02）：每次运行 $0.022，一天 24 次，每天 $0.528。盯的作品少一些、间隔长一些就更省。

## 4. `weekly-keyword-search-report.json`

**EN.** Every Monday at 9:00, searches each keyword for posts from the past week ordered by likes, and sends the top 5
per keyword to a webhook.
Calls: 1 per keyword a run. The example searches Douyin, Xiaohongshu and WeChat Search at $0.02 each: $0.06 a week.

**中文。** 每周一 9:00 按关键词搜近一周、按点赞排序的内容，每个关键词取前 5 条发到 webhook。
调用：每个关键词每次运行 1 次。示例搜抖音、小红书、微信搜一搜，每次各 $0.02：每周 $0.06。
