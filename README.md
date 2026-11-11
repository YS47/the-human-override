# The Human Override

A 39:54 university presentation on AI-assisted command, autonomous weapons, research on unsafe agent behavior, and human responsibility. It has 48 scenes across three phases and a final reflection, with 86 manually advanced visual beats. Optional audience discussion questions are available in the final speaker notes.

[Open the presentation](https://ys47.github.io/the-human-override/)

## Run it

Use Node.js 24.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. Click the stage or press Space to advance. The project uses the `/the-human-override/` base path in development and on GitHub Pages. Existing numbered links keep their original destinations. New scenes have named links such as `#scene-bench-test.1`.

| Control | Action |
| --- | --- |
| Space, →, or stage click | Next beat |
| ← | Previous beat |
| F | Toggle fullscreen |
| G | Open the scene navigator |
| N | Open speaker notes and planned scene timing |
| I | Inspect evidence, switch images, zoom and drag to pan |
| C | Show or hide presenter controls and the chapter rail |
| M | Mute or unmute audio |
| B | Black out or restore the current beat |
| ? | Open keyboard help |
| Escape | Close the overlay, restore from blackout, or exit fullscreen |

Notes open over the stage on the same screen. GitHub Pages serves the diagrams, photos, fonts, research figures and two silent Robocurve excerpts. Use the video controls to play an excerpt. Blackout and presenter panels pause it. The optional Democracy Now! interview and publication links use external websites. Audio cues begin muted.

## Edit content

- [src/scenes.ts](src/scenes.ts) defines the scene order, chapters, evidence, timing, transitions, audience text and presenter notes.
- [src/main.tsx](src/main.tsx) handles the flattened timeline, input, browser history, fullscreen and sound.
- [src/Stage.tsx](src/Stage.tsx) renders photographs, source references, classroom diagrams and study figures.
- [src/evidence.ts](src/evidence.ts) is the claim-by-claim register used by the stage and evidence inspector.
- [src/media.ts](src/media.ts) is the photo and interview manifest. [research/media-notes.md](research/media-notes.md) records the figure assignments, source decisions and missing files.
- [src/style.css](src/style.css) defines the four palettes, transitions, type and layout.
- [research/lavender-original.txt](research/lavender-original.txt) preserves the supplied raw Lavender passage. The presentation itself uses the evidence register for its public account.

## Build and test

```sh
npm run build
npx playwright install chromium
npm test
```

The build rejects CSS gradient functions in authored styles. The browser suite tests the production preview under the Pages subpath. Set `PRESENTATION_URL` to the public URL with a trailing slash to run the same tests against a deployment.

## Publish

Set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. The [Pages workflow](.github/workflows/pages.yml) builds on pushes to `main` and supports manual dispatch. It uploads only `dist/` and deploys via the `github-pages` environment.
