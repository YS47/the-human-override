import { StrictMode, useEffect, useRef, useState, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import '@fontsource/barlow-condensed/latin-600.css'
import '@fontsource/barlow-condensed/latin-700.css'
import '@fontsource-variable/geist'
import '@fontsource/ibm-plex-mono/latin-500.css'
import '@fontsource/instrument-serif/latin-400.css'
import '@fontsource/instrument-serif/latin-400-italic.css'
import { discussion, phases, scenes, type Scene } from './scenes'
import { evidence } from './evidence'
import { mediaDetails, mediaImage, type MediaId } from './media'
import { Explainer, TrialChart } from './Explainers'
import './style.css'

type Overlay = 'chapters' | 'notes' | 'evidence' | 'explore' | 'discussion' | 'visuals' | 'inspect'
type IconName = 'grid' | 'notes' | 'expand' | 'shrink' | 'left' | 'right' | 'external' | 'close' | 'source' | 'image'

const icons: Record<IconName, ReactNode> = {
  grid: <><rect x="3" y="3" width="6" height="6" rx=".5" /><rect x="15" y="3" width="6" height="6" rx=".5" /><rect x="3" y="15" width="6" height="6" rx=".5" /><rect x="15" y="15" width="6" height="6" rx=".5" /></>,
  notes: <><path d="M14 3H5v18h14V8zM14 3v5h5M8 12h8m-8 4h8" /></>,
  expand: <path d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6" />,
  shrink: <path d="M3 9h6V3m12 6h-6V3M9 21v-6H3m12 6v-6h6" />,
  left: <path d="M20 12H4m7 7-7-7 7-7" />,
  right: <path d="M4 12h16m-7-7 7 7-7 7" />,
  external: <path d="M6 18 18 6M7 6h11v11" />,
  close: <path d="m5 5 14 14M19 5 5 19" />,
  source: <><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M8 8h8m-8 4h8m-8 4h5" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="1" /><circle cx="8" cy="9" r="1" /><path d="m3 17 5-4 3 2 4-5 6 7" /></>,
}

function Icon({ name }: { name: IconName }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>
}

function Brand() {
  return <span className="brand"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>The Human<br />Override</span></span>
}

const last = scenes.length - 1
const timeLabel = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
const twoDigits = (value: number) => String(value).padStart(2, '0')

function indexFromHash() {
  if (!location.hash) return -1
  const id = location.hash.replace(/^#scene-/, '')
  return Math.max(0, scenes.findIndex(scene => scene.id === id))
}

function PresenterNotes({ scene, enteredAt, startedAt, rehearsal }: {
  scene: Scene, enteredAt: number, startedAt: number, rehearsal: boolean
}) {
  const [showClock, setShowClock] = useState(false)
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    if (!showClock) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [showClock])
  const elapsed = (start: number) => timeLabel(Math.floor(Math.max(0, now - start) / 1000))

  return (
    <div className="presenter-notes">
      <div className="note-meta">
        <p className="eyebrow">{rehearsal ? 'Condensed rehearsal' : 'Live presentation'} · {scene.seconds ? `${timeLabel(rehearsal ? Math.round(scene.seconds / 3) : scene.seconds)} target` : 'Closing pause'}</p>
        <button className="button" aria-pressed={showClock} onClick={() => { setNow(Date.now()); setShowClock(!showClock) }}>{showClock ? 'Hide timers' : 'Show timers'}</button>
      </div>
      {showClock && <p className="eyebrow">Elapsed {elapsed(startedAt)} · Scene {elapsed(enteredAt)}</p>}
      <section><h3>Say</h3><p>{scene.notes.say}</p></section>
      <section><h3>Improvise</h3><ul>{(rehearsal ? scene.notes.improvise.slice(0, 1) : scene.notes.improvise).map(cue => <li key={cue}>{cue}</li>)}</ul></section>
      <section><h3>Terminology</h3><p>{scene.notes.terms}</p></section>
      {!rehearsal && <section><h3>Attribution</h3><p>{scene.notes.attribution}</p></section>}
      <section><h3>Transition</h3><p>{scene.notes.transition}</p></section>
    </div>
  )
}

function EvidencePanel({ scene }: { scene: Scene }) {
  const visuals = new Set(scene.gallery)
  if (scene.visual) visuals.add(scene.visual)
  return (
    <div className="evidence-list">
      {scene.sources.map(id => {
        const source = evidence[id]
        return (
          <article className="source-card" key={id}>
            <p className="eyebrow">{source.kind}</p>
            <h3><a href={source.url} target="_blank" rel="noreferrer">{source.title} <Icon name="external" /></a></h3>
            <p className="source-meta">{source.publisher} · {source.date}</p>
            <p>{source.scope}</p>
          </article>
        )
      })}
      {[...visuals].map(id => {
        const image = mediaDetails(id)
        return <article className="source-card" key={id}><p className="eyebrow">{image.kind ?? 'Documentary photograph'}</p><h3><a href={image.source} target="_blank" rel="noreferrer">{image.title} <Icon name="external" /></a></h3><p className="source-meta">{[image.credit, image.date].filter(Boolean).join(' · ')}</p><p>{image.rights} {image.note}</p></article>
      })}
    </div>
  )
}

function EvidenceVisual({ scene }: { scene: Scene }) {
  if (scene.id === '3.1') return <TrialChart />
  const ids = scene.id === '2.2' ? ['lavender', 'idf', 'hrw'] as const
    : scene.id === '3.2' ? ['anthropic', 'metr'] as const
    : scene.sources
  return (
    <div className="document-stack">
      {ids.map(id => (
        <a href={evidence[id].url} target="_blank" rel="noreferrer" key={id}>
          <span className="eyebrow">{evidence[id].kind}</span>
          <strong>{id === 'anthropic' ? 'Anthropic · 96 of 100 in one condition' : id === 'metr' ? 'OpenAI / Hugging Face incident' : evidence[id].title}</strong>
          <small>{evidence[id].publisher} · {evidence[id].date}</small><Icon name="external" />
        </a>
      ))}
    </div>
  )
}

function MediaCaption({ id, inspect }: { id: MediaId, inspect?: () => void }) {
  const image = mediaDetails(id)
  return (
    <figcaption className="media-caption">
      <div className="caption-heading"><span className="eyebrow">{image.kind ?? 'Documentary photograph'}</span>{inspect && <button className="button quiet" onClick={inspect}><Icon name="expand" /> Inspect image</button>}</div>
      <a href={image.source} target="_blank" rel="noreferrer">{image.title} <Icon name="external" /></a>
      <small>{[image.credit, image.date].filter(Boolean).join(' · ')}</small>
      {image.note && <p>{image.note}</p>}
    </figcaption>
  )
}

function Visuals({ gallery }: { gallery: MediaId[] }) {
  const [index, setIndex] = useState(0)
  const [zoom, setZoom] = useState(false)
  const selected = gallery[index]

  function show(next: number) {
    setIndex(next)
    setZoom(false)
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.defaultPrevented || event.altKey || event.metaKey || event.ctrlKey) return
      if (event.target instanceof HTMLElement && event.target.closest('.zoomed')) return
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        const next = index + (event.key === 'ArrowLeft' ? -1 : 1)
        if (next >= 0 && next < gallery.length) show(next)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, gallery.length])

  return (
    <>
      <div className="choices" role="group" aria-label="Choose an image">
        {gallery.length > 1 && gallery.map((id, position) => <button key={id} aria-pressed={id === selected} onClick={() => show(position)}>{mediaDetails(id).kind ?? 'Documentary photograph'}</button>)}
        <button aria-pressed={zoom} onClick={() => setZoom(!zoom)}>{zoom ? 'Fit image' : 'Enlarge image'}</button>
      </div>
      <figure className="framed-media gallery-media">
        <div className={zoom ? 'image-viewport zoomed' : 'image-viewport'} tabIndex={zoom ? 0 : undefined} aria-label={zoom ? 'Enlarged image, scroll to inspect' : undefined}>
          <img src={mediaImage(selected)} alt={mediaDetails(selected).alt} />
        </div>
        <MediaCaption id={selected} />
      </figure>
    </>
  )
}

