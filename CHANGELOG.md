# Changelog

## 0.2.0

- One operation per DataXAPI endpoint, grouped by platform (Resource), written from the live catalog by
  `scripts/generate-operations.mjs`: the 30 endpoints customers called most in the 30 days to 2026-11-20, then TikTok
  search, YouTube transcripts, X and Reddit search. Each operation states its price.
- *Any Endpoint → Find* searches the catalog in plain words, free; *Any Endpoint → Call* reaches the other 203.
- The per-platform grouped operations are gone; the templates that watch several platforms now list an endpoint per
  item and use *Any Endpoint → Call*.

## 0.1.0 (not published)

- DataXAPI node: Official Account articles, account posts, comments, keyword search, and any endpoint by ID.
- Cursor paging up to a chosen number of pages; output as one item per result or one item per page.
- DataXAPI API credential (Bearer key), checked with the free `GET /v1/account`.
- Four workflow templates in `templates/`.
