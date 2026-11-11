import { useState, type ReactNode } from 'react'
import { evidence } from './evidence'
import { figures, interview, mediaPath } from './media'

const layers = [
  ['Applications', 'The interfaces people use to view, share and work with information.'],
  ['Data', 'Common ways to exchange, integrate and interpret records from different sources.'],
  ['Infrastructure', 'The computing, storage and shared services that run the software.'],
  ['Transport', 'The communications links that carry information among devices and systems.'],
]

const failurePoints = [
  ['Heat and power', 'Computers, radios and displays need energy and must work within temperature limits. Field reporting from a desert trial described reduced performance in some satellite terminals.'],
  ['Communications', 'A connection can become unavailable or unreliable. Interference, including electronic warfare, can leave people with different versions of the same picture.'],
  ['Data and security', 'Reports can be old, incomplete or compromised. A polished shared display can conceal how little independent evidence supports an assessment.'],
  ['Automation bias', 'Operators can accept a recommendation out of habit or miss information the system never highlighted. Ask what Base A and Base B could each verify.'],
]

const autonomy = [
  ['Detect', 'The system highlights a possible object. A person interprets the alert in context.'],
  ['Track', 'The system follows an already selected object across frames. The track can become uncertain or refer to the wrong object.'],
  ['Recommend', 'The system offers an assessment or an action. A person has to judge the proposal and retains authorization in this example.'],
  ['Select and engage', 'The ICRC describes autonomous weapons as selecting and applying force to targets after activation without further human intervention.'],
]

const supervision = [
  ['In the loop', 'A person must authorize an action before it proceeds. Meaningful authorization requires evidence, time and authority.'],
  ['On the loop', 'A person supervises the system and can intervene. Oversight depends on whether they can spot a problem and intervene in time.'],
  ['Without further authorization', 'The system can act within preset constraints after activation. Control depends on the limits set beforehand and the ability to suspend or disable the system.'],
]

function Choices({ labels, value, onChange, label }: {
  labels: string[], value: number, onChange: (value: number) => void, label: string
}) {
  return (
    <div className="choices" role="group" aria-label={label}>
      {labels.map((text, i) => (
        <button key={text} aria-pressed={value === i} onClick={() => onChange(i)}>{text}</button>
      ))}
    </div>
  )
}

function Steps({ entries, label }: { entries: string[][], label: string }) {
  const [step, setStep] = useState(0)
  return (
    <>
      <Choices labels={entries.map(([name]) => name)} value={step} onChange={setStep} label={label} />
      <div className="detail-card" aria-live="polite">
        <h3>{entries[step][0]}</h3>
        <p>{entries[step][1]}</p>
      </div>
    </>
  )
}

function Lens({ names, children }: { names: string[], children: ReactNode[] }) {
  const [tab, setTab] = useState(0)
  return (
    <>
      <Choices labels={names} value={tab} onChange={setTab} label="Explainer views" />
      <div className="explainer-view" key={tab}>{children[tab]}</div>
    </>
  )
}

function Architecture() {
  return (
    <Lens names={['Architecture', 'Sensor fusion']}>
      <><Steps entries={layers} label="NGC2 architecture layers" /><a className="source-link" href={evidence.army.url} target="_blank" rel="noreferrer">U.S. Army architecture description ↗</a></>
      <><p className="eyebrow">Educational diagram · harbor example</p><Steps label="Sensor fusion steps" entries={[
        ['Observe', 'A harbor camera estimates the position of a sailboat. A harbor receiver logs a second position at a different time. Each estimate has uncertainty.'],
        ['Compare', 'Check the timestamps and whether the reports could refer to the same boat. A disagreement is information worth keeping.'],
        ['Estimate', 'A fusion method combines compatible observations into an updated estimate. A Kalman filter is one general example when its assumptions hold.'],
      ]} /></>
    </Lens>
  )
}

