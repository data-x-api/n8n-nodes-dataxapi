// Written by scripts/generate-operations.mjs from DataXAPI's catalog ceced48b38f71468, price book 30.
// Do not edit by hand: run the script again.

import type { Operation, Resource } from './types';

export const RESOURCES: Resource[] = [
	{
		"value": "douyin",
		"name": "Douyin"
	},
	{
		"value": "xiaohongshu",
		"name": "Xiaohongshu (RedNote)"
	},
	{
		"value": "wechat_mp",
		"name": "WeChat Official Account"
	},
	{
		"value": "wechat_channels",
		"name": "WeChat Channels"
	},
	{
		"value": "wechat",
		"name": "WeChat Search"
	},
	{
		"value": "weibo",
		"name": "Weibo"
	},
	{
		"value": "bilibili",
		"name": "Bilibili"
	},
	{
		"value": "zhihu",
		"name": "Zhihu"
	},
	{
		"value": "kuaishou",
		"name": "Kuaishou"
	},
	{
		"value": "tiktok",
		"name": "TikTok"
	},
	{
		"value": "youtube",
		"name": "YouTube"
	},
	{
		"value": "x",
		"name": "X (Twitter)"
	},
	{
		"value": "reddit",
		"name": "Reddit"
	}
];

export const OPERATIONS: Operation[] = [
	{
		"endpoint": "xiaohongshu.notes.search",
		"resource": "xiaohongshu",
		"name": "Note Search",
		"description": "Search Xiaohongshu notes by terms: title, text, author, engagement counts, images, and a link that opens. Each says whether it is a brand partnership note on record. By relevance, newest, most liked, most commented or most saved; video or image notes only; published in the last day, week or half year. $0.02 a call; errors are not charged.",
		"pages": true,
		"fields": [
			{
				"name": "query",
				"displayName": "Search Terms",
				"kind": "string",
				"list": false,
				"required": true,
				"default": "",
				"description": "Search terms",
				"placeholder": "e.g. 咖啡"
			},
			{
				"name": "sort",
				"displayName": "Sort",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Relevance",
						"value": "relevance"
					},
					{
						"name": "Latest",
						"value": "latest"
					},
					{
						"name": "Popular",
						"value": "popular"
					},
					{
						"name": "Most Comments",
						"value": "most_comments"
					},
					{
						"name": "Most Favorites",
						"value": "most_favorites"
					}
				],
				"default": "relevance",
				"description": "Sort order: relevance, newest, most liked, most commented, most saved",
				"placeholder": "e.g. relevance"
			},
			{
				"name": "type",
				"displayName": "Type",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Video",
						"value": "video"
					},
					{
						"name": "Image",
						"value": "image"
					}
				],
				"default": "",
				"description": "Video notes only (video) or image notes only (image); both when left out",
				"placeholder": "e.g. video"
			},
			{
				"name": "published_within",
				"displayName": "Published Within",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Day",
						"value": "day"
					},
					{
						"name": "Week",
						"value": "week"
					},
					{
						"name": "Half Year",
						"value": "half_year"
					}
				],
				"default": "",
				"description": "Only those published in the last day, week or half year",
				"placeholder": "e.g. week"
			}
		]
	},
	{
		"endpoint": "douyin.videos.search",
		"resource": "douyin",
		"name": "Video Search",
		"description": "Search Douyin videos by terms, a page at a time, sorted by relevance, newest or most liked and filtered by time posted: caption, author with follower count, engagement counts. $0.02 a call; errors are not charged.",
		"pages": true,
		"fields": [
			{
				"name": "query",
				"displayName": "Search Terms",
				"kind": "string",
				"list": false,
				"required": true,
				"default": "",
				"description": "Search terms",
				"placeholder": "e.g. 露营"
			},
			{
				"name": "sort",
				"displayName": "Sort",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Relevance",
						"value": "relevance"
					},
					{
						"name": "Latest",
						"value": "latest"
					},
					{
						"name": "Popular",
						"value": "popular"
					}
				],
				"default": "relevance",
				"description": "Order: the platform's ranking, newest first, most liked first. Douyin does not serve most liked within a day; with that pair, a day's results come with each page in order of likes",
				"placeholder": "e.g. relevance"
			},
			{
				"name": "published_within",
				"displayName": "Published Within",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Day",
						"value": "day"
					},
					{
						"name": "Week",
						"value": "week"
					},
					{
						"name": "Half Year",
						"value": "half_year"
					}
				],
				"default": "",
				"description": "Only videos posted within the last day, week or half year; any time when left out",
				"placeholder": "e.g. week"
			}
		]
	},
	{
		"endpoint": "wechat_mp.accounts.articles.list",
		"resource": "wechat_mp",
		"name": "Articles",
		"description": "Get a page of the articles a WeChat Official Account published, newest first: title, digest, link, time published. Each also says whether it was the lead article or one below, its format and cover. The page's articles tab by default; its videos or pictures tab when asked. $0.02 a call; errors are not charged.",
		"pages": true,
		"fields": [
			{
				"name": "id",
				"displayName": "Account's Original ID",
				"kind": "string",
				"list": false,
				"required": true,
				"default": "",
				"description": "The account's original ID, mostly starting with gh_ but not always, not the account's name; knowing only the name, find it with wechat.accounts.search and take id",
				"placeholder": "e.g. gh_13c97ab93ce8"
			},
			{
				"name": "tab",
				"displayName": "Tab",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Articles",
						"value": "articles"
					},
					{
						"name": "Videos",
						"value": "videos"
					},
					{
						"name": "Images",
						"value": "images"
					}
				],
				"default": "articles",
				"description": "Which tab of the account's page: articles (the default), videos or pictures",
				"placeholder": "e.g. articles"
			}
		]
	},
	{
		"endpoint": "douyin.videos.comments.list",
		"resource": "douyin",
		"name": "Video Comments",
		"description": "Get a page of comments on a Douyin video: text, commenter, likes, reply count, time posted. $0.002 a call; errors are not charged.",
		"pages": true,
		"fields": [
			{
				"name": "id",
				"displayName": "Video ID",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "Video ID, a string of digits. With only a link or a share text, give it as url",
				"placeholder": "e.g. 7694940173372575014"
			},
			{
				"name": "url",
				"displayName": "Link to the Video",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "Link to the video, pasted as it is: the https://www.douyin.com/video/… web link, a web link with modal_id in it, the page a share opens on a phone, the v.douyin.com short link the app copies, or a whole share text with one of these in it. A short link is opened once to see which video it leads to",
				"placeholder": "e.g. https://www.douyin.com/video/7694940173372575014"
			}
		]
	},
	{
		"endpoint": "douyin.videos.metrics",
		"resource": "douyin",
		"name": "Video Play Count",
		"description": "Get a Douyin video's counts as of now, by its ID: plays and likes. $0.002 a call; errors are not charged.",
		"pages": false,
		"fields": [
			{
				"name": "id",
				"displayName": "Video ID",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "Video ID, a string of digits. With only a link or a share text, give it as url",
				"placeholder": "e.g. 7694940173372575014"
			},
			{
				"name": "url",
				"displayName": "Link to the Video",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "Link to the video, pasted as it is: the https://www.douyin.com/video/… web link, a web link with modal_id in it, the page a share opens on a phone, the v.douyin.com short link the app copies, or a whole share text with one of these in it. A short link is opened once to see which video it leads to",
				"placeholder": "e.g. https://www.douyin.com/video/7694940173372575014"
			}
		]
	},
	{
		"endpoint": "douyin.videos.get",
		"resource": "douyin",
		"name": "Video Detail",
		"description": "Get one Douyin video or image post by ID or link: caption, author, engagement counts, time posted. $0.002 a call; errors are not charged.",
		"pages": false,
		"fields": [
			{
				"name": "id",
				"displayName": "Video ID",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "Video ID, a string of digits. With only a link or a share text, give it as url",
				"placeholder": "e.g. 7694940173372575014"
			},
			{
				"name": "url",
				"displayName": "Link to the Video",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "Link to the video, pasted as it is: the https://www.douyin.com/video/… web link, a web link with modal_id in it, the page a share opens on a phone, the v.douyin.com short link the app copies, or a whole share text with one of these in it. A short link is opened once to see which video it leads to",
				"placeholder": "e.g. https://www.douyin.com/video/7694940173372575014"
			}
		]
	},
	{
		"endpoint": "douyin.users.videos.list",
		"resource": "douyin",
		"name": "User Videos",
		"description": "Get a page of the videos a Douyin account has posted, newest first: caption, engagement counts, time posted. $0.002 a call; errors are not charged.",
		"pages": true,
		"fields": [
			{
				"name": "id",
				"displayName": "Account ID",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "Account ID (the sec_uid, the string that starts with MS4w). With only a profile link or a share text, give it as url",
				"placeholder": "e.g. MS4wLjABAAAAZ0aPDJzFhBrs0q3wVsp2a9WWrBuAUMsVyygoaO0bCw8"
			},
			{
				"name": "url",
				"displayName": "Link to the Profile",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "Link to the profile, pasted as it is: the https://www.douyin.com/user/… web link, the page a share opens on a phone, the v.douyin.com short link the app copies, or a whole share text with one of these in it. A short link is opened once to see which account it leads to",
				"placeholder": "e.g. https://www.douyin.com/user/MS4wLjABAAAAZ0aPDJzFhBrs0q3wVsp2a9WWrBuAUMsVyygoaO0bCw8"
			}
		]
	},
	{
		"endpoint": "wechat_mp.articles.get",
		"resource": "wechat_mp",
		"name": "Article Detail",
		"description": "Get one WeChat Official Account article by its link: title, text, time published, the account's name and IDs. It also says whether it was the lead article or one below, its format, cover, digest, byline, \"read the original\" link and the IP location it was posted from. $0.02 a call; errors are not charged.",
		"pages": false,
		"fields": [
			{
				"name": "url",
				"displayName": "Link to the Article",
				"kind": "string",
				"list": false,
				"required": true,
				"default": "",
				"description": "Link to the article, pasted as it is: the long link with __biz, mid, idx and sn, the short /s/ link, or a share text with one of them in it",
				"placeholder": "e.g. https://mp.weixin.qq.com/s?__biz=MjM5MjAxNDM4MA==&mid=2667038683&idx=1&sn=0422127e651acd7f6cf6ef7e1cff04bc"
			}
		]
	},
	{
		"endpoint": "douyin.users.get",
		"resource": "douyin",
		"name": "User Profile",
		"description": "Get a Douyin user's profile by account ID or profile link: name, handle, bio, follower, following and post counts, total likes, verification; in the full view also what the badge says, whether it is an organisation's or shop's (blue V), whether the profile has a product showcase, whether the account may sell live, and whether it is live now, with the room's ID. $0.002 a call; errors are not charged.",
		"pages": false,
		"fields": [
			{
				"name": "id",
				"displayName": "Account ID",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "Account ID (the sec_uid, the string that starts with MS4w). With only a profile link or a share text, give it as url",
				"placeholder": "e.g. MS4wLjABAAAAZ0aPDJzFhBrs0q3wVsp2a9WWrBuAUMsVyygoaO0bCw8"
			},
			{
				"name": "url",
				"displayName": "Link to the Profile",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "Link to the profile, pasted as it is: the https://www.douyin.com/user/… web link, the page a share opens on a phone, the v.douyin.com short link the app copies, or a whole share text with one of these in it. A short link is opened once to see which account it leads to",
				"placeholder": "e.g. https://www.douyin.com/user/MS4wLjABAAAAZ0aPDJzFhBrs0q3wVsp2a9WWrBuAUMsVyygoaO0bCw8"
			}
		]
	},
	{
		"endpoint": "xiaohongshu.notes.get",
		"resource": "xiaohongshu",
		"name": "Note Detail",
		"description": "Get one Xiaohongshu note by ID or link: title, text, author, engagement counts, images. It also says whether it is a brand partnership note on record. $0.02 a call; errors are not charged.",
		"pages": false,
		"fields": [
			{
				"name": "id",
				"displayName": "Note ID",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "Note ID, 24 hexadecimal characters. With only a link or a share text, give it as url",
				"placeholder": "e.g. 6ac76250000000000a021233"
			},
			{
				"name": "url",
				"displayName": "Link to the Note",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "Link to the note, pasted as it is: the https://www.xiaohongshu.com/explore/… address from the browser, the https://www.xiaohongshu.com/discovery/item/… link the website shares (query parameters such as xsec_token are fine), a whole share text with such a link in it, or the xhslink.com short link the app copies (alone or in its share text). A short link is opened once to see which note it leads to; where it cannot be, paste the note's full link or its ID",
				"placeholder": "e.g. https://www.xiaohongshu.com/explore/6ac76250000000000a021233?xsec_token=ABx1y2z3"
			}
		]
	},
	{
		"endpoint": "douyin.users.search",
		"resource": "douyin",
		"name": "User Search",
		"description": "Search Douyin accounts by terms, a page at a time: account ID, display name, avatar, follower count, post count, total likes. $0.002 a call; errors are not charged.",
		"pages": true,
		"fields": [
			{
				"name": "query",
				"displayName": "Search Terms",
				"kind": "string",
				"list": false,
				"required": true,
				"default": "",
				"description": "Search terms",
				"placeholder": "e.g. 博物馆"
			}
		]
	},
	{
		"endpoint": "douyin.index.keywords.history",
		"resource": "douyin",
		"name": "Trend-index Keyword Trends",
		"description": "Get the day-by-day search index and composite index of a keyword, or of one to five keywords at once, on Douyin over a date range, from 巨量算数 (the Douyin index), with the daily averages of the period, of the one before and of a year earlier. An index is the platform's score of volume, not a count of searches; days are calendar days in China time (UTC+8). $0.006 a call; errors are not charged.",
		"pages": false,
		"fields": [
			{
				"name": "keyword",
				"displayName": "Keyword",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "One keyword, at most 50 characters and without a comma; letter case does not matter",
				"placeholder": "e.g. 咖啡"
			},
			{
				"name": "keywords",
				"displayName": "Keywords",
				"kind": "string",
				"list": true,
				"required": false,
				"default": "",
				"description": "One to five keywords, each at most 50 characters and without a comma; letter case does not matter. One item comes back per keyword that has figures; a keyword the index does not cover is not in the answer. Several separated by commas",
				"placeholder": "e.g. 咖啡,CityWalk"
			},
			{
				"name": "since",
				"displayName": "From Date",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "The first day wanted: the China-time (UTC+8) calendar day this moment falls on; 2026-09-01 means 1 September; left out, the 30 days that end on until",
				"placeholder": "e.g. 2026-09-01T00:00:00Z"
			},
			{
				"name": "until",
				"displayName": "To Date",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "The last day wanted, read the same way. The platform publishes a day or two late: a day it has no figure for yet has a null index; left out, yesterday",
				"placeholder": "e.g. 2026-09-30T00:00:00Z"
			}
		]
	},
	{
		"endpoint": "douyin.trends.list",
		"resource": "douyin",
		"name": "Hot Search Board",
		"description": "Get a Douyin hot list: hot searches, rising topics, topic ranking, top search terms or the music chart, with rank and heat. $0.002 a call; errors are not charged.",
		"pages": true,
		"fields": [
			{
				"name": "board",
				"displayName": "Board",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Hot Search",
						"value": "hot_search"
					},
					{
						"name": "Rising",
						"value": "rising"
					},
					{
						"name": "Topics",
						"value": "topics"
					},
					{
						"name": "Searches",
						"value": "searches"
					},
					{
						"name": "Music",
						"value": "music"
					}
				],
				"default": "hot_search",
				"description": "Which list: hot searches, rising topics, topic ranking, top search terms, the music chart",
				"placeholder": "e.g. hot_search"
			}
		]
	},
	{
		"endpoint": "wechat.posts.search",
		"resource": "wechat",
		"name": "Articles and Videos",
		"description": "Get a page of WeChat Search results for search terms: Official Account articles and Channels videos mixed, each saying in type whether it is an article or a video; by relevance, newest or hottest, filtered by time posted, or articles only or videos only: title or description, the source account's name, time published, an article's link (with a band of reads on some), a video's likes and saves. WeChat Search gives no account ID. $0.02 a call; errors are not charged.",
		"pages": true,
		"fields": [
			{
				"name": "query",
				"displayName": "Search Terms",
				"kind": "string",
				"list": false,
				"required": true,
				"default": "",
				"description": "Search terms",
				"placeholder": "e.g. 咖啡店开业"
			},
			{
				"name": "sort",
				"displayName": "Sort",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Relevance",
						"value": "relevance"
					},
					{
						"name": "Latest",
						"value": "latest"
					},
					{
						"name": "Popular",
						"value": "popular"
					}
				],
				"default": "relevance",
				"description": "By relevance, by time published (newest first) or by how hot",
				"placeholder": "e.g. relevance"
			},
			{
				"name": "published_within",
				"displayName": "Published Within",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Day",
						"value": "day"
					},
					{
						"name": "Week",
						"value": "week"
					},
					{
						"name": "Half Year",
						"value": "half_year"
					}
				],
				"default": "",
				"description": "Only those published in the last day, week or half year",
				"placeholder": "e.g. week"
			},
			{
				"name": "type",
				"displayName": "Type",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Article",
						"value": "article"
					},
					{
						"name": "Video",
						"value": "video"
					}
				],
				"default": "",
				"description": "Official Account articles only (article) or Channels videos only (video); both mixed when left out",
				"placeholder": "e.g. article"
			}
		]
	},
	{
		"endpoint": "wechat_channels.videos.search",
		"resource": "wechat_channels",
		"name": "Video Search",
		"description": "Get a page of WeChat Channels videos for search terms through WeChat Search, by relevance, newest or hottest, filtered by time posted: description, the account's name and avatar, time published, likes and saves, length, cover. WeChat Search gives no account ID, and a video's ID is an encrypted one starting with export/: given as export_id to wechat_channels.videos.get it yields the numeric ID, the video file's address and the key that decrypts it; it expires, so use it soon. $0.02 a call; errors are not charged.",
		"pages": true,
		"fields": [
			{
				"name": "query",
				"displayName": "Search Terms",
				"kind": "string",
				"list": false,
				"required": true,
				"default": "",
				"description": "Search terms",
				"placeholder": "e.g. 露营装备推荐"
			},
			{
				"name": "sort",
				"displayName": "Sort",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Relevance",
						"value": "relevance"
					},
					{
						"name": "Latest",
						"value": "latest"
					},
					{
						"name": "Popular",
						"value": "popular"
					}
				],
				"default": "relevance",
				"description": "By relevance, by time published (newest first) or by how hot",
				"placeholder": "e.g. latest"
			},
			{
				"name": "published_within",
				"displayName": "Published Within",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Day",
						"value": "day"
					},
					{
						"name": "Week",
						"value": "week"
					},
					{
						"name": "Half Year",
						"value": "half_year"
					}
				],
				"default": "",
				"description": "Only those published in the last day, week or half year",
				"placeholder": "e.g. week"
			}
		]
	},
	{
		"endpoint": "wechat.accounts.search",
		"resource": "wechat_mp",
		"name": "Live Search",
		"description": "Find WeChat Official Accounts and service accounts for search terms through WeChat Search, closest first, possibly followed by less related ones: original ID, WeChat ID, name, bio, avatar, whether verified, owner, number of original articles. Charged per call; no followers or reads, for estimates of those use wechat_mp.accounts.search. $0.02 a call; errors are not charged.",
		"pages": true,
		"fields": [
			{
				"name": "query",
				"displayName": "Search Terms",
				"kind": "string",
				"list": false,
				"required": true,
				"default": "",
				"description": "The account's name, or a keyword",
				"placeholder": "e.g. 36氪"
			}
		]
	},
	{
		"endpoint": "wechat_channels.videos.get",
		"resource": "wechat_channels",
		"name": "Video Detail",
		"description": "Get one WeChat Channels video by its ID, a search result's export/ ID or its share link: description, author, time published, likes, comments, forwards, saves, and the video file's address with the key that decrypts it. $0.02 a call; errors are not charged.",
		"pages": false,
		"fields": [
			{
				"name": "id",
				"displayName": "Video's ID",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "The video's ID, a string of digits: the id a video list gives",
				"placeholder": "e.g. 14559898883113486609"
			},
			{
				"name": "url",
				"displayName": "Video's Share Link",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "The video's share link, starting with weixin.qq.com/sph/",
				"placeholder": "e.g. https://weixin.qq.com/sph/ABgJVPnSSu"
			},
			{
				"name": "export_id",
				"displayName": "Search Result Video ID",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "The id of a wechat_channels.videos.search result, starting with export/. It expires: use it soon after the search. The id returned is the video's numeric ID",
				"placeholder": "e.g. export/UzFfBgAAxJeLPEsjEjWuk8zT4DCKThrNP5lzaPLJoEvz7FZtxw"
			}
		]
	},
	{
		"endpoint": "xiaohongshu.notes.comments.list",
		"resource": "xiaohongshu",
		"name": "Note Comments",
		"description": "Get a page of top-level comments on a Xiaohongshu note by ID or link, newest first or hottest first: text, commenter, likes, reply count, time posted. $0.02 a call; errors are not charged.",
		"pages": true,
		"fields": [
			{
				"name": "id",
				"displayName": "Note ID",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "Note ID, 24 hexadecimal characters. With only a link or a share text, give it as url",
				"placeholder": "e.g. 6a9c5884000000002b002d95"
			},
			{
				"name": "url",
				"displayName": "Link to the Note",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "Link to the note, pasted as it is: the https://www.xiaohongshu.com/explore/… address from the browser, the https://www.xiaohongshu.com/discovery/item/… link the website shares (query parameters such as xsec_token are fine), a whole share text with such a link in it, or the xhslink.com short link the app copies (alone or in its share text). A short link is opened once to see which note it leads to; where it cannot be, paste the note's full link or its ID",
				"placeholder": "e.g. https://www.xiaohongshu.com/explore/6a9c5884000000002b002d95?xsec_token=ABx1y2z3"
			},
			{
				"name": "sort",
				"displayName": "Sort",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Latest",
						"value": "latest"
					},
					{
						"name": "Popular",
						"value": "popular"
					}
				],
				"default": "latest",
				"description": "Newest first (the default), or hottest first (most liked first)",
				"placeholder": "e.g. latest"
			}
		]
	},
	{
		"endpoint": "wechat_channels.users.videos.list",
		"resource": "wechat_channels",
		"name": "Account Videos",
		"description": "Get a page of the videos a WeChat Channels account published, newest first, by the account's ID: description, time published, likes, comments, forwards, saves, length. $0.02 a call; errors are not charged.",
		"pages": true,
		"fields": [
			{
				"name": "id",
				"displayName": "Channels Account's ID",
				"kind": "string",
				"list": false,
				"required": true,
				"default": "",
				"description": "The Channels account's ID, starting with v2_ and ending in @finder. Find it by name with wechat_channels.users.search, or look up one of its videos with wechat_channels.videos.get (by share link or a search result's export_id): the author.id returned is it. The sph… ID the app shows is not it",
				"placeholder": "e.g. v2_060000231003b20faec8c5e5811dc3ddce02ec30b0772029a703e1b9f446ba147658bbcfab81@finder"
			}
		]
	},
	{
		"endpoint": "xiaohongshu.users.notes.list",
		"resource": "xiaohongshu",
		"name": "User Notes",
		"description": "Get a page of the notes a Xiaohongshu account posted, by user ID or profile link: title, text, engagement counts, images, whether pinned. $0.02 a call; errors are not charged.",
		"pages": true,
		"fields": [
			{
				"name": "id",
				"displayName": "User ID",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "User ID, 24 hexadecimal characters. With only a profile link, give it as url",
				"placeholder": "e.g. 63bed214000000002702b862"
			},
			{
				"name": "url",
				"displayName": "Link to the Profile",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "Link to the profile, pasted as it is: https://www.xiaohongshu.com/user/profile/… (query parameters such as xsec_token are fine), a whole share text with such a link in it, or the xhslink.com short link the app copies. A short link is opened once to see which profile it leads to; where it cannot be, paste the profile's full link or the user ID",
				"placeholder": "e.g. https://www.xiaohongshu.com/user/profile/63bed214000000002702b862?xsec_token=ABx1y2z3"
			}
		]
	},
	{
		"endpoint": "weibo.posts.search",
		"resource": "weibo",
		"name": "Realtime Search",
		"description": "Get a page of Weibo posts for search terms, newest first: text (a long post is cut short here), author and follower count, likes, comments, reposts, video plays, pictures, topics. $0.002 a call; errors are not charged.",
		"pages": true,
		"fields": [
			{
				"name": "query",
				"displayName": "Search Terms",
				"kind": "string",
				"list": false,
				"required": true,
				"default": "",
				"description": "Search terms",
				"placeholder": "e.g. 新能源汽车"
			}
		]
	},
	{
		"endpoint": "bilibili.videos.search",
		"resource": "bilibili",
		"name": "Video Search",
		"description": "Get a page of Bilibili videos for search terms, by relevance, newest or most played: title, uploader, views, likes, saves, comments, length. $0.002 a call; errors are not charged.",
		"pages": true,
		"fields": [
			{
				"name": "query",
				"displayName": "Search Terms",
				"kind": "string",
				"list": false,
				"required": true,
				"default": "",
				"description": "Search terms",
				"placeholder": "e.g. 机械键盘"
			},
			{
				"name": "sort",
				"displayName": "Sort",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Relevance",
						"value": "relevance"
					},
					{
						"name": "Latest",
						"value": "latest"
					},
					{
						"name": "Popular",
						"value": "popular"
					}
				],
				"default": "relevance",
				"description": "By relevance, by time published (newest first) or by views",
				"placeholder": "e.g. relevance"
			}
		]
	},
	{
		"endpoint": "xiaohongshu.users.get",
		"resource": "xiaohongshu",
		"name": "User Profile",
		"description": "Get a Xiaohongshu account by user ID or profile link: name, handle, bio, follower, following and note counts, verification, and the gender and region its profile shows. $0.02 a call; errors are not charged.",
		"pages": false,
		"fields": [
			{
				"name": "id",
				"displayName": "User ID",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "User ID, 24 hexadecimal characters. With only a profile link, give it as url",
				"placeholder": "e.g. 63bed214000000002702b862"
			},
			{
				"name": "url",
				"displayName": "Link to the Profile",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "Link to the profile, pasted as it is: https://www.xiaohongshu.com/user/profile/… (query parameters such as xsec_token are fine), a whole share text with such a link in it, or the xhslink.com short link the app copies. A short link is opened once to see which profile it leads to; where it cannot be, paste the profile's full link or the user ID",
				"placeholder": "e.g. https://www.xiaohongshu.com/user/profile/63bed214000000002702b862?xsec_token=ABx1y2z3"
			}
		]
	},
	{
		"endpoint": "xiaohongshu.pgy.keywords.history",
		"resource": "xiaohongshu",
		"name": "PGY Keyword Search Index",
		"description": "Get a keyword's day-by-day search index on Xiaohongshu over about the last three months, from the platform's creator marketplace, with each day's notes about the keyword and how often they were shown, read and engaged with. The platform sets the period; it cannot be chosen. The search index is the platform's index, not a count of searches; days are calendar days in China time (UTC+8). $0.04 a call; errors are not charged.",
		"pages": false,
		"fields": [
			{
				"name": "keyword",
				"displayName": "Keyword",
				"kind": "string",
				"list": false,
				"required": true,
				"default": "",
				"description": "One keyword",
				"placeholder": "e.g. 面膜"
			}
		]
	},
	{
		"endpoint": "wechat_mp.articles.metrics",
		"resource": "wechat_mp",
		"name": "Article Stats",
		"description": "Get the current counts of a WeChat Official Account article by its long link: reads, likes, recommends, shares, saves, comments. $0.02 a call; errors are not charged.",
		"pages": false,
		"fields": [
			{
				"name": "url",
				"displayName": "Article's Long Link",
				"kind": "string",
				"list": false,
				"required": true,
				"default": "",
				"description": "The article's long link, with __biz, mid, idx and sn",
				"placeholder": "e.g. https://mp.weixin.qq.com/s?__biz=MjM5MjAxNDM4MA==&mid=2667038683&idx=1&sn=0422127e651acd7f6cf6ef7e1cff04bc"
			}
		]
	},
	{
		"endpoint": "wechat_channels.videos.comments.list",
		"resource": "wechat_channels",
		"name": "Video Comments",
		"description": "Get a page of top-level comments on a WeChat Channels video by its ID: text, commenter, likes, time posted, IP location. $0.02 a call; errors are not charged.",
		"pages": true,
		"fields": [
			{
				"name": "id",
				"displayName": "Video's ID",
				"kind": "string",
				"list": false,
				"required": true,
				"default": "",
				"description": "The video's ID, a string of digits: the id a video list or a video gives",
				"placeholder": "e.g. 14559898883113486609"
			}
		]
	},
	{
		"endpoint": "douyin.index.keywords.related",
		"resource": "douyin",
		"name": "Trend-index Related Keywords",
		"description": "Get the keywords related to a keyword on Douyin in one week, from the platform's own keyword tool: those searched together with it and those that appear with it in content, each with its relevance, its place by relevance, its search index and its composite index. An index is the platform's score of volume, not a count of searches. $0.002 a call; errors are not charged.",
		"pages": false,
		"fields": [
			{
				"name": "keyword",
				"displayName": "Keyword",
				"kind": "string",
				"list": false,
				"required": true,
				"default": "",
				"description": "One keyword; letter case does not matter",
				"placeholder": "e.g. 露营"
			},
			{
				"name": "until",
				"displayName": "To Date",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "Which week: relations are computed by the week (Monday to Sunday, China time), and the week returned is the last whole one ending on or before this day. The latest week is published early in the next; before that the result is empty; left out, 7 days ago: the latest whole week already published",
				"placeholder": "e.g. 2026-10-04T00:00:00Z"
			}
		]
	},
	{
		"endpoint": "zhihu.posts.search",
		"resource": "zhihu",
		"name": "Content Search",
		"description": "Get a page of Zhihu answers and articles matching a search; either kind alone, by relevance, newest or most upvoted. $0.002 a call; errors are not charged.",
		"pages": true,
		"fields": [
			{
				"name": "query",
				"displayName": "Search Terms",
				"kind": "string",
				"list": false,
				"required": true,
				"default": "",
				"description": "Search terms",
				"placeholder": "e.g. 咖啡机推荐"
			},
			{
				"name": "type",
				"displayName": "Type",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Answer",
						"value": "answer"
					},
					{
						"name": "Article",
						"value": "article"
					}
				],
				"default": "",
				"description": "Answers only, or articles only; both when left out",
				"placeholder": "e.g. answer"
			},
			{
				"name": "sort",
				"displayName": "Sort",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Relevance",
						"value": "relevance"
					},
					{
						"name": "Latest",
						"value": "latest"
					},
					{
						"name": "Popular",
						"value": "popular"
					}
				],
				"default": "relevance",
				"description": "By relevance, newest first, or most upvoted first",
				"placeholder": "e.g. relevance"
			}
		]
	},
	{
		"endpoint": "kuaishou.videos.search",
		"resource": "kuaishou",
		"name": "Video Search",
		"description": "Search Kuaishou posts by terms, a page at a time, sorted newest or most liked first and filtered by time posted and video length: caption, author, play and engagement counts, time posted, whether it is a video or a photo set, and a video's length. $0.02 a call; errors are not charged.",
		"pages": true,
		"fields": [
			{
				"name": "query",
				"displayName": "Search Terms",
				"kind": "string",
				"list": false,
				"required": true,
				"default": "",
				"description": "Search terms",
				"placeholder": "e.g. 露营装备"
			},
			{
				"name": "sort",
				"displayName": "Sort",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Relevance",
						"value": "relevance"
					},
					{
						"name": "Latest",
						"value": "latest"
					},
					{
						"name": "Popular",
						"value": "popular"
					}
				],
				"default": "relevance",
				"description": "Order: the platform's ranking (the default), newest first, most liked first",
				"placeholder": "e.g. latest"
			},
			{
				"name": "published_within",
				"displayName": "Published Within",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Day",
						"value": "day"
					},
					{
						"name": "Week",
						"value": "week"
					},
					{
						"name": "Month",
						"value": "month"
					}
				],
				"default": "",
				"description": "Only posts from the last day, week or month; any time when left out",
				"placeholder": "e.g. day"
			},
			{
				"name": "duration",
				"displayName": "Duration",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Under 1 Min",
						"value": "under_1_min"
					},
					{
						"name": "1 to 5 Min",
						"value": "1_to_5_min"
					},
					{
						"name": "Over 5 Min",
						"value": "over_5_min"
					}
				],
				"default": "",
				"description": "Only videos of this length band; any length when left out",
				"placeholder": "e.g. under_1_min"
			}
		]
	},
	{
		"endpoint": "douyin.xingtu.creators.search",
		"resource": "douyin",
		"name": "Xingtu Creator Search",
		"description": "Search Douyin creators on Xingtu by words in their name, filtered by followers, expected CPM (in yuan) and gender, or ordered by expected CPM, lowest first:Xingtu creator ID, name, location, content categories, followers; in the full view also what an integrated and a custom video cost, expected CPMs (in yuan), expected views, the last 30 days' interaction and completion ratios and median views, the e-commerce level, gender and content labels. The creator ID the other Xingtu endpoints take comes from here. $0.004 a call; errors are not charged.",
		"pages": true,
		"fields": [
			{
				"name": "query",
				"displayName": "Search Terms",
				"kind": "string",
				"list": false,
				"required": true,
				"default": "",
				"description": "Search terms, matched against creators' names",
				"placeholder": "e.g. 美食"
			},
			{
				"name": "followers_min",
				"displayName": "Followers At Least",
				"kind": "number",
				"list": false,
				"required": false,
				"default": "",
				"description": "At least this many followers",
				"placeholder": "e.g. 100000"
			},
			{
				"name": "followers_max",
				"displayName": "Followers At Most",
				"kind": "number",
				"list": false,
				"required": false,
				"default": "",
				"description": "At most this many followers",
				"placeholder": "e.g. 1000000"
			},
			{
				"name": "cpm_min",
				"displayName": "CPM At Least",
				"kind": "number",
				"list": false,
				"required": false,
				"default": "",
				"description": "Expected cost per thousand views of an integrated video (ext.cpm_integrated) at least this, in yuan",
				"placeholder": "e.g. 10"
			},
			{
				"name": "cpm_max",
				"displayName": "CPM At Most",
				"kind": "number",
				"list": false,
				"required": false,
				"default": "",
				"description": "Expected cost per thousand views of an integrated video (ext.cpm_integrated) at most this, in yuan: 50 is no more than 50 yuan a thousand views",
				"placeholder": "e.g. 50"
			},
			{
				"name": "gender",
				"displayName": "Gender",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Female",
						"value": "female"
					},
					{
						"name": "Male",
						"value": "male"
					}
				],
				"default": "",
				"description": "Only female or only male creators",
				"placeholder": "e.g. female"
			},
			{
				"name": "sort",
				"displayName": "Sort",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Relevance",
						"value": "relevance"
					},
					{
						"name": "Lowest Cpm",
						"value": "lowest_cpm"
					}
				],
				"default": "relevance",
				"description": "Order: relevance, the platform's own ranking (the default); lowest_cpm, by expected CPM, lowest first. The platform orders by the figure in ext.cpm_promoted, so the order may differ from that of ext.cpm_integrated",
				"placeholder": "e.g. lowest_cpm"
			}
		]
	},
	{
		"endpoint": "tiktok.videos.search",
		"resource": "tiktok",
		"name": "Video Search",
		"description": "Search TikTok videos by keyword, 30 a page; sort by relevance, likes or time posted, and limit how recently they were posted. $0.002 a call; errors are not charged.",
		"pages": true,
		"fields": [
			{
				"name": "query",
				"displayName": "Search Terms",
				"kind": "string",
				"list": false,
				"required": true,
				"default": "",
				"description": "Search terms",
				"placeholder": "e.g. space station"
			},
			{
				"name": "sort",
				"displayName": "Sort",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Relevance",
						"value": "relevance"
					},
					{
						"name": "Popular",
						"value": "popular"
					},
					{
						"name": "Latest",
						"value": "latest"
					}
				],
				"default": "relevance",
				"description": "By relevance, by likes, or newest first",
				"placeholder": "e.g. relevance"
			},
			{
				"name": "published_within",
				"displayName": "Published Within",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Day",
						"value": "day"
					},
					{
						"name": "Week",
						"value": "week"
					},
					{
						"name": "Month",
						"value": "month"
					},
					{
						"name": "Half Year",
						"value": "half_year"
					}
				],
				"default": "",
				"description": "Only videos posted within this period",
				"placeholder": "e.g. week"
			}
		]
	},
	{
		"endpoint": "youtube.videos.transcript.get",
		"resource": "youtube",
		"name": "Video Transcript",
		"description": "Get the transcript of a YouTube video by ID or link: the whole text and timed segments. lang chooses the language of the captions. $0.002 a call; errors are not charged.",
		"pages": false,
		"fields": [
			{
				"name": "id",
				"displayName": "Video ID",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "Video ID",
				"placeholder": "e.g. dQw4w9WgXcQ"
			},
			{
				"name": "url",
				"displayName": "Link to the Video",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "Link to the video: a watch, shorts, embed, live or youtu.be link",
				"placeholder": "e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
			},
			{
				"name": "lang",
				"displayName": "Language",
				"kind": "string",
				"list": false,
				"required": false,
				"default": "",
				"description": "Which language of captions to get, as a language code (en, es, ja, zh-Hans, say); left out, the captions of the video's own language come first. A video without captions in that language is answered as one without captions",
				"placeholder": "e.g. en"
			}
		]
	},
	{
		"endpoint": "x.posts.search",
		"resource": "x",
		"name": "Post Search",
		"description": "Find X posts by search terms, most popular or newest first; the terms may use X's own search operators, such as from:handle. $0.002 a call; errors are not charged.",
		"pages": true,
		"fields": [
			{
				"name": "query",
				"displayName": "Search Terms",
				"kind": "string",
				"list": false,
				"required": true,
				"default": "",
				"description": "Search terms",
				"placeholder": "e.g. weather forecast"
			},
			{
				"name": "sort",
				"displayName": "Sort",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Popular",
						"value": "popular"
					},
					{
						"name": "Latest",
						"value": "latest"
					}
				],
				"default": "popular",
				"description": "Most popular first, or newest first",
				"placeholder": "e.g. popular"
			}
		]
	},
	{
		"endpoint": "reddit.posts.search",
		"resource": "reddit",
		"name": "Post Search",
		"description": "Get a page of Reddit posts matching a search, by relevance, newest or top score, optionally within a period. $0.002 a call; errors are not charged.",
		"pages": true,
		"fields": [
			{
				"name": "query",
				"displayName": "Search Terms",
				"kind": "string",
				"list": false,
				"required": true,
				"default": "",
				"description": "Search terms",
				"placeholder": "e.g. saturn rings"
			},
			{
				"name": "sort",
				"displayName": "Sort",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Relevance",
						"value": "relevance"
					},
					{
						"name": "Latest",
						"value": "latest"
					},
					{
						"name": "Popular",
						"value": "popular"
					}
				],
				"default": "relevance",
				"description": "By relevance, newest first, or top score first",
				"placeholder": "e.g. relevance"
			},
			{
				"name": "published_within",
				"displayName": "Published Within",
				"kind": "options",
				"list": false,
				"required": false,
				"options": [
					{
						"name": "Day",
						"value": "day"
					},
					{
						"name": "Week",
						"value": "week"
					},
					{
						"name": "Month",
						"value": "month"
					},
					{
						"name": "Year",
						"value": "year"
					}
				],
				"default": "",
				"description": "Published within the last period",
				"placeholder": "e.g. month"
			}
		]
	}
];
