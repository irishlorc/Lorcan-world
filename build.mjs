// Builds the live site from the single-file source (src/index.html).
//
// The source is the whole site in one file with hash routing (it also runs as a
// standalone preview). This script turns it into real, crawlable pages:
//   /  /about  /experience  /work  /thoughts  /contact  /thoughts/<slug>  404
// Each page ships only its own content, metadata and structured data. Once loaded,
// the browser pulls in the other pages (assets/pages.*.html) so navigation stays
// instant and the curtain transition still runs.
//
// Run: node build.mjs   (no dependencies). Output goes to ./public.
// Publishing a Thought: give its POSTS entry a date ("2026-12-01"). It is then
// indexable, gets BlogPosting data and is added to the sitemap automatically.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const SITE = "https://www.lorcan.space";
const OUT = "public";
const NAME = "Lorcán O'Neill";
const EMAIL = "lorcancreative@gmail.com";

const META = {
  home: {
    path: "/",
    title: "Lorcán O'Neill (Lor) | Creative, Business & AI",
    desc: "Meet Lorcán O'Neill, an Irish creative and commercial professional working across design, communications, business and AI. Explore his experience, work and writing.",
    og: "home",
    type: "WebPage",
  },
  about: {
    path: "/about",
    title: "About Lorcán O'Neill | Dublin, the Netherlands & Arkintel",
    desc: "Lorcán O'Neill (Lor) is from Dublin, spent nearly nine years living and working in the Netherlands, has written eight books and now works on the commercial side of Arkintel.",
    og: "about",
    type: "ProfilePage",
    crumb: "About",
  },
  experience: {
    path: "/experience",
    title: "Experience: Design, Comms, Business & Tech | Lorcán O'Neill",
    desc: "Over 13 years across design, communications, business and technology in Ireland and the Netherlands. Lorcán O'Neill currently works in a commercial role at Arkintel.",
    og: "experience",
    type: "WebPage",
    crumb: "Experience",
  },
  work: {
    path: "/work",
    title: "Work | Brands Lorcán O'Neill Has Worked For and With",
    desc: "Some familiar names: Arkintel, Heineken, Formula 1, UEFA, Just Eat, ATPI, Savvy Lab, HTM, Brandit and The Ocean Race. Brands and organisations Lorcán O'Neill has worked for and with.",
    og: "work",
    type: "CollectionPage",
    crumb: "Work",
  },
  studio: {
    path: "/studio",
    title: "The Possibilities Studio | Brand Concepts by Lorcán O'Neill",
    desc: "Four independent brand concepts by Lorcán O'Neill for fictional companies: WADDEN (maritime robotics), Kindling (small-business software), RUNE (premium audio) and FOLD (modular furniture).",
    og: "studio",
    type: "CollectionPage",
    crumb: "Studio",
  },
  "studio-wadden": {
    path: "/studio/wadden",
    title: "WADDEN: Maritime Robotics Brand Concept | Lorcán O'Neill",
    desc: "WADDEN, a fictional Dutch maritime robotics company that inspects dikes and flood defences. Identity, campaigns, brochure, exhibition stand and website by Lorcán O'Neill.",
    og: "studio-wadden",
    type: "WebPage",
    crumb: "WADDEN",
    parent: "studio",
  },
  "studio-kindling": {
    path: "/studio/kindling",
    title: "Kindling: Small-Business Software Brand Concept | Lorcán O'Neill",
    desc: "Kindling, fictional software that takes admin off small-business owners. Identity, advertising, newsletter, product interface and website by Lorcán O'Neill.",
    og: "studio-kindling",
    type: "WebPage",
    crumb: "Kindling",
    parent: "studio",
  },
  "studio-rune": {
    path: "/studio/rune",
    title: "RUNE: Premium Audio Brand Concept | Lorcán O'Neill",
    desc: "RUNE, a fictional premium audio brand. Identity, product campaigns, outdoor, packaging, editorial and website by Lorcán O'Neill.",
    og: "studio-rune",
    type: "WebPage",
    crumb: "RUNE",
    parent: "studio",
  },
  "studio-fold": {
    path: "/studio/fold",
    title: "FOLD: Modular Furniture Brand Concept | Lorcán O'Neill",
    desc: "FOLD, a fictional Dutch modular furniture company. Identity, catalogue, packaging, showroom, e-commerce and website by Lorcán O'Neill.",
    og: "studio-fold",
    type: "WebPage",
    crumb: "FOLD",
    parent: "studio",
  },
  thoughts: {
    path: "/thoughts",
    title: "Thoughts | Lorcán O'Neill on AI, Creativity & Business",
    desc: "Short notes from Lorcán O'Neill on technology, AI, creativity, business and everyday life, written the way he'd say them.",
    og: "thoughts",
    type: "CollectionPage",
    crumb: "Thoughts",
  },
  contact: {
    path: "/contact",
    title: "Contact Lorcán O'Neill | Say Hello",
    desc: "Got an idea, a project or just fancy saying hello? Email Lorcán O'Neill at lorcancreative@gmail.com. The inbox is open.",
    og: "contact",
    type: "ContactPage",
    crumb: "Contact",
  },
  lost: {
    path: "/404",
    title: "Page not found | Lorcán O'Neill",
    desc: "This page has wandered off. Head back to Lorcán O'Neill's homepage.",
    og: "home",
    noindex: true,
  },
};
const ORDER = ["home", "about", "experience", "work", "studio", "studio-wadden", "studio-kindling", "studio-rune", "studio-fold", "thoughts", "contact"];