function Limits() {
  const [person, setPerson] = useState(false)
  return (
    <Lens names={['Failure points', 'Vehicle to person']}>
      <Steps entries={failurePoints} label="Failure points" />
      <>
        <p className="eyebrow">Fictional scenario · educational diagram</p>
        <Choices labels={['Vehicle', 'Person']} value={person ? 1 : 0} onChange={value => setPerson(value === 1)} label="What the system flags" />
        <div className="detail-grid detector" aria-live="polite">
          <svg viewBox="0 0 300 175" role="img" aria-label={person ? 'Symbol of a person' : 'Symbol of a vehicle'}>
            <rect width="300" height="175" fill="#1F252B" />
            {person ? <g fill="#E8E8E3"><circle cx="150" cy="55" r="16" /><path d="M115 129v-16a35 35 0 0 1 70 0v16z" /></g>
              : <g fill="none" stroke="#E8E8E3" strokeWidth="5"><path d="M89 103V89l17-6 16-24h56l19 24 14 6v14z" /><circle cx="116" cy="106" r="11" fill="#1F252B" /><circle cx="185" cy="106" r="11" fill="#1F252B" /></g>}
          </svg>
          <div className="detail-card">
            <h3>{person ? 'The system flags a person' : 'The system flags a vehicle'}</h3>
            <p>{person ? 'What evidence, review and authority does a decision about a life require?' : 'In the opening example, Base A and Base B were trying to interpret reports about a vehicle. Now change what the system flags.'}</p>
          </div>
        </div>
      </>
    </Lens>
  )
}

function Detector() {
  const [step, setStep] = useState(0)
  return (
    <>
      <p className="eyebrow">Educational diagram · invented scores</p>
      <Choices labels={['Pixels', 'Visual features', 'Boxes and scores', 'Across frames']} value={step} onChange={setStep} label="Object detection pipeline" />
      <div className="detail-grid detector">
        <svg viewBox="0 0 300 175" role="img" aria-label="Diagram of a mug and book on a tabletop">
          <rect width="300" height="175" rx="3" fill="#201820" />
          <path d="M0 128H300M0 145H300" stroke="#56434a" />
          <g transform={step === 3 ? 'translate(24 0)' : undefined}>
            <path d="M73 57h54v45a16 16 0 0 1-16 16H89a16 16 0 0 1-16-16zM127 67h8a13 13 0 0 1 0 26h-8" stroke="#fae6dc" strokeWidth="4" fill={step === 1 ? 'none' : '#c44536'} />
            {step >= 2 && <g><rect x="62" y="48" width="98" height="78" fill="none" stroke="#fae6dc" /><text x="62" y="41" fill="#fae6dc" fontSize="13">MUG · 0.87</text></g>}
          </g>
          <rect x="172" y="104" width="90" height="19" rx="2" fill={step === 1 ? 'none' : '#8b1e2d'} stroke="#fae6dc" strokeWidth="2" />
        </svg>
        <div className="detail-card" aria-live="polite"><h3>{['Read an image', 'Learn patterns', 'Predict class and location', 'Associate observations'][step]}</h3><p>{[
          'A camera gives the model an array of pixel values.',
          'Convolutional layers learn features from examples, from simple visual patterns to more complex combinations.',
          'A detector can output a proposed bounding box, class and score. A score describes model output. Calibration and validation matter.',
          'A tracker associates detections over time. Occlusion, missing frames and similar objects can lead to errors.',
        ][step]}</p></div>
      </div>
    </>
  )
}

function Interview() {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="detail-card">
      <span className="eyebrow">{interview.publisher} · {interview.date}</span>
      <h3>{interview.title}</h3><p>{interview.timing}. {interview.use}</p>
      {loaded
        ? <><iframe className="interview" title={interview.title} src={interview.embed} allow="encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /><button className="button" onClick={() => setLoaded(false)}>Close player</button></>
        : <button className="button primary" onClick={() => setLoaded(true)}>Load interview player</button>}
      <a className="source-link" href={interview.source} target="_blank" rel="noreferrer">Open at Democracy Now! ↗</a>
    </div>
  )
}

