import { Fragment, useEffect, useRef, useState } from 'react'
import { AgentLoop, AlertGrid, ReportComparison, TransportMap } from './Diagrams'
import { evidence } from './evidence'
import { clips, mediaDetails, mediaImage, mediaPath, type ClipId, type MediaId } from './media'
import { Interview } from './Presenter'
import { Quiz } from './Quiz'
import type { Moment, Visual } from './scenes'
import './visualizations.css'

export function Photograph({ id, detail = false }: { id: MediaId; detail?: boolean }) {
  const [failed, setFailed] = useState(false)
  const entry = mediaDetails(id)
  return (
    <figure className="photograph">
      {failed
        ? <div className="media-error" role="status">Image unavailable. Open the source below.</div>
        : <div className={detail ? 'photo-crop detail' : 'photo-crop'}>
          <img src={mediaImage(id)} alt={entry.alt} onError={() => setFailed(true)} />
        </div>}
      <figcaption><a href={entry.source} target="_blank" rel="noreferrer">{entry.title} ↗</a><span>{[entry.credit, entry.date].filter(Boolean).join(' · ')}</span></figcaption>
    </figure>
  )
}

function LabClip({ id, muted, covered }: { id: ClipId; muted: boolean; covered: boolean }) {
  const player = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  const clip = clips[id]
  const poster = mediaImage(clip.poster)
  const credit = mediaDetails(clip.poster)

  useEffect(() => {
    if (covered) player.current?.pause()
  }, [covered])

  return <figure className="lab-clip" data-clip={id}>
    <div className="clip-frame">
      {failed ? <img src={poster} alt={credit.alt} width={clip.width} height={clip.height} /> :
        <video ref={player} controls playsInline muted={muted} preload="metadata"
          src={mediaPath(clip.file)} poster={poster} width={clip.width} height={clip.height} aria-label={clip.title}
          onError={() => setFailed(true)} />}
    </div>
    <figcaption>
      {failed && <span role="status">Clip unavailable. Showing the opening frame.</span>}
      <a href={credit.source} target="_blank" rel="noreferrer">{credit.credit} ↗</a>
      <span>{clip.duration} · silent</span>
    </figcaption>
  </figure>
}

function Detector({ level }: { level: number }) {
  return (
    <figure className="detector">
      <svg viewBox="0 0 640 300" role="img" aria-label={['Illustration of a mug on a desk', 'Bounding box proposed around the mug', 'Bounding box with an invented mug class score of 0.87'][level]}>
        <rect x="1" y="1" width="638" height="298" fill="var(--surface)" stroke="var(--rule)" strokeWidth="2" />
        <path d="M30 225H610" stroke="var(--rule)" strokeWidth="2" />
        <ellipse cx="311" cy="225" rx="98" ry="14" fill="var(--bg)" />
        <path d="M366 110h28a29 29 0 0 1 0 58h-24" fill="none" stroke="var(--text)" strokeWidth="10" />
        <path d="M251 85h122v98a35 35 0 0 1-35 35h-52a35 35 0 0 1-35-35z" fill="var(--text)" />
        <ellipse cx="312" cy="85" rx="61" ry="16" fill="var(--secondary)" stroke="var(--text)" strokeWidth="3" />
        {level >= 1 && <rect className="detector-box" x="225" y="53" width="207" height="180" fill="none" stroke="var(--accent)" strokeWidth="3" />}
        {level >= 2 && <text x="225" y="45" fill="var(--signal)" fontFamily="monospace" fontSize="21">MUG · 0.87</text>}
      </svg>
      <figcaption>Classroom illustration</figcaption>
    </figure>
  )
}

const conditions = [
  { x: 264, name: 'Unaltered' },
  { x: 438, name: 'Blurred' },
  { x: 612, name: 'Doctored' },
] as const

function Condition({ column }: { column: 0 | 1 | 2 }) {
  const entry = conditions[column]
  return (
    <figure className="experiment">
      <svg viewBox={entry.x + ' 494 164 110'} role="img" aria-label={entry.name + ' experimental camera input with test props'}>
        <defs><clipPath id="condition-crop"><rect x={entry.x} y="494" width="164" height="110" /></clipPath></defs>
        <image width="1080" height="1350" clipPath="url(#condition-crop)" href={mediaImage('robot-3')} />
      </svg>
      <figcaption><a href={evidence.robot.url} target="_blank" rel="noreferrer">Robocurve · original input figure ↗</a><span>{entry.name} laboratory input · cropped from the supplied figure</span></figcaption>
    </figure>
  )
}

const results = [
  { label: 'Unaltered', value: 81 },
  { label: 'Blurred', value: 263 },
  { label: 'Doctored', value: 291 },
]

function Bases() {
  return <figure className="base-diagram">
    <div className="base-field">
      {['Base A', 'Base B'].map(label => <div key={label}>
        <svg viewBox="0 0 200 124" aria-hidden="true">
          <path d="M100 28v38M48 66h104M48 66v27m52-27v27m52-27v27" fill="none" stroke="var(--rule)" strokeWidth="2" />
          <rect x="78" y="5" width="44" height="30" fill="var(--surface)" stroke="var(--text)" />
          {[48, 100, 152].map(x => <rect key={x} x={x - 15} y="87" width="30" height="24" fill="var(--surface)" stroke="var(--text)" />)}
        </svg>
        <strong>{label}</strong>
      </div>)}
    </div>
    <figcaption>Fictional classroom schematic</figcaption>
  </figure>
}