// ---------------------------------------------------------------- source ---
const src = fs.readFileSync("src/index.html", "utf8");
const cut = (s, a, b, from = 0) => {
  const i = s.indexOf(a, from);
  const j = s.indexOf(b, i + a.length);
  if (i < 0 || j < 0) throw new Error("marker not found: " + a);
  return { i, j, inner: s.slice(i + a.length, j), end: j + b.length };
};

const st = cut(src, "<style>", "</style>");
let css = st.inner;
let rest = src.slice(st.end);
const MAIN_JS = "<script>\nif(!document.documentElement.lang)";
const jsc = cut(rest, MAIN_JS.slice(0, 8), "</script>", rest.indexOf(MAIN_JS));
let js = jsc.inner;
let body = rest.slice(0, jsc.i) + rest.slice(jsc.end);

// absolute asset paths (pages live at different depths)
const absImg = (s) => s.replace(/(["'\s,(])img\//g, "$1/img/");
body = absImg(body);
css = absImg(css);

// the posts, straight out of the script
const postsSrc = js.slice(js.indexOf("const POSTS=") + 12, js.indexOf("];\nconst TAGS") + 1);
const POSTS = new Function("return " + postsSrc)();
const TAGS = new Function("return " + js.slice(js.indexOf("const TAGS=") + 11, js.indexOf("];", js.indexOf("const TAGS=")) + 1))();
const published = POSTS.filter((p) => p.date);

// page titles used by the client router mirror the <title> tags
js = js.replace(/const TITLES=\{[^\n]*\};/, "const TITLES=" + JSON.stringify(Object.fromEntries(Object.entries(META).map(([k, v]) => [k, v.title]))) + ";");

// ------------------------------------------------------------------ pages ---
const mainOpen = '<main id="main" tabindex="-1">';
const m = cut(body, mainOpen, "</main>");
const chunks = m.inner.split(/(?=<!-- =+ [A-Z0-9 ]+ =+ -->)/).filter((c) => c.includes("data-page="));
const PAGES = {};
for (const c of chunks) PAGES[c.match(/data-page="([a-z-]+)"/)[1]] = c.trim();

const hrefFor = (k) => (k === "home" ? "/" : k.startsWith("post-") ? "/thoughts/" + k.slice(5) : k.startsWith("studio-") ? "/studio/" + k.slice(7) : "/" + k);
const linkify = (s) => s.replace(/href="#(home|about|experience|work|studio-wadden|studio-kindling|studio-rune|studio-fold|studio|thoughts|contact)"/g, (_, k) => `href="${hrefFor(k)}"`);
const show = (s) => s.replace(/(<div class="page[^"]*" data-page="[a-z-]+"(?: style="[^"]*")?) hidden>/, "$1>");
const hide = (s) => s.replace(/(<div class="page[^"]*" data-page="[a-z-]+"(?: style="[^"]*")?)>/, "$1 hidden>");
const lazy = (s) => s.replace(/ fetchpriority="high"/g, "").replace(/<img (?![^>]*loading=)/g, '<img loading="lazy" ');

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const attr = esc;
const arrow = '<svg aria-hidden="true"><use href="#i-arrow"/></svg>';
const fmtDate = (d) => new Date(d + "T12:00:00Z").toLocaleDateString("en-IE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

// Thoughts: list rendered on the server too (same markup the script produces)
function postCard(p) {
  return `<a class="post" href="/thoughts/${p.slug}"><span class="tag">${p.tag}</span><h3>${esc(p.title)}</h3><p>${esc(p.dek)}</p><span class="meta"><span>${p.read} min read</span><span class="go">Read ${arrow}</span></span></a>`;
}
function thoughtsList() {
  const cnt = (t) => (t === "All" ? POSTS.length : POSTS.filter((p) => p.tag === t).length);
  const filters = TAGS.map((t) => `<button class="filter" type="button" aria-pressed="${t === "All"}" data-tag="${t}">${t}<span class="fc">${cnt(t)}</span></button>`).join("");
  const list = POSTS.map((p, i) =>
    i === 0
      ? `<a class="post lead" href="/thoughts/${p.slug}"><div><span class="tag">${p.tag}</span><h3>${esc(p.title)}</h3><p>${esc(p.dek)}</p><span class="meta"><span>${p.read} min read</span><span class="go">Read ${arrow}</span></span></div><blockquote class="post-q">${esc(p.quote)}</blockquote></a>`
      : postCard(p)
  ).join("");
  return { filters, list };
}
function articleHTML(p) {
  const i = POSTS.indexOf(p), n = POSTS[(i + 1) % POSTS.length];
  return `<a class="back" href="/thoughts">${arrow} All thoughts</a>
   <h1>${esc(p.title)}</h1><p class="stand">${esc(p.dek)}</p>
   <p class="byline"><b>${NAME}</b>${p.date ? `<time datetime="${p.date}">${fmtDate(p.date)}</time>` : ""}<span>${p.tag}</span><span>${p.read} min read</span></p>
   <div class="body-copy">${p.body.map((x) => `<p>${esc(x)}</p>`).join("")}</div>
   <div class="next"><span class="label" style="margin-top:28px">Up next</span>${postCard(n)}</div>`;
}
const T = thoughtsList();
PAGES.thoughts = PAGES.thoughts
  .replace('<div class="filters" role="group" aria-label="Filter by topic" id="filters"></div>', () => `<div class="filters" role="group" aria-label="Filter by topic" id="filters">${T.filters}</div>`)
  .replace('<div class="posts" id="posts"></div>', () => `<div class="posts" id="posts">${T.list}</div>`);
for (const k in PAGES) PAGES[k] = linkify(PAGES[k]);
let shell = linkify(body);
// Easter eggs (the lights-out gag and The Other Room) arrive with the other pages,
// so crawlers see the page content, not hidden extras.
const EXTRAS = [];
for (const [a, b] of [['<div class="egg" id="egg"', '<a class="skip"'], ['<div class="room" id="room"', '<div class="wires-grid"']]) {
  const i = shell.indexOf(a), j = shell.indexOf(b, i);
  if (i < 0 || j < 0) throw new Error("extra not found: " + a);
  EXTRAS.push(shell.slice(i, j).trim());
  shell = shell.slice(0, i) + shell.slice(j);
}

// ----------------------------------------------------------------- assets ---
const hash = (s) => crypto.createHash("sha256").update(s).digest("hex").slice(0, 10);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "assets/fonts"), { recursive: true });
fs.mkdirSync(path.join(OUT, "thoughts"), { recursive: true });
fs.cpSync("img", path.join(OUT, "img"), { recursive: true });
fs.cpSync("og", path.join(OUT, "og"), { recursive: true });
if (fs.existsSync("media")) fs.cpSync("media", path.join(OUT, "media"), { recursive: true });
for (const f of fs.readdirSync("fonts")) fs.copyFileSync(path.join("fonts", f), path.join(OUT, "assets/fonts", f));
for (const f of ["favicon.svg", "icon-192.png", "apple-touch-icon.png"]) if (fs.existsSync(path.join("static", f))) fs.copyFileSync(path.join("static", f), path.join(OUT, f));

const LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const LATIN_EXT = "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF";
const face = (fam, style, file, range, wght) =>
  `@font-face{font-family:"${fam}";font-style:${style};font-weight:${wght};font-display:swap;src:url(/assets/fonts/${file}.woff2) format("woff2");unicode-range:${range}}`;
const fonts = [
  face("Bricolage Grotesque", "normal", "bricolage-latin", LATIN, "200 800"),
  face("Bricolage Grotesque", "normal", "bricolage-latin-ext", LATIN_EXT, "200 800"),
  face("Fraunces", "italic", "fraunces-latin-italic", LATIN, "100 900"),
  face("Fraunces", "italic", "fraunces-latin-ext-italic", LATIN_EXT, "100 900"),
  face("Fraunces", "normal", "fraunces-latin-normal", LATIN, "100 900"),
  face("Fraunces", "normal", "fraunces-latin-ext-normal", LATIN_EXT, "100 900"),
].join("\n");
const cssOut = fonts + "\n" + css.trim() + "\n";
const cssFile = `site.${hash(cssOut)}.css`;
fs.writeFileSync(path.join(OUT, "assets", cssFile), cssOut);
const jsFile = `site.${hash(js)}.js`;
fs.writeFileSync(path.join(OUT, "assets", jsFile), js.trim() + "\n");
// every page, for instant in-site navigation (not for search engines)
const allPages = Object.entries(PAGES).map(([, v]) => lazy(hide(v))).join("\n") + "\n" + EXTRAS.map(lazy).join("\n");
const pagesFile = `pages.${hash(allPages)}.html`;
fs.writeFileSync(path.join(OUT, "assets", pagesFile), allPages + "\n");

