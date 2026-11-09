# lorcan.space

Lorcán O'Neill's personal website, live at https://www.lorcan.space.

## How it's put together

- `src/index.html` is the whole site in one file (design, copy, script). Edit this.
- `build.mjs` turns it into real pages in `public/` (no dependencies, just Node):
  `/`, `/about`, `/experience`, `/work`, `/thoughts`, `/contact`, `/thoughts/<slug>` and a real 404.
  Each page carries only its own content, its own title, description, canonical URL,
  share image and structured data. After the page loads, the other pages are fetched
  in the background so moving around the site stays instant (with the curtain transition).
- Vercel runs `node build.mjs` on every push (`vercel.json`). It also handles
  clean URLs, redirects and caching.
- `og/` holds the 1200 × 630 share images, one per page.
- `seo/lastmod.json` remembers when each page last changed, for the sitemap.

## Publishing a Thought

Posts live in the `POSTS` list inside `src/index.html`. The six there now are drafts:
their pages are `noindex`, the Thoughts page is `noindex`, and none of them are in the sitemap.

To publish one, give it a real date, e.g. `date:"2026-12-01"`, then push. The build will:

- make the post indexable, with a visible date and author,
- add `BlogPosting` structured data,
- add it to `sitemap.xml` and `llms.txt`,
- make `/thoughts` indexable once at least one post is published.

## Local preview

```
node build.mjs
npx serve public   # or any static server
```
