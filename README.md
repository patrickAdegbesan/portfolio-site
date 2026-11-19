# mr-path.site

Portfolio of Patrick Adegbesan. Plain HTML and one CSS file: no build step, no JavaScript, no
framework. Hosted on GitHub Pages from `main`, with the custom domain in `CNAME`.

The design system (colours, type, layout, motion, honesty rules) is in [DESIGN.md](DESIGN.md).
Read it before changing how anything looks.

## Files

```
index.html            Home: hero, selected work, services, short about
work.html             All work: case studies, other work, hackathons, earlier projects
work/*.html           One case study per project
services.html         Freelance services with scope and limits
about.html            Background, skills with evidence, how I work, certificates
contact.html          Contact details (no form)
404.html              GitHub Pages serves this for missing pages
resume.html           Redirects old links to about.html
assets/css/site.css   All styles
assets/fonts/         Archivo variable font (self-hosted, SIL OFL)
assets/img/           WebP screenshots, portrait, og.png (social preview, 1200×630)
asset/                Certificate PDFs and an old resume PDF (not linked)
sitemap.xml, robots.txt
ea-claude-9f4c2a1b.html  Unlisted application page (noindex); left as it was
```

`img/` holds the old site's images and videos (about 450 MB). Nothing links to them any more,
so they can be deleted in a separate commit.

## Preview locally

```bash
python3 -m http.server 8000
# open http://127.0.0.1:8000/
```

Links are root-relative (`/work.html`), so open the site through a server, not by double-clicking files.

## Deploy

1. Check every placeholder has been confirmed: `grep -rn data-confirm --include=*.html .`
   The attribute can stay in the HTML (it does nothing visible), but the text it marks must be true.
2. Commit and push to `main`. GitHub Pages publishes in a minute or two.
3. Check https://mr-path.site/, a case study, and an unknown URL (should show the 404 page).
4. Paste https://mr-path.site/ into the LinkedIn Post Inspector to refresh the link preview.

## Add a project

**To the archive only:** add a row to the right table in `work.html`. Give every `<td>` a
`data-label` (it becomes the label on phones).

**As a case study:**

1. Copy `work/skillgraph.html` to `work/<name>.html`.
2. Update `<title>`, `meta description`, `canonical` and `og:` tags.
3. Fill in the head block: one-line description, **Condition** (the constraint the project had to
   survive), and the credits list: Engagement, My part, Status, Stack, Links.
   Be exact about your part and the status.
4. Screenshots: export PNGs, then
   `magick shot.png -resize 1200x -strip -quality 80 assets/img/<name>-1200.webp` (plus a 720 or
   360 version for `srcset`). Always set `width` and `height`, and write alt text and a caption
   that says if the data is test or demo data. Never show real customer data, bank details or keys.
5. Body sections: The problem, What I built, The hard part, Where it stands.
6. Link it from `work.html`, and from the home page if it replaces a selected project.
   Update the previous/next links at the bottom of the neighbouring case studies.
7. Add the URL to `sitemap.xml`.
