import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { evidence } from './evidence'
import { interview, mediaDetails, mediaImage, type MediaId } from './media'
import { chapters, discussion, phaseTitles, scenes, timeline, type Moment } from './scenes'

export type Panel = 'navigator' | 'notes' | 'evidence' | 'help'

export function sceneNumber(index: number) {
  return String(index + 1).padStart(2, '0')
}

export const shortcuts = [
  ['Space / →', 'Next beat'], ['←', 'Previous beat'], ['F', 'Fullscreen'], ['G', 'Scene navigator'],
  ['N', 'Speaker notes'], ['I', 'Evidence inspector'], ['C', 'Show or hide controls'],
  ['M', 'Mute or unmute'], ['B', 'Blackout or restore'], ['?', 'Keyboard controls'], ['Esc', 'Close or exit'],
] as const

function Navigator({ moment, jump }: { moment: Moment; jump: (index: number) => void }) {
  return <div className="scene-index">
    {Object.entries(phaseTitles).map(([phase, title]) => <section key={phase}>
      <h3>{title}</h3>
      <div className="scene-index-chapters">
        {chapters.filter(chapter => chapter.phase === phase).map(chapter => <div key={chapter.id}>
          {phase !== 'humanity' && <h4>{chapter.title}</h4>}
          <ol>{timeline.map((entry, index) =>
            entry.chapter.id === chapter.id && entry.beatIndex === 0 && (
              <li key={entry.hash}>
                <button onClick={() => jump(index)} aria-current={entry.sceneIndex === moment.sceneIndex ? 'step' : undefined}>
                  <span>{sceneNumber(entry.sceneIndex)}</span>{entry.scene.title}
                </button>
              </li>
            ))}
          </ol>
        </div>)}
      </div>
    </section>)}
  </div>
}

function Notes({ moment }: { moment: Moment }) {
  const minutes = Math.floor(moment.scene.seconds / 60)
  const seconds = String(moment.scene.seconds % 60).padStart(2, '0')
  return <div className="notes-content">
    <p className="eyebrow">Scene {sceneNumber(moment.sceneIndex)} · Beat {moment.beatIndex + 1} · {minutes}:{seconds} planned</p>
    <p>{phaseTitles[moment.chapter.phase]}{moment.chapter.phase !== 'humanity' && ' · ' + moment.chapter.title}</p>
    <h3>{moment.beat.title}</h3>
    {moment.beat.note && <p className="speaker-cue">{moment.beat.note}</p>}
    <p>{moment.scene.notes}</p>
    <h3>Next</h3>
    <p>{moment.scene.next}</p>
    {moment.chapter.phase === 'humanity' && <details className="discussion">
      <summary>Optional audience discussion</summary>
      <ol>{discussion.map(question => <li key={question}>{question}</li>)}</ol>
    </details>}
  </div>
}

function sceneMedia(moment: Moment): MediaId[] {
  const selected = moment.beat.visual
  const ids = moment.scene.beats.flatMap(({ visual }) =>
    visual?.kind === 'image' ? [visual.id] : visual?.kind === 'conditions' ? ['robot-3' as const] : [])
  const current = selected?.kind === 'image' ? [selected.id] : []
  return [...new Set([...current, ...ids, ...(moment.scene.extras ?? [])])]
}

export function Interview({ muted }: { muted: boolean }) {
  const [loaded, setLoaded] = useState(false)
  const [waiting, setWaiting] = useState(false)
  useEffect(() => {
    if (!waiting) return
    const timer = window.setTimeout(() => setWaiting(false), 5500)
    return () => window.clearTimeout(timer)
  }, [waiting])
  return <section className="interview">
    <h3>{interview.title}</h3>
    <p><a href={interview.source} target="_blank" rel="noreferrer">Open the original interview at {interview.publisher} ↗</a></p>
    {loaded
      ? <>
        {waiting && <p role="status">Opening the interview player…</p>}
        <iframe title={interview.title} onLoad={() => setWaiting(false)} onError={() => setWaiting(false)}
          src={interview.embed + (muted ? '&mute=1' : '')} allow="encrypted-media; picture-in-picture" allowFullScreen />
        <button onClick={() => { setLoaded(false); setWaiting(false) }}>Close player</button>
      </>
      : <button onClick={() => { setLoaded(true); setWaiting(true) }}>Load interview player</button>}
  </section>
}

