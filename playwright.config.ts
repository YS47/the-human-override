import { defineConfig } from '@playwright/test'

const baseURL = 'http://127.0.0.1:4173/the-human-override/'
const deployed = process.env.PRESENTATION_URL

export default defineConfig({
  testDir: './tests',
  use: { baseURL: deployed || baseURL, viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' },
  webServer: deployed ? undefined : {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
})
