import { expect, test, type Page } from '@playwright/test'
import { timeline } from '../src/scenes'

const stage = (page: Page) => page.getByRole('main')
const position = (page: Page) => page.locator('.presentation')

async function at(page: Page, scene: number, beat: number) {
  await expect(position(page)).toHaveAttribute('data-scene', String(scene))
  await expect(position(page)).toHaveAttribute('data-beat', String(beat))
}

async function next(page: Page) {
  await page.waitForTimeout(250)
  await page.keyboard.press('ArrowRight')
}

test('the opening reveals one beat per advance and leaves the vote open', async ({ page }) => {
  await page.goto('./')
  await expect(stage(page).getByRole('heading')).toHaveText('Two armies. The same weapons. The same resources. One advantage.')
  await expect(stage(page).getByText('Base A', { exact: true })).toHaveCount(0)
  await page.keyboard.press('Space')
  await at(page, 1, 2)
  await expect(stage(page).getByText('Base A', { exact: true })).toBeVisible()
  await expect(stage(page).getByText('Base B', { exact: true })).toBeVisible()
  await next(page)
  await expect(stage(page).getByRole('heading')).toHaveText('One uses AI-assisted command systems.')
  await next(page)
  await expect(stage(page).getByRole('heading')).toHaveText('Which one wins?')
  await page.waitForTimeout(800)
  await at(page, 1, 4)
  await page.keyboard.press('ArrowLeft')
  await at(page, 1, 3)
  await expect(stage(page).getByRole('heading')).toHaveText('One uses AI-assisted command systems.')
  await page.goBack()
  await at(page, 1, 4)
})

test('filters rapid clicks and held keys and permits a deliberate reversal', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('./')
  await stage(page).dblclick({ position: { x: 5, y: 5 }, delay: 30 })
  await at(page, 1, 2)
  await page.keyboard.press('ArrowRight')
  await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', repeat: true })))
  await at(page, 1, 2)
  await page.keyboard.press('ArrowLeft')
  await at(page, 1, 1)
  await page.waitForTimeout(720)
  await at(page, 1, 1)
})

test('navigator jumps to any scene and the chapter rail returns to earlier chapters', async ({ page }) => {
  await page.goto('./')
  await expect(stage(page)).toBeFocused()
  await page.keyboard.press('g')
  const dialog = page.getByRole('dialog', { name: 'Scene navigator' })
  await expect(dialog.getByRole('button')).toHaveCount(49)
  await dialog.getByRole('button', { name: /23 The Lavender investigation/ }).click()
  await at(page, 23, 1)
  await page.getByRole('navigation', { name: 'Chapters' }).getByRole('button', { name: 'Two armies, one battlefield' }).click()
  await at(page, 1, 1)
  await expect(dialog).toHaveCount(0)
})

test('deep links restore individual beats and legacy aliases', async ({ page }) => {
  await page.goto('./#scene-30.2')
  await at(page, 32, 2)
  await expect(stage(page).getByRole('heading')).toHaveText('Blurred input')
  await page.reload()
  await at(page, 32, 2)
  await page.goto('./#scene-1.1-find')
  await at(page, 3, 1)
  await expect(stage(page).getByRole('heading')).toHaveText('Find')
  await page.goto('./#scene-reflection')
  await at(page, 48, 1)
  await expect(page.getByRole('button', { name: 'Next beat' })).toBeDisabled()
})

test('notes follow the beat and overlays and controls preserve position', async ({ page }) => {
  await page.goto('./#scene-01.4')
  await expect(stage(page)).toBeFocused()
  await page.keyboard.press('n')
  const notes = page.getByRole('dialog', { name: 'Speaker notes' })
  await expect(notes.getByText('Pause for audience answers.')).toBeVisible()
  await expect(notes.getByText(/Scene 01 · Beat 4/)).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await at(page, 1, 4)
  await page.keyboard.press('Escape')
  await expect(notes).toHaveCount(0)
  await page.keyboard.press('c')
  await expect(page.getByRole('navigation', { name: 'Presenter controls' })).toHaveCount(0)
  await page.keyboard.press('c')
  await page.keyboard.press('?')
  await expect(page.getByRole('dialog', { name: 'Keyboard controls' })).toBeVisible()
  await at(page, 1, 4)
})

test('the inspector zooms, pans, steps images and closes without moving the deck', async ({ page }) => {
  await page.goto('./#scene-01.2')
  await expect(stage(page)).toBeFocused()
  await page.keyboard.press('i')
  const dialog = page.getByRole('dialog', { name: 'Evidence inspector' })
  const photo = dialog.getByRole('img')
  await expect(photo).toHaveAttribute('src', /war-title\.png$/)
  await dialog.getByRole('button', { name: 'Next image' }).click()
  await expect(photo).toHaveAttribute('src', /kill-chain\.png$/)
  await dialog.getByRole('button', { name: 'Zoom in' }).click()
  await expect(dialog.getByText('150%')).toBeVisible()
  const viewport = dialog.getByLabel('Evidence image viewport')
  const box = (await viewport.boundingBox())!
  await page.mouse.move(box.x + box.width * .7, box.y + 65)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width * .4, box.y + 55, { steps: 5 })
  await page.mouse.up()
  expect(await viewport.evaluate(element => element.scrollLeft)).toBeGreaterThan(0)
  await page.keyboard.press('Escape')
  await at(page, 1, 2)
  await expect(dialog).toHaveCount(0)
})