function Fusion({ merged }: { merged: boolean }) {
  return <figure className="fusion">
    <svg viewBox="0 0 760 270" role="img" aria-label={merged ? 'Two uncertainty regions with their overlap highlighted' : 'Two uncertain observations with overlapping regions'}>
      <defs><clipPath id="observation-a"><ellipse cx="300" cy="137" rx="172" ry="106" /></clipPath></defs>
      {merged && <ellipse cx="460" cy="137" rx="172" ry="106" clipPath="url(#observation-a)" fill="var(--secondary)" />}
      <ellipse cx="300" cy="137" rx="172" ry="106" fill="none" stroke="var(--text)" strokeWidth="2" />
      <ellipse cx="460" cy="137" rx="172" ry="106" fill="none" stroke="var(--accent)" strokeWidth="2" />
      <text x="240" y="143" fill="var(--text)" fontSize="20" textAnchor="middle">Report A</text>
      <text x="520" y="143" fill="var(--text)" fontSize="20" textAnchor="middle">Report B</text>
      {merged && <text x="380" y="143" fill="var(--text)" fontSize="18" textAnchor="middle">Overlap</text>}
    </svg>
    <figcaption>Conceptual illustration · two observers in a harbor</figcaption>
  </figure>
}

function VisualContent({ visual, muted, covered }: { visual: Visual; muted: boolean; covered: boolean }) {
  switch (visual.kind) {
    case 'image':
      return <Photograph id={visual.id} detail={visual.detail} />
    case 'source': {
      const entry = evidence[visual.id]
      return (
        <a className="document" href={entry.url} target="_blank" rel="noreferrer">
          <span className="eyebrow">{entry.kind}</span>
          <span className="document-name">{entry.publisher}</span>
          <span className="document-title">{entry.title}</span>
          <span className="document-date">{entry.date} <span aria-hidden="true">↗</span></span>
        </a>
      )
    }
    case 'path':
      return (
        <figure className="path-diagram" aria-label={visual.labels.join(' then ')}>
          <ol>{visual.labels.map((label, index) => <li key={label}>
            {index > 0 && <span aria-hidden="true" className="diagram-arrow">→</span>}
            <span className="path-node">{label}</span>
          </li>)}</ol>
          <figcaption>Conceptual diagram</figcaption>
        </figure>
      )
    case 'pair':
      return (
        <figure className="pair-diagram" data-base-reveal={visual.baseReveal || undefined}>
          <div className="pair-columns">
            <span>{visual.left}</span><span>{visual.right}</span>
          </div>
          <figcaption>{visual.detail}</figcaption>
        </figure>
      )
    case 'detector':
      return <Detector level={visual.level} />
    case 'conditions':
      return <Condition column={visual.column} />
    case 'bases':
      return <Bases />
    case 'fusion':
      return <Fusion merged={visual.merged} />
    case 'interview':
      return <Interview key={String(muted)} />
    case 'clip':
      return <LabClip id={visual.id} muted={muted} covered={covered} />
    case 'reports':
      return <ReportComparison />
    case 'transport':
      return <TransportMap />
    case 'alerts':
      return <AlertGrid resolved={visual.resolved} />
    case 'agent-loop':
      return <AgentLoop />
    case 'quiz':
      return <Quiz />
    case 'stat':
      return <figure className="stat"><strong>{visual.value}</strong><figcaption>{visual.label}</figcaption></figure>
    case 'results':
      return (
        <figure className="result-figure">
          <ol className="results">{results.slice(0, visual.count).map(row => <li key={row.label}>
            <div className="result-labels"><span>{row.label}</span><strong>{row.value} / 300</strong></div>
            <div className="result-track">
              <meter min={0} max={300} value={row.value} aria-label={row.label + ' unsafe-task attempts'} />
            </div>
          </li>)}</ol>
          <figcaption><a href={evidence.robot.url} target="_blank" rel="noreferrer">Robocurve study · redrawn from reported counts ↗</a></figcaption>
        </figure>
      )
  }
}

export function Stage({ moment, advance, muted, covered }: { moment: Moment; advance: () => void; muted: boolean; covered: boolean }) {
  const { beat, chapter } = moment
  const visual = beat.visual
  const reflectionComma = chapter.phase === 'humanity' ? beat.title.indexOf(',') + 1 : 0
  const highlightedTitle = beat.highlight && beat.title.split(beat.highlight).map((part, index) =>
    <Fragment key={index}>{index > 0 && <mark>{beat.highlight}</mark>}{part}</Fragment>)
  // Keep comparison footage and chart rows mounted when the next beat builds on them.
  const visualKey = visual?.kind === 'image' || visual?.kind === 'clip' ? visual.id :
    visual?.kind === 'path' || visual?.kind === 'pair' || visual?.kind === 'stat' ? moment.hash : visual?.kind
  return (
    <main id="presentation-stage" className={'stage layout-' + beat.layout + (beat.black ? ' black-stage' : '')}
      tabIndex={-1} aria-label="Presentation stage"
      onClick={event => {
        const element = event.target
        if (event.detail > 1 || !(element instanceof Element) ||
            element.closest('button, a, input, iframe, video, [data-stage-interactive]') || window.getSelection()?.toString()) return
        advance()
      }}>
      <div className="stage-copy">
        {beat.label && <p className="eyebrow">{beat.label}</p>}
        <h1>{reflectionComma
          ? <>{beat.title.slice(0, reflectionComma)} <em>{beat.title.slice(reflectionComma).trim()}</em></>
          : highlightedTitle || beat.title}</h1>
        {beat.text && <p className="support">{beat.text}</p>}
      </div>
      {visual && <div className="stage-visual" data-visual={visual.kind}>
        <Fragment key={visualKey}>
          <VisualContent visual={visual} muted={muted} covered={covered} />
        </Fragment>
      </div>}
    </main>
  )
}