function Stage({ scene, heading, open, advance }: { scene: Scene, heading: React.RefObject<HTMLHeadingElement | null>, open: (overlay: Overlay) => void, advance: () => void }) {
  const phase = phases[scene.phase]
  const [mediaFailed, setMediaFailed] = useState(false)
  const visual = mediaFailed ? undefined : scene.visual

  if (scene.phase === 3) {
    return (
      <main className="stage reflection" id="presentation">
        <div className="reflection-text">
          <span className="eyebrow">Final reflection</span>
          <h1 tabIndex={-1} ref={heading}>If a machine can make a decision faster than a human, <em>should we let it make that decision for us?</em></h1>
        </div>
      </main>
    )
  }

  return (
    <main className={`stage stage-with-evidence ${scene.comparison ? 'comparison-stage' : ''}`} id="presentation">
      <div className="stage-copy">
        <p className="eyebrow scene-overline"><span>{scene.comparison ? `${twoDigits(scene.comparison.stage)} / 06` : scene.id}</span>{scene.comparison ? 'Fictional classroom comparison' : scene.id === '1.2' ? 'NGC2' : phase.title}</p>
        <h1 ref={heading} tabIndex={-1}>{scene.lines.map((line, index) => <span key={line} className={index ? 'title-accent' : undefined}>{line}</span>)}</h1>
        <p className="deck">{scene.deck}</p>
        {scene.comparison && <dl className="comparison">
          <div><dt>Base A <span>AI assistance</span></dt><dd>{scene.comparison.baseA}</dd></div>
          <div><dt>Base B <span>Human-led review</span></dt><dd>{scene.comparison.baseB}</dd></div>
        </dl>}
        <div className="stage-actions">
          {scene.id === '1.1' && <button className="button primary" onClick={advance}>Begin the six stages <Icon name="right" /></button>}
          {scene.explore && <button className="button primary" onClick={() => open('explore')}>{scene.explore} <Icon name="right" /></button>}
          <button className="button quiet" onClick={() => open('evidence')}><Icon name="source" /> Evidence</button>
          {scene.gallery && <button className="button quiet" onClick={() => open('visuals')}><Icon name="image" /> {scene.id === '1.1' ? 'Video stills' : 'Visuals'}</button>}
        </div>
      </div>
      <aside className="stage-evidence" aria-label="Featured evidence">
        {visual ? <figure className={`framed-media scene-media ${visual === 'book-cover' ? 'book-media' : ''}`}><img src={mediaImage(visual)} alt={mediaDetails(visual).alt} onError={() => setMediaFailed(true)} /><MediaCaption id={visual} inspect={() => open('inspect')} /></figure>
          : <EvidenceVisual scene={scene} />}
      </aside>
    </main>
  )
}