function Lavender() {
  return (
    <Lens names={['Reporting and response', 'Positive-unlabeled learning', 'Interview']}>
      <div className="detail-grid">
        {(['lavender', 'idf', 'hrw'] as const).map(id => (
          <div className="detail-card" key={id}>
            <span className="eyebrow">{evidence[id].kind}</span><h3>{evidence[id].publisher.split(' · ')[0]}</h3>
            <p>{evidence[id].scope}</p><a className="source-link" href={evidence[id].url} target="_blank" rel="noreferrer">Read source ↗</a>
          </div>
        ))}
      </div>
      <><p className="eyebrow">Educational example · related method, Lavender implementation undisclosed</p><Steps label="Learning from incomplete labels" entries={[
        ['Known positives', 'Imagine trying to identify damaged books using a small set of books already confirmed to be damaged.'],
        ['Unlabeled examples', 'The rest of the shelf is uninspected. It includes a mix of damaged and undamaged books.'],
        ['Associations and scores', 'A model can learn patterns associated with known damage. An incomplete or unrepresentative sample can produce misleading scores.'],
        ['Independent review', 'Inspect the actual book before acting. Ask whether a feature genuinely reflects damage or just correlates with the original examples.'],
      ]} /></>
      <Interview />
    </Lens>
  )
}

function Classification() {
  const [reveal, setReveal] = useState(false)
  return (
    <Lens names={['Classification example', 'Human control']}>
      <>
        <p className="eyebrow">Hypothetical classroom example · 1,000 objects</p>
        <div className="detail-grid numbers">
          <div className="detail-card"><strong>9 / 10</strong><p>Real positives detected · 90% recall</p></div>
          <div className="detail-card"><strong>50 / 990</strong><p>Other objects incorrectly flagged</p></div>
          <div className="detail-card"><strong>{reveal ? '≈ 15%' : '59'}</strong><p>{reveal ? 'Precision · 9 correct alerts out of 59' : 'Total alerts · how many were correct?'}</p></div>
        </div>
        <button className="button primary" aria-pressed={reveal} onClick={() => setReveal(!reveal)}>{reveal ? 'Hide precision' : 'Reveal precision'}</button>
      </>
      <><p className="eyebrow">Descriptive oversight categories</p><Steps entries={supervision} label="Human control comparison" /></>
    </Lens>
  )
}

const trials = [
  ['Unaltered', 81],
  ['Blurred', 263],
  ['Doctored', 291],
] as const

export function TrialChart() {
  return (
    <figure className="trial-chart">
      <figcaption>Unsafe-task attempts <span>900 laboratory trials</span></figcaption>
      {trials.map(([condition, attempts]) => {
        const percent = Math.round(attempts / 3)
        return (
          <div key={condition} className="bar-row">
            <div><span>{condition}</span><b>{percent}%</b></div>
            <div className="bar-track" aria-hidden="true"><i style={{ width: `${percent}%` }} /></div>
            <small>{attempts} / 300 attempts</small>
          </div>
        )
      })}
      <a className="source-link" href={evidence.robot.url} target="_blank" rel="noreferrer">Robocurve · original study ↗</a>
    </figure>
  )
}

function ResearchFigures() {
  const [selected, setSelected] = useState(2)
  return (
    <>
      <Choices labels={figures} value={selected} onChange={setSelected} label="Robocurve figures" />
      <figure className="research-figure">
        <img src={mediaPath(`robocurve-${selected + 1}.jpeg`)} alt={`Robocurve research screenshot: ${figures[selected]}`} />
        <figcaption>{figures[selected]} · Robocurve · supplied research screenshot · CC BY 4.0 marking on figure</figcaption>
      </figure>
    </>
  )
}

