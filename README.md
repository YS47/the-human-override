# The Human Override

A 37:45 university presentation on AI-assisted command, autonomous weapons, research on unsafe agent behavior, and human responsibility. The deck has nine scenes, a final reflection, and an optional ten-question audience discussion.

## Run it

Use Node.js 24.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. The project uses the `/the-human-override/` base path in development and on GitHub Pages. Scene links such as `#scene-3.1` open directly without server routing.

| Control | Action |
| --- | --- |
| Right, down, Page Down or Space | Next scene |
| Left, up or Page Up | Previous scene |
| N | Open notes |
| F | Toggle fullscreen where supported |
| Escape | Close the open panel |
| Chapters | Jump to a scene, open Q&A, or toggle condensed rehearsal |

Notes and timers appear on the same screen as the presentation. Use them while rehearsing or between projected scenes. The web version and its bundled presenter notes are public. The audience deck, diagrams, photos, fonts and research figures are served by GitHub Pages. The interview player and source links use external websites.

## Edit content

- [src/scenes.ts](src/scenes.ts) defines scene order, audience text, timings, presenter cues and discussion questions.
- [src/Explainers.tsx](src/Explainers.tsx) contains the classroom examples and study visualizations.
- [src/evidence.ts](src/evidence.ts) is the claim-by-claim evidence register used by the on-screen Evidence panels.
- [src/media.ts](src/media.ts) is the photo and interview manifest. [research/media-notes.md](research/media-notes.md) records the figure assignments, source decisions and missing files.
- [src/style.css](src/style.css) defines the four palettes, transitions, type and layout.
- [research/lavender-original.txt](research/lavender-original.txt) preserves the supplied raw Lavender passage. The presentation itself uses the evidence register for its public account.

## Build and test

```sh
npm run build
npx playwright install chromium
npm test
```

The browser suite tests the production preview under the Pages subpath. Set `PRESENTATION_URL` to the public URL with a trailing slash to run the same tests against a deployment.

## Publish

Set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. The [Pages workflow](.github/workflows/pages.yml) builds on pushes to `main` and supports manual dispatch. It uploads only `dist/` and deploys via the `github-pages` environment.