function Opening({ heading, begin, fullscreen, isFullscreen }: { heading: React.RefObject<HTMLHeadingElement | null>, begin: () => void, fullscreen: () => void, isFullscreen: boolean }) {
  return (
    <main className="stage opening" id="presentation">
      <div className="opening-copy">
        <p className="eyebrow">AI, warfare & human control</p>
        <h1 tabIndex={-1} ref={heading}>The Human <em>Override</em></h1>
        <p className="deck">Who decides when machines can act?</p>
        <button className="begin-button" onClick={begin}><span>Begin</span><span className="begin-hint"><kbd>Space</kbd> <Icon name="right" /></span></button>
      </div>
      <div className="opening-image" aria-hidden="true"><img src={mediaImage('command-post')} alt="" /></div>
      <button className="button quiet opening-fullscreen" onClick={fullscreen}><Icon name={isFullscreen ? 'shrink' : 'expand'} /> {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}</button>
    </main>
  )
}

function App() {
  const [index, setIndex] = useState(indexFromHash)
  const [overlay, setOverlay] = useState<Overlay | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [notice, setNotice] = useState('')
  const [rehearsal, setRehearsal] = useState(false)
  const [startedAt, setStartedAt] = useState(Date.now)
  const [enteredAt, setEnteredAt] = useState(startedAt)
  const dialog = useRef<HTMLDialogElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const focusScene = useRef(false)
  const sceneTransition = useRef<ViewTransition | null>(null)
  const scene = scenes[Math.max(0, index)]
  const chapterIndex = scene.comparison ? index - scene.comparison.stage : index
  const phase = phases[scene.phase]

  useEffect(() => {
    function onHashChange() {
      function updateScene() {
        focusScene.current = true
        setIndex(indexFromHash())
        setEnteredAt(Date.now())
        setOverlay(null)
      }
      sceneTransition.current?.skipTransition()
      if (document.startViewTransition && !dialog.current?.open && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const transition = document.startViewTransition(() => flushSync(updateScene))
        sceneTransition.current = transition
        void transition.ready.catch(() => {})
        void transition.finished.then(() => {
          if (sceneTransition.current === transition) sceneTransition.current = null
        })
      } else {
        updateScene()
      }
    }
    function onFullscreenChange() { setFullscreen(Boolean(document.fullscreenElement)) }
    window.addEventListener('hashchange', onHashChange)
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => {
      window.removeEventListener('hashchange', onHashChange)
      document.removeEventListener('fullscreenchange', onFullscreenChange)
    }
  }, [])

  useEffect(() => {
    if (overlay && !dialog.current?.open) dialog.current?.showModal()
    if (!overlay && dialog.current?.open) dialog.current.close()
  }, [overlay])

  useEffect(() => {
    if (focusScene.current && !overlay) {
      heading.current?.focus({ preventScroll: true })
      window.scrollTo({ top: 0, behavior: 'instant' })
      focusScene.current = false
    }
  }, [index, overlay])

  useEffect(() => {
    const theme = ['#1F252B', '#1A0E10', '#0A0A0D', '#E9DCC9'][scene.phase]
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme)
    document.title = index < 0 ? 'The Human Override' : `${scene.title} · The Human Override`
  }, [index, scene])

  function goTo(next: number) {
    const destination = Math.min(last, Math.max(0, next))
    setOverlay(null)
    const current = indexFromHash()
    if (destination === current) return
    if (current < 0) setStartedAt(Date.now())
    location.hash = `scene-${scenes[destination].id}`
  }

  async function toggleFullscreen() {
    setNotice('')
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch {
      setNotice('Fullscreen is unavailable in this browser. Use the browser’s fullscreen control.')
    }
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (overlay || event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.defaultPrevented) return
      if (event.target instanceof HTMLElement) {
        if (event.target.closest('input, textarea, select, [contenteditable], iframe')) return
        if (event.key === ' ' && event.target.closest('button, a')) return
      }
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault()
        goTo(indexFromHash() + 1)
      }
      if (indexFromHash() >= 0 && ['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault()
        goTo(indexFromHash() - 1)
      }
      if (indexFromHash() >= 0 && event.key.toLowerCase() === 'n') setOverlay('notes')
      if (event.key.toLowerCase() === 'f') void toggleFullscreen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, overlay])

  const titles: Record<Overlay, string> = {
    chapters: 'Chapters', notes: scene.title, evidence: 'Sources and evidence',
    explore: scene.explore ?? scene.title, discussion: 'Audience Q&A', visuals: scene.id === '1.1' ? 'Video stills' : 'Scene visuals',
    inspect: 'Inspect image',
  }
  const sceneImages = [...new Set([scene.visual, ...(scene.gallery ?? [])])].filter((id): id is MediaId => id !== undefined)

  return (
    <div className={`presentation theme-${phase.id} ${index < 0 ? 'presentation-opening' : ''}`}>
      {index < 0 ? <Opening heading={heading} begin={() => goTo(0)} fullscreen={() => void toggleFullscreen()} isFullscreen={fullscreen} /> : <>
      <header className="topbar">
        <Brand />
        <span className="topbar-center">AI, warfare & human control</span>
        <div className="header-actions">
          <button aria-label="Chapters" className="button quiet" onClick={() => setOverlay('chapters')}><Icon name="grid" /><span>Chapters</span></button>
          <button aria-label="Presenter notes" className="button quiet" onClick={() => setOverlay('notes')}><Icon name="notes" /><span>Notes</span></button>
          <button aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} className="button frame" onClick={() => void toggleFullscreen()}><Icon name={fullscreen ? 'shrink' : 'expand'} /><span>{fullscreen ? 'Exit' : 'Fullscreen'}</span></button>
        </div>
      </header>

      <Stage key={scene.id} scene={scene} heading={heading} open={setOverlay} advance={() => goTo(indexFromHash() + 1)} />

      <footer className="footer">
        <div className="timeline">
          {phases.map((item, phaseIndex) => (
            <div className={`phase-track ${scene.phase === phaseIndex ? 'active-phase' : ''}`} key={item.id}>
              <span className="phase-label"><b>{item.numeral}</b> {item.mood}</span>
              <div className="segments" role="group" aria-label={item.title}>
                {scenes.map((entry, i) => entry.phase === phaseIndex && !entry.comparison && (
                  <button className={i <= chapterIndex ? 'reached' : ''} key={entry.id} title={entry.title} aria-label={`Go to ${entry.title}`} aria-current={i === chapterIndex ? 'step' : undefined} onClick={() => goTo(i)} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="footer-controls">
          <button className="button arrow" aria-label="Previous scene" disabled={index === 0} onClick={() => goTo(indexFromHash() - 1)}><Icon name="left" /></button>
          <button className="button scene-count" aria-label="Open scene navigator" onClick={() => setOverlay('chapters')}><span>{scene.title}</span><span className="mono">{twoDigits(index + 1)} / {twoDigits(scenes.length)}</span></button>
          <button className="button arrow" aria-label="Next scene" disabled={index === last} onClick={() => goTo(indexFromHash() + 1)}><Icon name="right" /></button>
        </div>
      </footer>
      </>}
      {notice && <div className="notice" role="status"><span>{notice}</span><button className="button quiet" onClick={() => setNotice('')}>Dismiss</button></div>}

      <dialog ref={dialog} className="panel" aria-labelledby="overlay-title" onCancel={event => { event.preventDefault(); setOverlay(null) }} onClick={event => { if (event.target === event.currentTarget) setOverlay(null) }}>
        {overlay && <div className="panel-inner" key={overlay}>
          <header className="panel-head">
            <div><span className="eyebrow">{overlay === 'notes' ? 'Presenter notes' : phase.title}</span><h2 id="overlay-title">{titles[overlay]}</h2></div>
            <button className="button frame close-panel" aria-label="Close panel" onClick={() => setOverlay(null)}><Icon name="close" /></button>
          </header>
          <div className="panel-body">
            {overlay === 'chapters' && <>
              <nav className="chapter-list" aria-label="Chapters">
                {phases.map((item, p) => <section key={item.id}><h3>{item.numeral} · {item.title}</h3>{scenes.map((entry, i) => entry.phase === p && <button key={entry.id} aria-current={index === i ? 'step' : undefined} onClick={() => goTo(i)}><span className="mono">{entry.id === 'reflection' ? '—' : entry.id}</span><span>{entry.title}</span>{entry.seconds > 0 && <small>{timeLabel(entry.seconds)}</small>}</button>)}</section>)}
              </nav>
              <div className="chapter-actions">
                <button className="button" aria-pressed={rehearsal} onClick={() => { setRehearsal(!rehearsal); setStartedAt(Date.now()); setEnteredAt(Date.now()) }}>{rehearsal ? 'End condensed rehearsal' : 'Start condensed rehearsal'}</button>
                <button className="button" onClick={() => setOverlay('discussion')}>Open audience Q&A <Icon name="right" /></button>
              </div>
              <p className="keyboard-help"><kbd>←</kbd> <kbd>→</kbd> Change scenes · <kbd>Space</kbd> Advance · <kbd>N</kbd> Notes · <kbd>F</kbd> Fullscreen · <kbd>Esc</kbd> Close</p>
            </>}
            {overlay === 'notes' && <PresenterNotes scene={scene} enteredAt={enteredAt} startedAt={startedAt} rehearsal={rehearsal} />}
            {overlay === 'evidence' && <EvidencePanel scene={scene} />}
            {overlay === 'visuals' && scene.gallery && <Visuals gallery={scene.gallery} />}
            {overlay === 'inspect' && <Visuals gallery={sceneImages} />}
            {overlay === 'explore' && <Explainer scene={scene.id} />}
            {overlay === 'discussion' && <><button className="button" onClick={() => setOverlay('chapters')}><Icon name="left" /> Chapters</button><ol className="discussion">{discussion.map(question => <li key={question}>{question}</li>)}</ol></>}
          </div>
        </div>}
      </dialog>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