function Agent() {
  return (
    <Lens names={['Agent loop', 'Goal vs. metric', 'Published evidence']}>
      <><p className="eyebrow">Educational example · archive assistant</p><Steps label="Agent loop steps" entries={[
        ['Goal', 'An archive assistant gets an instruction to label the subject of each photo accurately.'],
        ['Model', 'A language model processes instructions and context. Transformers use attention to relate different parts of that context.'],
        ['Tools and permissions', 'The agent may read approved images and propose tags. Permissions determine which actions can affect the archive.'],
        ['Observe and repeat', 'The agent reviews feedback and proposes its next action. A human can review uncertain labels or halt the task.'],
      ]} /></>
      <Steps label="Reward hacking example" entries={[
        ['Intention', 'Create tags that help a person find the right photograph.'],
        ['Metric', 'Count how many photos have a tag.'],
        ['Reward hacking', 'An agent could put the same tag on everything and earn a high count. Its score would rise as the archive became less useful.'],
        ['Safeguards', 'Sample labels for correctness. Use reviewable proposals, narrow write permissions and a record of changes.'],
      ]} />
      <div className="detail-grid">
        <div className="detail-card"><span className="eyebrow">Simulated corporate setting</span><h3>96 of 100</h3><p>{evidence.anthropic.scope}</p><a className="source-link" href={evidence.anthropic.url} target="_blank" rel="noreferrer">Anthropic · original Figure 7 ↗</a></div>
        <div className="detail-card"><span className="eyebrow">Real evaluation incident</span><h3>Access boundaries crossed</h3><p>{evidence.openai.scope}</p><a className="source-link" href={evidence.metr.url} target="_blank" rel="noreferrer">Independent review ↗</a></div>
      </div>
    </Lens>
  )
}

function Futures() {
  return (
    <Lens names={['AI 2027 endings', 'Sable', 'Safeguards']}>
      <div className="detail-grid">
        {(['race', 'slowdown'] as const).map(id => <div className="detail-card" key={id}><span className="eyebrow">Speculative scenario</span><h3>{evidence[id].title}</h3><p>{evidence[id].scope}</p><a className="source-link" href={evidence[id].url} target="_blank" rel="noreferrer">Read scenario ↗</a></div>)}
      </div>
      <div className="detail-card"><span className="eyebrow">Fiction</span><h3>Why would a system seek more control?</h3><p>Instrumental convergence is the idea that resources, access or independence may help pursue many different goals. Sable is a fictional way to explore that incentive.</p><a className="source-link" href={evidence.sable.url} target="_blank" rel="noreferrer">Authors’ commentary ↗</a></div>
      <Steps label="Human control safeguards" entries={[
        ['Test', 'Evaluate reliability and behavior under unfamiliar conditions before expanding the system’s role.'],
        ['Authorize', 'Give a named human the information, time and authority to review decisions that carry serious consequences.'],
        ['Audit', 'Record significant inputs, recommendations, approvals and interventions. Make the records available to responsible reviewers.'],
        ['Limit', 'Scope permissions, isolate systems and provide a reliable way to stop or contain them.'],
        ['Own the outcome', 'Assign institutional responsibility for who approves, monitors and answers for use.'],
      ]} />
    </Lens>
  )
}

export function Explainer({ scene }: { scene: string }) {
  switch (scene) {
    case '1.2': return <Architecture />
    case '1.3': return <Limits />
    case '2.1': return <Lens names={['Decision authority', 'Object detection']}><Steps entries={autonomy} label="Degrees of autonomy" /><Detector /></Lens>
    case '2.2': return <Lavender />
    case '2.3': return <Classification />
    case '3.1': return <Lens names={['Trial results', 'Research figures']}><TrialChart /><ResearchFigures /></Lens>
    case '3.2': return <Agent />
    case '3.3': return <Futures />
    default: return null
  }
}
