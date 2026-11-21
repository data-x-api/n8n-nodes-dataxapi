# n8n-nodes-dataxapi

An [n8n](https://n8n.io) community node for [DataXAPI](https://dataxapi.com/?ref=n8n): public data from Douyin, Xiaohongshu (RedNote), WeChat Official Accounts and Channels, Weibo, Bilibili, Zhihu and Kuaishou, plus Douyin's trend index (巨量算数), Xiaohongshu PGY (蒲公英), Douyin Xingtu (星图), TikTok, YouTube, X and Reddit, in workflows and AI agents. 34 ready operations, and all 237 endpoints through *Any Endpoint*.

- **No sign-in to your own platform accounts**, no cookies, no QR login.
- **Pay per call; errors are not charged.** Each operation states its price; with *One Item per Page* output, `billing.amount` says what each call cost (US dollars).
- **Free trial: up to 333 calls, no card.** Top up from $10; the balance does not expire.

Source: <https://github.com/data-x-api/n8n-nodes-dataxapi> · Contact: support@dataxapi.com · 中文说明：[README.zh-CN.md](README.zh-CN.md)

## Installation

In n8n, open **Settings → Community Nodes → Install** and enter `n8n-nodes-dataxapi`.

> The package is not on npm yet, so this install does not work until it is. Until then, call the API from n8n's HTTP Request node: `GET https://api.dataxapi.com/v1/<path>` with the header `Authorization: Bearer <your key>` (paths and prices: https://dataxapi.com/apis/). See the [community nodes guide](https://docs.n8n.io/integrations/community-nodes/installation/).

## Credentials

1. Create an API key at <https://dataxapi.com/console/keys/?ref=n8n>.
2. In n8n, add a **DataXAPI API** credential and paste the key (it starts with `dx_`).
3. n8n tests the credential with `GET https://api.dataxapi.com/v1/account`, which is free.

## Operations

Pick a resource (the platform), then an operation. The first 30 are the endpoints DataXAPI's customers called most in the last 30 days.

<!-- operations:start -->
| Resource | Operation | What it returns | Price |
|---|---|---|---|
| Xiaohongshu (RedNote) | Note Search | Search Xiaohongshu notes by terms: title, text, author, engagement counts, images, and a link that opens. Each says whether it is a brand partnership note on record. By relevance, newest, most liked, most commented or most saved; video or image notes only; published in the last day, week or half year. | $0.02 a call |
| Douyin | Video Search | Search Douyin videos by terms, a page at a time, sorted by relevance, newest or most liked and filtered by time posted: caption, author with follower count, engagement counts. | $0.02 a call |
| WeChat Official Account | Articles | Get a page of the articles a WeChat Official Account published, newest first: title, digest, link, time published. Each also says whether it was the lead article or one below, its format and cover. The page's articles tab by default; its videos or pictures tab when asked. | $0.02 a call |
| Douyin | Video Comments | Get a page of comments on a Douyin video: text, commenter, likes, reply count, time posted. | $0.002 a call |
| Douyin | Video Play Count | Get a Douyin video's counts as of now, by its ID: plays and likes. | $0.002 a call |
| Douyin | Video Detail | Get one Douyin video or image post by ID or link: caption, author, engagement counts, time posted. | $0.002 a call |
| Douyin | User Videos | Get a page of the videos a Douyin account has posted, newest first: caption, engagement counts, time posted. | $0.002 a call |
| WeChat Official Account | Article Detail | Get one WeChat Official Account article by its link: title, text, time published, the account's name and IDs. It also says whether it was the lead article or one below, its format, cover, digest, byline, "read the original" link and the IP location it was posted from. | $0.02 a call |
| Douyin | User Profile | Get a Douyin user's profile by account ID or profile link: name, handle, bio, follower, following and post counts, total likes, verification; in the full view also what the badge says, whether it is an organisation's or shop's (blue V), whether the profile has a product showcase, whether the account may sell live, and whether it is live now, with the room's ID. | $0.002 a call |
| Xiaohongshu (RedNote) | Note Detail | Get one Xiaohongshu note by ID or link: title, text, author, engagement counts, images. It also says whether it is a brand partnership note on record. | $0.02 a call |
| Douyin | User Search | Search Douyin accounts by terms, a page at a time: account ID, display name, avatar, follower count, post count, total likes. | $0.002 a call |
| Douyin | Trend-index Keyword Trends | Get the day-by-day search index and composite index of a keyword, or of one to five keywords at once, on Douyin over a date range, from 巨量算数 (the Douyin index), with the daily averages of the period, of the one before and of a year earlier. An index is the platform's score of volume, not a count of searches; days are calendar days in China time (UTC+8). | $0.006 a call |
| Douyin | Hot Search Board | Get a Douyin hot list: hot searches, rising topics, topic ranking, top search terms or the music chart, with rank and heat. | $0.002 a call |
| WeChat Search | Articles and Videos | Get a page of WeChat Search results for search terms: Official Account articles and Channels videos mixed, each saying in type whether it is an article or a video; by relevance, newest or hottest, filtered by time posted, or articles only or videos only: title or description, the source account's name, time published, an article's link (with a band of reads on some), a video's likes and saves. WeChat Search gives no account ID. | $0.02 a call |
| WeChat Channels | Video Search | Get a page of WeChat Channels videos for search terms through WeChat Search, by relevance, newest or hottest, filtered by time posted: description, the account's name and avatar, time published, likes and saves, length, cover. WeChat Search gives no account ID, and a video's ID is an encrypted one starting with export/: given as export_id to wechat_channels.videos.get it yields the numeric ID, the video file's address and the key that decrypts it; it expires, so use it soon. | $0.02 a call |
| WeChat Official Account | Live Search | Find WeChat Official Accounts and service accounts for search terms through WeChat Search, closest first, possibly followed by less related ones: original ID, WeChat ID, name, bio, avatar, whether verified, owner, number of original articles. Charged per call; no followers or reads, for estimates of those use wechat_mp.accounts.search. | $0.02 a call |
| WeChat Channels | Video Detail | Get one WeChat Channels video by its ID, a search result's export/ ID or its share link: description, author, time published, likes, comments, forwards, saves, and the video file's address with the key that decrypts it. | $0.02 a call |
| Xiaohongshu (RedNote) | Note Comments | Get a page of top-level comments on a Xiaohongshu note by ID or link, newest first or hottest first: text, commenter, likes, reply count, time posted. | $0.02 a call |
| WeChat Channels | Account Videos | Get a page of the videos a WeChat Channels account published, newest first, by the account's ID: description, time published, likes, comments, forwards, saves, length. | $0.02 a call |
| Xiaohongshu (RedNote) | User Notes | Get a page of the notes a Xiaohongshu account posted, by user ID or profile link: title, text, engagement counts, images, whether pinned. | $0.02 a call |
| Weibo | Realtime Search | Get a page of Weibo posts for search terms, newest first: text (a long post is cut short here), author and follower count, likes, comments, reposts, video plays, pictures, topics. | $0.002 a call |
| Bilibili | Video Search | Get a page of Bilibili videos for search terms, by relevance, newest or most played: title, uploader, views, likes, saves, comments, length. | $0.002 a call |
| Xiaohongshu (RedNote) | User Profile | Get a Xiaohongshu account by user ID or profile link: name, handle, bio, follower, following and note counts, verification, and the gender and region its profile shows. | $0.02 a call |
| Xiaohongshu (RedNote) | PGY Keyword Search Index | Get a keyword's day-by-day search index on Xiaohongshu over about the last three months, from the platform's creator marketplace, with each day's notes about the keyword and how often they were shown, read and engaged with. The platform sets the period; it cannot be chosen. The search index is the platform's index, not a count of searches; days are calendar days in China time (UTC+8). | $0.04 a call |
| WeChat Official Account | Article Stats | Get the current counts of a WeChat Official Account article by its long link: reads, likes, recommends, shares, saves, comments. | $0.02 a call |
| WeChat Channels | Video Comments | Get a page of top-level comments on a WeChat Channels video by its ID: text, commenter, likes, time posted, IP location. | $0.02 a call |
| Douyin | Trend-index Related Keywords | Get the keywords related to a keyword on Douyin in one week, from the platform's own keyword tool: those searched together with it and those that appear with it in content, each with its relevance, its place by relevance, its search index and its composite index. An index is the platform's score of volume, not a count of searches. | $0.002 a call |
| Zhihu | Content Search | Get a page of Zhihu answers and articles matching a search; either kind alone, by relevance, newest or most upvoted. | $0.002 a call |
| Kuaishou | Video Search | Search Kuaishou posts by terms, a page at a time, sorted newest or most liked first and filtered by time posted and video length: caption, author, play and engagement counts, time posted, whether it is a video or a photo set, and a video's length. | $0.02 a call |
| Douyin | Xingtu Creator Search | Search Douyin creators on Xingtu by words in their name, filtered by followers, expected CPM (in yuan) and gender, or ordered by expected CPM, lowest first:Xingtu creator ID, name, location, content categories, followers; in the full view also what an integrated and a custom video cost, expected CPMs (in yuan), expected views, the last 30 days' interaction and completion ratios and median views, the e-commerce level, gender and content labels. The creator ID the other Xingtu endpoints take comes from here. | $0.004 a call |
| TikTok | Video Search | Search TikTok videos by keyword, 30 a page; sort by relevance, likes or time posted, and limit how recently they were posted. | $0.002 a call |
| YouTube | Video Transcript | Get the transcript of a YouTube video by ID or link: the whole text and timed segments. lang chooses the language of the captions. | $0.002 a call |
| X (Twitter) | Post Search | Find X posts by search terms, most popular or newest first; the terms may use X's own search operators, such as from:handle. | $0.002 a call |
| Reddit | Post Search | Get a page of Reddit posts matching a search, by relevance, newest or top score, optionally within a period. | $0.002 a call |
| Any Endpoint | Find | Endpoints for a need described in plain words, with price and parameters | free |
| Any Endpoint | Call | Any of the 237 endpoints by its ID | that endpoint's price |
<!-- operations:end -->

Live prices are on each endpoint's page at [dataxapi.com/apis](https://dataxapi.com/apis/?ref=n8n).

Common settings:

- **Max Pages** (default 1): follow `page.next_cursor` until this many pages. Each page is one charged call.
- **Output**: *One Item per Result* (each post, comment or account becomes an n8n item) or *One Item per Page* (each call becomes one item with `endpoint`, `params`, `data`, `page`, `billing` and `warnings`).
- **Options → Start Cursor**: continue from a `page.next_cursor` you saved earlier.

Errors stop the node with the DataXAPI error code and whether anything was charged; with **Continue On Fail** they become output items instead.

## What you can build

- **Competitors' new WeChat articles into a sheet**: Schedule Trigger at 9:00 → WeChat Official Account *Articles* → a Code node drops the ones seen before → Google Sheets append. $0.02 a day per account.
- **Xiaohongshu brand mentions, daily**: *Note Search* for your brand, sort `latest` → *Note Comments* on the most liked notes → an AI node sorts praise, complaints and questions → Slack or Feishu.
- **Check demand before picking a topic**: Douyin *Trend-index Keyword Trends* for one to five keywords' daily search index → *Trend-index Related Keywords* → an AI node says which are rising.
- **As an AI agent tool**: attach the node to an AI Agent and let the model fill fields with `{{ $fromAI('query', 'keywords to search for') }}`. For every endpoint, give the agent *Any Endpoint → Find* (free) and *Call*, or DataXAPI's remote MCP server (`https://api.dataxapi.com/mcp`) through the MCP Client Tool.

Importable workflows are in [templates/](templates/README.md).

## Develop and test locally

Requires Node.js 22 or later.

```bash
npm install
npm run build   # compiles to dist/
npm test        # builds, then runs node:test; every HTTP request is mocked
npm run lint    # n8n community node lint rules
```

The operations are written by `scripts/generate-operations.mjs` from DataXAPI's live catalog; run it again when the catalog or prices change.

## License

[MIT](LICENSE.md)
