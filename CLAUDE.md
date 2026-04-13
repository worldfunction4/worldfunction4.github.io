# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static blog site for 泪叶丝 (LAYYES), built with [Docsify](https://docsify.js.org/) and hosted on GitHub Pages at `layyes.com`. No build step — all content is rendered client-side by Docsify.

## Development

To preview locally, serve the repo root with any static file server, e.g.:

```bash
npx serve .
# or
python -m http.server 3000
```

There are no build, lint, or test commands.

## Architecture

- `index.html` — entry point; contains all Docsify config (`window.$docsify`), inline CSS, and the busuanzi visit-counter script
- `_coverpage.md` — cover page content; hosts the busuanzi counter HTML (`#busuanzi_value_site_pv`, `#busuanzi_value_site_uv`)
- `_sidebar.md` — global sidebar navigation (all subdirectories reuse it via the `alias` config)
- `README.md` — homepage content shown after the cover
- Content pages live alongside `_sidebar.md` entries (e.g. `Network/路由器.md`)

## Key Behaviours

- **Busuanzi counter**: loaded once per session via `sessionStorage` (`busuanzi_locked`). Validates data with `/^\d+$/` and retries for up to 10 s before timing out.
- **Sidebar alias**: `'/.*/_sidebar.md': '/_sidebar.md'` forces all routes to use the root sidebar.
- **Cover visibility**: a Docsify plugin in `index.html` re-shows the cover when navigating back to `/`.
