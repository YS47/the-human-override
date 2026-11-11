import { StrictMode, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import '@fontsource-variable/geist'
import '@fontsource/dm-serif-text/latin-400.css'
import '@fontsource/dm-serif-text/latin-400-italic.css'
import '@fontsource/ibm-plex-mono/latin-500.css'
import { ChapterRail, PresenterPanel, sceneNumber, totalScenes, type Panel } from './Presenter'
import { Stage } from './Stage'
import { clips, mediaImage } from './media'
import { momentIndex, timeline, type Beat, type Transition } from './scenes'
import './style.css'

const animationTime: Record<Transition | 'shutter', number> = {
  cut: 0, dip: 820, zoom: 780, across: 600, wipe: 670, match: 560, isolate: 630, replace: 480, split: 640, reset: 1000, aperture: 720,
  shutter: 880,
}
const inputInterval = 230
const lastBeat = timeline.length - 1

function useCues() {
  const context = useRef<AudioContext | null>(null)
  const active = useRef<{ gain: GainNode; oscillator: OscillatorNode } | null>(null)

  function unlock() {
    try {
      context.current ??= new AudioContext()
      void context.current.resume().catch(() => {})
    } catch {
      // Presentation remains available on devices without Web Audio.
    }
  }

  function stop() {
    const cue = active.current
    if (!cue) return
    cue.gain.disconnect()
    active.current = null
  }

  function play(kind: NonNullable<Beat['cue']>) {
    const audio = context.current
    if (audio?.state !== 'running') return
    stop()
    const oscillator = audio.createOscillator()
    const gain = audio.createGain()
    const start = audio.currentTime
    const frequency = kind === 'threshold' ? 110 : 392
    oscillator.frequency.setValueAtTime(frequency, start)
    oscillator.frequency.exponentialRampToValueAtTime(frequency * .76, start + .28)
    gain.gain.setValueAtTime(.0001, start)
    gain.gain.exponentialRampToValueAtTime(.028, start + .03)
    gain.gain.exponentialRampToValueAtTime(.0001, start + .30)
    oscillator.connect(gain)
    gain.connect(audio.destination)
    oscillator.onended = () => {
      oscillator.disconnect()
      gain.disconnect()
      if (active.current?.oscillator === oscillator) active.current = null
    }
    active.current = { gain, oscillator }
    oscillator.start()
    oscillator.stop(start + .31)
  }

  useEffect(() => () => { void context.current?.close().catch(() => {}); context.current = null }, [])
  return { unlock, stop, play }
}

function App() {
  const [position, setPosition] = useState(() => momentIndex(location.hash))
  const [panel, setPanel] = useState<Panel | null>(null)
  const [muted, setMuted] = useState(true)
  const [blackout, setBlackout] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement))
  const [message, setMessage] = useState('')
  const [visited, setVisited] = useState(() => new Set([timeline[position].chapter.id]))
  const current = useRef(position)
  const generation = useRef(0)
  const lockedUntil = useRef(0)
  const lastInput = useRef({ time: -Infinity, direction: 0 })
  const motion = useRef<ViewTransition | null>(null)
  const sound = useCues()
  const moment = timeline[position]

  function navigate(destination: number, manual = true) {
    const next = Math.max(0, Math.min(lastBeat, destination))
    if (next === current.current) {
      if (panel) setPanel(null)
      return
    }
    const incoming = timeline[next]
    const outgoing = timeline[current.current]
    const direction = next < current.current ? 'back' : 'forward'
    const crossesPhase = incoming.chapter.phase !== outgoing.chapter.phase &&
      incoming.chapter.phase !== 'humanity' && outgoing.chapter.phase !== 'humanity'
    const effect = crossesPhase ? 'shutter' : incoming.beat.motion
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reduced ? 0 : animationTime[effect]
    const animate = duration > 0 && Boolean(document.startViewTransition) && !panel && !blackout
    const token = ++generation.current
    current.current = next
    lockedUntil.current = performance.now() + Math.max(animate ? duration : 0, inputInterval)
    motion.current?.skipTransition()
    sound.stop()
    if (manual && !muted && incoming.beat.cue) sound.play(incoming.beat.cue)
    if (manual) history.pushState(null, '', incoming.hash)

    function commit() {
      if (token !== generation.current) return
      setPosition(next)
      setPanel(null)
      setVisited(previous => previous.has(incoming.chapter.id) ? previous : new Set([...previous, incoming.chapter.id]))
    }

    if (animate) {
      const root = document.documentElement
      root.dataset.transition = effect
      root.dataset.direction = direction
      root.style.setProperty('--duration', duration + 'ms')
      const transition = document.startViewTransition(() => flushSync(commit))
      motion.current = transition
      void transition.ready.catch(() => {})
      void transition.finished.catch(() => {}).finally(() => {
        if (motion.current !== transition) return
        motion.current = null
        lockedUntil.current = Math.max(lockedUntil.current, performance.now())
      })
    } else {
      commit()
    }
  }

  function step(direction: -1 | 1) {
    if (panel || blackout) return
    const now = performance.now()
    if (direction === 1 && (now < lockedUntil.current || motion.current)) return
    if (direction === lastInput.current.direction && now - lastInput.current.time < inputInterval) return
    const next = current.current + direction
    if (next < 0 || next > lastBeat) return
    lastInput.current = { time: now, direction }
    navigate(next)
  }

  function toggleMute() {
    if (muted) sound.unlock()
    else sound.stop()
    setMuted(!muted)
  }

  function toggleBlackout() {
    sound.stop()
    motion.current?.skipTransition()
    setPanel(null)
    setBlackout(!blackout)
  }

  async function toggleFullscreen() {
    setMessage('')
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch {
      setMessage('Fullscreen is unavailable here. Use your browser’s fullscreen command.')
    }
  }

  function openPanel(next: Panel) {
    setPanel(panel === next ? null : next)
  }

  useEffect(() => {
    function onLocation() { navigate(momentIndex(location.hash), false) }
    function onFullscreen() { setFullscreen(Boolean(document.fullscreenElement)) }
    function onKey(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return
      if (event.target instanceof HTMLElement && event.target.closest('input,textarea,select,[contenteditable]')) return
      const key = event.key.toLowerCase()
      if (key === 'b' || (blackout && key === 'escape')) {
        event.preventDefault()
        toggleBlackout()
        return
      }
      if (key === 'm') {
        event.preventDefault()
        toggleMute()
        return
      }
      if (blackout) return
      const panels: Partial<Record<string, Panel>> = { g: 'navigator', n: 'notes', i: 'evidence', '?': 'help' }
      const requested = panels[key]
      if (requested) {
        event.preventDefault()
        openPanel(requested)
        return
      }
      if (key === 'f') { event.preventDefault(); void toggleFullscreen(); return }
      if (key === 'c') { event.preventDefault(); setShowControls(value => !value); return }
      if (panel) return
      if (key === ' ' && event.target instanceof HTMLElement && event.target.closest('button,a,video')) return
      if ([' ', 'arrowright', 'arrowleft'].includes(key)) {
        event.preventDefault()
        step(key === 'arrowleft' ? -1 : 1)
      }
    }
    window.addEventListener('popstate', onLocation)
    window.addEventListener('hashchange', onLocation)
    window.addEventListener('keydown', onKey)
    document.addEventListener('fullscreenchange', onFullscreen)
    return () => {
      window.removeEventListener('popstate', onLocation)
      window.removeEventListener('hashchange', onLocation)
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('fullscreenchange', onFullscreen)
    }
  }, [panel, blackout, muted])

  useEffect(() => {
    document.title = moment.scene.title + ' · The Human Override'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',
      moment.beat.black ? '#000000' : { control: '#1F252B', danger: '#1A0E10', dread: '#0A0A0D', humanity: '#E9DCC9' }[moment.chapter.phase])
    document.getElementById('presentation-stage')?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: 'instant' })
    const upcoming = timeline.slice(position + 1, position + 4)
    for (const { beat } of upcoming) {
      const visual = beat.visual
      const image = visual?.kind === 'image' ? visual.id :
        visual?.kind === 'conditions' ? 'robot-3' : visual?.kind === 'clip' ? clips[visual.id].poster : null
      if (image) {
        const photo = new Image()
        photo.src = mediaImage(image)
      }
    }
  }, [position, moment])

  return (
    <div className={'presentation theme-' + moment.chapter.phase + (moment.beat.black ? ' opening' : '')}
      data-scene={moment.sceneIndex + 1} data-beat={moment.beatIndex + 1}>
      <div className="presentation-content" inert={blackout}>
        <Stage moment={moment} advance={() => step(1)} muted={muted || blackout} covered={blackout || panel !== null} />
        {showControls && <>
          <ChapterRail moment={moment} visited={visited} jump={navigate} />
          <nav className="control-bar" aria-label="Presenter controls">
            <button onClick={() => step(-1)} disabled={position === 0} aria-label="Previous beat" title="Previous beat · ←">←</button>
            <button className="position" onClick={() => openPanel('navigator')} aria-label="Open scene navigator" title="Scene navigator · G">
              <strong>{sceneNumber(moment.sceneIndex)} / {totalScenes}</strong>
              <span>{moment.beatIndex + 1} / {moment.scene.beats.length}</span>
            </button>
            <button onClick={() => step(1)} disabled={position === lastBeat} aria-label="Next beat" title="Next beat · Space or →">→</button>
            <span className="control-separator" />
            <button onClick={() => openPanel('notes')} aria-label="Speaker notes" title="Speaker notes · N">N</button>
            <button onClick={() => openPanel('evidence')} aria-label="Evidence inspector" title="Evidence inspector · I">I</button>
            <button onClick={() => void toggleFullscreen()} aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} title="Fullscreen · F">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d={fullscreen ? 'M3 9h6V3m12 6h-6V3M9 21v-6H3m12 6v-6h6' : 'M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6'} />
              </svg>
            </button>
            <button onClick={() => openPanel('help')} aria-label="Keyboard controls" title="Keyboard controls · ?">?</button>
            <button onClick={toggleMute} aria-label={muted ? 'Unmute audio' : 'Mute audio'} title="Audio · M">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M3 9h4l5-4v14l-5-4H3z" />
                <path d={muted ? 'm16 9 5 6m0-6-5 6' : 'M16 8c2 2 2 6 0 8m3-11c4 4 4 10 0 14'} />
              </svg>
            </button>
          </nav>
        </>}
        <p className="sr-only" aria-live="polite">Scene {sceneNumber(moment.sceneIndex)}, beat {moment.beatIndex + 1}. {moment.beat.title}</p>
        {message && <div className="notice" role="status">{message} <button onClick={() => setMessage('')}>Dismiss</button></div>}
      </div>
      <PresenterPanel panel={panel} moment={moment} muted={muted} close={() => setPanel(null)} jump={navigate} />
      {blackout && <button className="blackout" aria-label="Restore presentation" onClick={toggleBlackout} />}
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