// ------------------------------------------------------- structured data ---
const PERSON_ID = SITE + "/#person", SITE_ID = SITE + "/#website";
const person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: NAME,
  alternateName: ["Lorcan O'Neill", "Lor"],
  givenName: "Lorcán",
  familyName: "O'Neill",
  url: SITE + "/",
  mainEntityOfPage: SITE + "/about",
  image: { "@type": "ImageObject", url: SITE + "/img/tablet-bust.webp", width: 700, height: 860, caption: "Illustration of Lorcán O'Neill" },
  email: "mailto:" + EMAIL,
  description: "Irish creative and commercial professional from Dublin with over 13 years across design, communications, business and technology, including nearly nine years living and working in the Netherlands. Author of eight books. Currently works on the commercial side of Arkintel, a Dutch AI technology company.",
  nationality: { "@type": "Country", name: "Ireland" },
  homeLocation: { "@type": "Country", name: "Ireland" },
  worksFor: { "@type": "Organization", name: "Arkintel", description: "Dutch technology company working in AI", address: { "@type": "PostalAddress", addressCountry: "NL" } },
  knowsAbout: ["Design", "Communications", "Creative direction", "Business development", "Artificial intelligence", "Web development", "Writing"],
};
const website = { "@type": "WebSite", "@id": SITE_ID, url: SITE + "/", name: NAME, alternateName: ["Lor", "lorcan.space"], description: META.home.desc, inLanguage: "en", publisher: { "@id": PERSON_ID }, author: { "@id": PERSON_ID } };
function graph(key, url, extra = {}, crumbs = []) {
  const M = META[key] || {};
  const page = {
    "@type": extra.type || M.type || "WebPage",
    "@id": url + "#webpage",
    url,
    name: extra.title || M.title,
    description: extra.desc || M.desc,
    inLanguage: "en",
    isPartOf: { "@id": SITE_ID },
    about: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
    primaryImageOfPage: { "@type": "ImageObject", url: SITE + "/og/" + (extra.og || M.og) + ".jpg", width: 1200, height: 630 },
  };
  if (page["@type"] === "ProfilePage") page.mainEntity = { "@id": PERSON_ID };
  if (key === "work") {
    page.mainEntity = {
      "@type": "ItemList",
      name: "Brands and organisations Lorcán O'Neill has worked for and with",
      itemListElement: ["Arkintel", "Heineken", "Formula 1", "UEFA", "Just Eat", "ATPI", "Savvy Lab", "HTM", "Brandit", "The Ocean Race"].map((n, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "Organization", name: n } })),
    };
  }
  const g = [page, website, person];
  if (crumbs.length) {
    const list = [{ name: "Home", url: SITE + "/" }, ...crumbs];
    page.breadcrumb = { "@id": url + "#breadcrumb" };
    g.push({ "@type": "BreadcrumbList", "@id": url + "#breadcrumb", itemListElement: list.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url })) });
  }
  if (extra.article) g.push(extra.article);
  return JSON.stringify({ "@context": "https://schema.org", "@graph": g }).replace(/</g, "\\u003c");
}