function Inspector({ moment, muted }: { moment: Moment; muted: boolean }) {
  const images = sceneMedia(moment)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [scale, setScale] = useState(1)
  const [failed, setFailed] = useState(false)
  const imageViewport = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null)
  const id = images[photoIndex]
  const details = id && mediaDetails(id)

  function step(direction: number) {
    if (images.length < 2) return
    setPhotoIndex(index => (index + direction + images.length) % images.length)
    setScale(1)
    setFailed(false)
    imageViewport.current?.scrollTo(0, 0)
  }

  function zoom(delta: number) {
    setScale(value => Math.min(4, Math.max(1, value + delta)))
  }

  function beginPan(event: PointerEvent<HTMLDivElement>) {
    if (scale <= 1 || event.button !== 0) return
    const box = event.currentTarget
    box.setPointerCapture(event.pointerId)
    drag.current = { x: event.clientX, y: event.clientY, left: box.scrollLeft, top: box.scrollTop }
  }

  function pan(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return
    const { x, y, left, top } = drag.current
    event.currentTarget.scrollLeft = left + x - event.clientX
    event.currentTarget.scrollTop = top + y - event.clientY
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!id || event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.repeat) return
      if (event.target === imageViewport.current && scale > 1 && event.key.startsWith('Arrow')) return
      if (!['ArrowLeft', 'ArrowRight', '+', '=', '-'].includes(event.key)) return
      event.preventDefault()
      if (event.key === 'ArrowLeft') step(-1)
      else if (event.key === 'ArrowRight') step(1)
      else zoom(event.key === '-' ? -.5 : .5)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [id, images.length, scale])

  return <div className="evidence-content">
    {id && details && <>
      <div className="inspector-actions" role="group" aria-label="Image controls">
        <button disabled={images.length < 2} onClick={() => step(-1)} aria-label="Previous image">←</button>
        <span>{photoIndex + 1} / {images.length}</span>
        <button disabled={images.length < 2} onClick={() => step(1)} aria-label="Next image">→</button>
        <button disabled={scale <= 1} onClick={() => zoom(-.5)} aria-label="Zoom out">−</button>
        <button onClick={() => { setScale(1); imageViewport.current?.scrollTo(0, 0) }}>Fit</button>
        <button disabled={scale >= 4} onClick={() => zoom(.5)} aria-label="Zoom in">+</button>
        <span aria-live="polite">{Math.round(scale * 100)}%</span>
      </div>
      <figure className="inspect-figure">
        <div ref={imageViewport} className={scale > 1 ? 'image-viewport zoomed' : 'image-viewport'}
          tabIndex={scale > 1 ? 0 : undefined} aria-label="Evidence image viewport"
          onPointerDown={beginPan} onPointerMove={pan}
          onLostPointerCapture={() => { drag.current = null }}>
          {failed ? <p role="status">Image unavailable. Open the source below.</p> :
            <img src={mediaImage(id)} alt={details.alt} draggable={false}
              style={{ width: scale * 100 + '%' }} onError={() => setFailed(true)} />}
        </div>
        <figcaption><a href={details.source} target="_blank" rel="noreferrer">{details.title} ↗</a>
          <span>{[details.credit, details.date].filter(Boolean).join(' · ')} · {details.license
            ? <a href={details.license} target="_blank" rel="noreferrer">{details.rights}</a>
            : details.rights}</span></figcaption>
      </figure>
    </>}
    {moment.scene.interview && <Interview key={String(muted)} muted={muted} />}
    {moment.scene.sources.map(id => {
      const entry = evidence[id]
      return <article className="citation" key={id}>
        <p className="eyebrow">{entry.kind} · {entry.date}</p>
        <h3><a href={entry.url} target="_blank" rel="noreferrer">{entry.title} ↗</a></h3>
        <p>{entry.publisher}. {entry.scope}</p>
      </article>
    })}
    {!id && !moment.scene.sources.length && <p>This scene is an audience question. The investigation starts in the next scene.</p>}
  </div>
}

const titles: Record<Panel, string> = {
  navigator: 'Scene navigator', notes: 'Speaker notes', evidence: 'Evidence inspector', help: 'Keyboard controls',
}

export function PresenterPanel({ panel, moment, muted, close, jump }: {
  panel: Panel | null; moment: Moment; muted: boolean; close: () => void; jump: (index: number) => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (panel && !dialog.current?.open) dialog.current?.showModal()
    if (!panel && dialog.current?.open) dialog.current.close()
  }, [panel])

  return <dialog ref={dialog} className={'presenter-panel panel-' + (panel ?? 'closed')} aria-labelledby="panel-title"
    onCancel={event => { event.preventDefault(); close() }}
    onClick={event => { if (event.target === event.currentTarget) close() }}>
    {panel && <div className="panel-inner">
      <header><h2 id="panel-title">{titles[panel]}</h2><button onClick={close} aria-label="Close panel">×</button></header>
      <div className="panel-content">
        {panel === 'navigator' && <Navigator moment={moment} jump={jump} />}
        {panel === 'notes' && <Notes moment={moment} />}
        {panel === 'evidence' && <Inspector key={moment.hash} moment={moment} muted={muted} />}
        {panel === 'help' && <dl className="shortcuts">{shortcuts.map(([key, description]) =>
          <div key={key}><dt><kbd>{key}</kbd></dt><dd>{description}</dd></div>
        )}</dl>}
      </div>
    </div>}
  </dialog>
}

export function ChapterRail({ moment, visited, jump }: { moment: Moment; visited: Set<string>; jump: (index: number) => void }) {
  return <nav className="chapter-rail" aria-label="Chapters">
    {chapters.map(chapter => {
      const first = timeline.findIndex(entry => entry.chapter.id === chapter.id)
      return <button key={chapter.id} title={chapter.title} aria-label={chapter.title}
        aria-current={moment.chapter.id === chapter.id ? 'step' : undefined}
        data-visited={visited.has(chapter.id)} onClick={() => jump(first)}>{chapter.id === '4' ? 'End' : chapter.id}</button>
    })}
  </nav>
}

export const totalScenes = scenes.length
