# Rats Collective website

Three static pages, ready for GitHub Pages. The background is pure white. The original uploaded logo is retained as a PNG; assets/rat.svg is a simplified vector recreation used as the favicon. No build or backend is required.

## Publish on GitHub Pages

1. Create a public GitHub repository (for example `rats-collective`). Upload the contents of this folder to its root, including the `artists`, `contact`, and `assets` folders, `CNAME` and `.nojekyll`.
2. In repository Settings → Pages, choose “Deploy from a branch”, then `main` and `/ (root)`.
3. In your GitHub account's Pages settings, verify ownership of `ratscollective.com` using the TXT record GitHub provides.
4. In repository Settings → Pages, set the custom domain to `ratscollective.com` before updating DNS.
5. At your domain provider, point the apex (`@`) to GitHub using these four A records:

   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153

6. Add a `www` CNAME pointing to `jonatanxp.github.io` (the GitHub account hostname, without a repository path).
7. Preserve email-related MX and TXT records so your existing email continues working. Replace only conflicting website A/AAAA/CNAME records as appropriate.
8. After GitHub's DNS check and certificate provisioning finish, enable “Enforce HTTPS”. Test all three pages and send a test inquiry using your email client.

Official guide: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## Discovery

All business copy and contact links are readable in plain HTML, without JavaScript. The site includes individual page titles and descriptions, canonical URLs, Organization JSON-LD with Instagram, robots.txt, sitemap.xml and a short llms.txt summary. Submit the sitemap in Google Search Console after launch. These make the content accessible to crawlers; they cannot guarantee indexing, AI recommendations or inquiries. llms.txt is a supplemental convention, not a guarantee that any crawler uses it.

The content accurately describes a network of around 20 accounts and exploratory artist management conversations. It does not disclose individual accounts or invent a roster, results, clients, or guarantees. Hidden keyword stuffing is intentionally absent.

## Contact and motion

Email links open the visitor's mail app with optional inquiry prompts; there is no form submission service. The homepage logo moves away from a mouse pointer inside its yellow strip, has a pause button, and starts paused for reduced-motion preferences. On touch devices it moves without requiring hover.

## Editing

- Home: index.html
- Artist inquiries: artists/index.html
- Contact: contact/index.html
- Design: style.css
- Logo movement: script.js

Typography uses Google Fonts with system fallbacks. If Google Fonts is unavailable, the fallback typefaces can alter line wrapping. Hosting the fonts locally is an optional later improvement.

## Verification

JavaScript syntax and local page/asset references were checked. The preview server started, but its HTTP response could not be verified. The in-app browser could not reach the local preview, so visual rendering and pointer behavior have not been browser-verified. No live deployment or domain DNS changes have been made.