test('blackout preserves the beat and fullscreen toggles at projector resolution', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto('./#scene-10.2')
  await page.getByRole('button', { name: 'Fullscreen', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Exit fullscreen' })).toBeVisible()
  await page.keyboard.press('b')
  await expect(page.getByRole('button', { name: 'Restore presentation' })).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await at(page, 10, 2)
  await page.keyboard.press('b')
  await expect(stage(page).getByRole('heading')).toHaveText('What is it trying to connect?')
  await page.getByRole('button', { name: 'Exit fullscreen' }).click()
  await expect(page.getByRole('button', { name: 'Fullscreen', exact: true })).toBeVisible()
})

test('audio cues play only when unmuted', async ({ page }) => {
  await page.addInitScript(() => {
    const count = { cues: 0 }
    Object.assign(window, { presentationTestAudio: count })
    const start = OscillatorNode.prototype.start
    OscillatorNode.prototype.start = function (when) { count.cues += 1; start.call(this, when) }
  })
  const cues = () => page.evaluate(() => (window as Window & { presentationTestAudio?: { cues: number } }).presentationTestAudio!.cues)
  await page.goto('./#scene-16.2')
  await expect(page.getByRole('button', { name: 'Unmute audio' })).toBeVisible()
  await page.keyboard.press('m')
  await expect(page.getByRole('button', { name: 'Mute audio' })).toBeVisible()
  await next(page)
  await at(page, 18, 1)
  await expect.poll(cues).toBe(1)
  await page.keyboard.press('m')
  await page.keyboard.press('ArrowLeft')
  await next(page)
  await at(page, 18, 1)
  expect(await cues()).toBe(1)
})

test('a missing photo and an unavailable video preserve evidence links and navigation', async ({ page }) => {
  await page.route('**/media/ngc2.webp', route => route.abort())
  await page.route('**/democracynow.org/embed/story/**', route => route.abort())
  await page.goto('./#scene-10.1')
  await expect(stage(page).getByRole('status')).toContainText('Image unavailable')
  await expect(stage(page).getByRole('link', { name: /NGC2 field training/ })).toHaveAttribute('href', /army\.mil/)
  await next(page)
  await at(page, 10, 2)
  await page.goto('./#scene-22.1')
  await at(page, 23, 1)
  await page.keyboard.press('i')
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: 'Load interview player' }).click()
  await expect(dialog.getByRole('link', { name: /Open the original interview/ })).toHaveAttribute('href', /democracynow\.org/)
  await dialog.getByRole('button', { name: 'Close panel' }).click()
  await next(page)
  await at(page, 23, 2)
})

test('both supplied excerpts play on demand and blackout pauses without moving the deck', async ({ page }) => {
  const excerpts = [
    ['bench-test', 31, 'robocurve-bench', 4],
    ['camera-comparison', 33, 'robocurve-comparison', 5],
  ] as const
  for (const [link, scene, file, duration] of excerpts) {
    await page.goto('./#scene-' + link + '.1')
    await at(page, scene, 1)
    const video = stage(page).locator('video')
    await expect(video).toHaveAttribute('src', '/the-human-override/media/' + file + '.mp4')
    await expect.poll(() => video.evaluate(player => player.duration)).toBeCloseTo(duration)
    expect(await video.evaluate(player => player.paused)).toBe(true)
    await video.evaluate(player => player.play())
    await expect.poll(() => video.evaluate(player => player.currentTime)).toBeGreaterThan(0)
    await page.keyboard.press('b')
    await expect(page.getByRole('button', { name: 'Restore presentation' })).toBeVisible()
    await expect.poll(() => video.evaluate(player => player.paused)).toBe(true)
    await page.keyboard.press('b')
    await at(page, scene, 1)
  }
  await next(page)
  await at(page, 34, 1)
  await expect(stage(page).locator('video')).toHaveCount(0)
})

test('a missing reel shows the credited frame and the presenter can advance', async ({ page }) => {
  await page.route('**/media/robocurve-bench.mp4', route => route.abort())
  await page.goto('./#scene-bench-test.1')
  await expect(stage(page).getByRole('status')).toContainText('Showing the opening frame')
  await expect(stage(page).getByRole('img')).toBeVisible()
  await next(page)
  await at(page, 32, 1)
})

test('the complete sequence fits a 16:9 projector and the phase colors are solid', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto('./')
  const palette = { control: 'rgb(31, 37, 43)', danger: 'rgb(26, 14, 16)', dread: 'rgb(10, 10, 13)', humanity: 'rgb(233, 220, 201)' }
  for (const moment of timeline) {
    await page.goto('./' + moment.hash)
    await at(page, moment.sceneIndex + 1, moment.beatIndex + 1)
    const color = moment.beat.black ? 'rgb(0, 0, 0)' : palette[moment.chapter.phase]
    await expect(stage(page)).toHaveCSS('background-color', color)
    await expect(stage(page)).toHaveCSS('background-image', 'none')
    await page.evaluate(() => document.fonts.ready.then(() => true))
    expect(await page.evaluate(() => document.documentElement.scrollHeight), moment.hash).toBeLessThanOrEqual(1080)
  }
})

test('assets resolve under the Pages base path on a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  for (const link of ['01.2', '10.1', 'what-the-display-leaves-out.1', '20.3', '22.1', '29.1', 'camera-comparison.1', '42.1']) {
    const hash = '#scene-' + link
    await page.goto('./' + hash)
    const moment = timeline.find(entry => entry.hash === hash)!
    await at(page, moment.sceneIndex + 1, moment.beatIndex + 1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360)
    await expect(page.getByRole('button', { name: 'Evidence inspector', exact: true })).toBeVisible()
    const photo = stage(page).locator('img')
    if (await photo.count()) {
      await expect(photo).toHaveAttribute('src', /^\/the-human-override\/media\//)
      await expect.poll(() => photo.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
    }
  }
})