// ------------------------------------------------------------------- head ---
function head({ title, desc, url, og, noindex, type = "website", jsonld, preloadImg, articleMeta = "" }) {
  const img = SITE + "/og/" + og + ".jpg";
  return `<!doctype html>
<html lang="en" data-mpa>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${attr(desc)}">
${url ? `<link rel="canonical" href="${url}">\n` : ""}<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}">
<meta name="author" content="${NAME}">
<meta name="theme-color" content="#090909">
<meta name="color-scheme" content="dark">
<meta property="og:site_name" content="${NAME}">
<meta property="og:locale" content="en_IE">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(desc)}">
${url ? `<meta property="og:url" content="${url}">\n` : ""}<meta property="og:image" content="${img}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${attr(NAME)}, illustrated, on a dark background with orange accents">
${articleMeta}<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${attr(title)}">
<meta name="twitter:description" content="${attr(desc)}">
<meta name="twitter:image" content="${img}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/bricolage-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/fraunces-latin-italic.woff2" as="font" type="font/woff2" crossorigin>
${preloadImg ? `<link rel="preload" as="image" href="${preloadImg}" imagesrcset="/img/tablet-bust-460.webp 460w, /img/tablet-bust.webp 700w" imagesizes="(min-width:1024px) 566px, (min-width:768px) 340px, 56vw" fetchpriority="high">\n` : ""}<link rel="stylesheet" href="/assets/${cssFile}">
${jsonld ? `<script type="application/ld+json">${jsonld}</script>\n` : ""}</head>
<body>`;
}
const loader = `<script>(function(){var go=function(){var s=document.createElement("script");s.src="/assets/${jsFile}";document.body.appendChild(s)};
try{fetch("/assets/${pagesFile}").then(function(r){return r.ok?r.text():""}).then(function(t){if(t){var m=document.getElementById("main"),tp=document.createElement("template");tp.innerHTML=t;[].slice.call(tp.content.children).forEach(function(p){var k=p.getAttribute("data-page");if(!k)document.body.insertBefore(p,document.querySelector(p.id==="room"?".wires-grid":".skip"));else if(!m.querySelector('[data-page="'+k+'"]'))m.appendChild(p)})}}).catch(function(){}).then(go)}catch(e){go()}})();</script>
</body>
</html>
`;
const sm = cut(shell, mainOpen, "</main>");
function page(key, mainHTML, h) {
  const b = shell.slice(0, sm.i + mainOpen.length) + "\n" + mainHTML + "\n" + shell.slice(sm.j);
  return head(h) + "\n" + b.trim() + "\n" + loader;
}

// ------------------------------------------------------------------ write ---
const written = {};
const anyPublished = published.length > 0;
for (const key of ORDER) {
  const M = META[key];
  const url = SITE + M.path;
  const noindex = key === "thoughts" && !anyPublished; // drafts only: keep it out of search for now
  const crumbs = M.crumb ? [...(M.parent ? [{ name: META[M.parent].crumb, url: SITE + META[M.parent].path }] : []), { name: M.crumb, url }] : [];
  let html = show(PAGES[key]);
  const out = key === "home" ? "index.html" : M.path.slice(1) + ".html";
  fs.mkdirSync(path.dirname(path.join(OUT, out)), { recursive: true });
  fs.writeFileSync(path.join(OUT, out), page(key, html, { title: M.title, desc: M.desc, url, og: M.og, noindex, type: key === "about" ? "profile" : "website", jsonld: graph(key, url, {}, crumbs), preloadImg: key === "home" ? "/img/tablet-bust.webp" : null }));
  written[key] = { url, noindex, html };
}
for (const p of POSTS) {
  const url = SITE + "/thoughts/" + p.slug;
  const title = `${p.title} | ${NAME}`;
  const html = show(PAGES.post).replace('<article class="article" id="article"></article>', () => `<article class="article" id="article">${articleHTML(p)}</article>`);
  const crumbs = [{ name: "Thoughts", url: SITE + "/thoughts" }, { name: p.title, url }];
  const article = p.date
    ? {
        "@type": "BlogPosting",
        "@id": url + "#article",
        headline: p.title,
        description: p.dek,
        datePublished: p.date,
        dateModified: p.updated || p.date,
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
        mainEntityOfPage: { "@id": url + "#webpage" },
        image: SITE + "/og/thoughts.jpg",
        inLanguage: "en",
        articleSection: p.tag,
        wordCount: p.body.join(" ").split(/\s+/).length,
      }
    : null;
  const articleMeta = p.date ? `<meta property="article:published_time" content="${p.date}">\n<meta property="article:author" content="${SITE}/about">\n<meta property="article:section" content="${p.tag}">\n` : "";
  fs.writeFileSync(
    path.join(OUT, "thoughts", p.slug + ".html"),
    page("post", html, { title, desc: p.dek, url, og: "thoughts", noindex: !p.date, type: p.date ? "article" : "website", jsonld: graph("thoughts", url, { type: "WebPage", title, desc: p.dek, og: "thoughts", article }, crumbs), articleMeta })
  );
  written["post-" + p.slug] = { url, noindex: !p.date, html };
}
fs.writeFileSync(path.join(OUT, "404.html"), page("lost", show(PAGES.lost), { title: META.lost.title, desc: META.lost.desc, url: null, og: "home", noindex: true }));

