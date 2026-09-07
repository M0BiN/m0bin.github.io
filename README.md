# Mobin Tirafkan — GitHub Pages resume

A plain, responsive resume with a gallery of SelfMeter Mini App and report screenshots. Static HTML/CSS; no build step or external fonts/scripts.

## Upload

1. Extract the ZIP.
2. Open **M0BiN/m0bin.github.io** on GitHub, on the `main` branch, and choose **Add file → Upload files**.
3. Upload `index.html`, `style.css`, and the entire `assets` folder to the repository root, preserving the folders. Upload the extracted files, not the ZIP.
4. Commit. The existing GitHub Pages deployment will publish the update. If Pages is not configured, select `main` and `/ (root)` in **Settings → Pages**.
5. Open https://m0bin.github.io/ after deployment. Check the screenshots and PDF download; hard-refresh if your browser shows a cached version.

`README.md` and `scripts/` are optional for hosting. Preserve any unrelated repository files. Old root-level JPGs and the earlier light-mode gallery are no longer used by this page.

## Content

Experience, education, research, and skills are based on the supplied `Mobin_Tirafkan_Resume_International_3.pdf`. The downloadable PDF is an unchanged copy. Additional projects and contact links come from the supplied HTML/existing page.

Dima’s “More about Dima” link points to the owner-provided Cafe Bazaar listing: https://cafebazaar.ir/app/com.bmelat.mobile?l=en . SelfMeter's source-code link is omitted from the resume. Its section emphasizes AI-powered self-discovery and the LLM interpretation pipeline.

## Dima production status and scale

The resume separates Mobin's contribution to the LLM-powered banking assistant from the wider Dima platform's user count. Bank Mellat's public-relations announcement, published by ILNA on 9 Tir 1405 (June 2026), reports over 2.75 million platform users:

https://www.ilna.ir/بخش-تولید-تجارت-خدمات-32/1806643-استقبال-از-دیما-شتاب-گرفت-عبور-تعداد-کاربران-از-میلیون-هزار-نفر

This is a reported platform-wide user count, not daily active users, concurrent users, or users of the AI assistant. No reliable public DAU or assistant-specific usage figure was found, so none is claimed. The figure is dated rather than presented as a current measurement. Production status is supported by the owner's statement and public announcements of the service's availability, including Bank Mellat's launch announcement republished by Tasnim: https://www.tasnimnews.ir/fa/news/1404/08/27/3450931 . No uptime, throughput, conversion, or revenue claims are added.

## Screenshots and branding

Captured on 7 September 2026. The page introduces the official https://selfmeter.ir/ website, followed by a large AI interpretation gallery. Additional dark-mode Mini App screens are expandable. On mobile, galleries scroll horizontally; every image opens at a larger size with previous/next controls.

`assets/selfmeter/website/homepage.png` is a live browser capture of https://selfmeter.ir/ at 2880 × 1800. `website/insight-demo.png` captures the public illustrative interpretation demo on that same website at 2400 × 974.

All thirteen images in `assets/selfmeter/dark/` capture the actual production frontend at 390 × 780 CSS pixels with 2× pixel density (780 × 1560 PNGs), using its native dark theme. No UI was redrawn or generated.

| File | Screen | Data source |
| --- | --- | --- |
| `ai-report.png` | Full AI interpretation | Actual report UI with illustrative sample text |
| `ai-summary.png` | Summary and personality traits | Same illustrative sample payload |
| `ai-analysis.png` | Thinking and decisions | Same illustrative sample payload |
| `ai-guidance.png` | Practical guidance | Same illustrative sample payload |
| `profile.png` | Personal profile | Existing sample-account preview harness |
| `catalog.png` | Assessment catalog | Current active catalog definitions |
| `welcome.png` | Welcome/onboarding | Actual PolicyGate interface; local preview session |
| `mbti-intro.png` | MBTI introduction | Current serialized MBTI v3 definition |
| `mbti-question.png` | MBTI question | Current serialized MBTI v3 definition |
| `mbti-report.png` | MBTI report | Built-in report preview with sample INFJ result |
| `holland-intro.png` | Holland introduction | Current serialized Holland v5 definition |
| `holland-question.png` | Holland question | Current serialized Holland v5 definition |
| `holland-report.png` | Holland report | Built-in report preview with sample result |

The production frontends were served locally in Chromium with a simulated Telegram environment. Profile/account values and reports use sample data, as labeled on the resume. Test definitions and catalog metadata were read without modifying production data. No private profile or report was accessed, and no result was submitted. AI text is illustrative, not claimed output from an actual model run; no paid generation was triggered. The conventional report viewer uses its built-in nighttime dark theme.

Capture source directories on the server:

- `/opt/apps/selfmeter-server/frontend/telegram-ui/build`
- `/opt/apps/selfmeter-server/frontend/report-ui/build`

The existing preview harness is `/opt/apps/selfmeter-profile-v2/frontend/telegram-ui/scripts/profile-design-smoke.cjs`. Capture scripts (`dark-refresh.cjs`, `reports-dark.cjs`), sample payload, and definition snapshots are in `/tmp/mobin-miniapp-capture/` on the server; these temporary files are not needed for hosting or included in the ZIP.

`assets/brands/selfmeter.svg` is SelfMeter's own favicon from `frontend/homepage/favicon.svg`. `assets/brands/dima-assistant.svg` is a simple, custom banking-assistant icon, not an official Dima logo. Both appear decoratively beside the product names.

## Preview and check

Run `python3 -m http.server 8000 --bind 127.0.0.1` in this folder, then open http://127.0.0.1:8000/.

With an existing Playwright installation:

```sh
PLAYWRIGHT_MODULE=/absolute/path/to/playwright node scripts/smoke.cjs
```

Optionally set `CHROMIUM_PATH` and `SCREENSHOT_DIR`. The check covers four viewport widths, image loading, horizontal overflow, resume content, keyboard image opening, focus restoration, previous/next navigation and wrapping, closing, the expandable gallery, official SelfMeter and Dima links, native mobile gallery scrolling, full-resolution image dimensions, PDF downloads, and direct image links with JavaScript disabled.