// ----------------------------------------------------------- sitemap etc ---
const lmFile = "seo/lastmod.json";
const lastmod = fs.existsSync(lmFile) ? JSON.parse(fs.readFileSync(lmFile, "utf8")) : {};
const today = new Date().toISOString().slice(0, 10);
const urls = [];
for (const [k, w] of Object.entries(written)) {
  if (w.noindex) continue;
  const h = hash(w.html);
  if (!lastmod[k] || lastmod[k].hash !== h) lastmod[k] = { hash: h, date: today };
  const post = k.startsWith("post-") && POSTS.find((p) => "post-" + p.slug === k);
  urls.push({ loc: w.url, lastmod: post ? post.updated || post.date : lastmod[k].date });
}
fs.mkdirSync("seo", { recursive: true });
fs.writeFileSync(lmFile, JSON.stringify(lastmod, null, 2) + "\n");
fs.writeFileSync(
  path.join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join("\n")}\n</urlset>\n`
);
fs.writeFileSync(
  path.join(OUT, "robots.txt"),
  `# Search engines and AI assistants are welcome.
User-agent: *
Allow: /
# Navigation helper used by the site's own script, not a page
Disallow: /assets/pages.

Sitemap: ${SITE}/sitemap.xml
`
);
const pubList = published.length ? published.map((p) => `- [${p.title}](${SITE}/thoughts/${p.slug}) (${p.date}): ${p.dek}`).join("\n") : "- Nothing published yet.";
fs.writeFileSync(
  path.join(OUT, "llms.txt"),
  `# ${NAME}

> Personal website of ${NAME} (also Lorcan O'Neill, or Lor): an Irish creative and commercial professional from Dublin who spent nearly nine years living and working in the Netherlands.

- Works on the commercial side of Arkintel, a Dutch technology company in AI.
- Over 13 years across design, communications, business and technology.
- Has written eight books, built apps and websites, and made music videos.
- Brands and organisations he has worked for and with: Arkintel, Heineken, Formula 1, UEFA, Just Eat, ATPI, Savvy Lab, HTM, Brandit, The Ocean Race. The site does not describe individual projects for these brands.
- Contact: ${EMAIL}

## Pages
- [Home](${SITE}/): introduction
- [About](${SITE}/about): his background in his own words
- [Experience](${SITE}/experience): design, communications, business and technology, and his current role at Arkintel
- [Work](${SITE}/work): the brands and organisations above
- [The Possibilities Studio](${SITE}/studio): four independent brand concepts for fictional companies, clearly labelled as concepts, not client commissions: WADDEN (maritime robotics that inspect dikes, ${SITE}/studio/wadden), Kindling (small-business admin software, ${SITE}/studio/kindling), RUNE (premium audio, ${SITE}/studio/rune) and FOLD (Dutch modular furniture, ${SITE}/studio/fold). Identity, campaigns, stationery, brochures, social, exhibition and website work.
- [Thoughts](${SITE}/thoughts): short notes on technology, AI, creativity and business
- [Contact](${SITE}/contact): email

## Published writing
${pubList}
`
);
console.log(`Built ${Object.keys(written).length + 1} pages · ${urls.length} in sitemap · ${cssFile} · ${jsFile} · ${pagesFile}`);
