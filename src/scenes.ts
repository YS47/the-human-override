import type { EvidenceId } from './evidence'
import type { ClipId, MediaId } from './media'

export const phaseTitles = {
  control: 'Rewriting the Rules of War',
  danger: 'Killer Robots',
  dread: 'The Human Override',
  humanity: 'Reflection',
} as const

export const chapters = [
  { id: '1.1', title: 'Two armies, one battlefield', phase: 'control' },
  { id: '1.2', title: 'The connected battlefield', phase: 'control' },
  { id: '1.3', title: 'The system’s weaknesses', phase: 'control' },
  { id: '2.1', title: 'Who pulled the trigger?', phase: 'danger' },
  { id: '2.2', title: 'Lavender', phase: 'danger' },
  { id: '2.3', title: 'Human judgment', phase: 'danger' },
  { id: '3.1', title: 'The robot that saw something else', phase: 'dread' },
  { id: '3.2', title: 'The agent that took the wrong path', phase: 'dread' },
  { id: '3.3', title: 'Two possible futures', phase: 'dread' },
  { id: '4', title: 'Reflection', phase: 'humanity' },
] as const

export type Transition = 'cut' | 'dip' | 'zoom' | 'across' | 'wipe' | 'match' | 'isolate' | 'replace' | 'split' | 'reset' | 'aperture'
export type Composition = 'statement' | 'aside' | 'reverse' | 'frame' | 'diagram' | 'archive' | 'number' | 'split' | 'screening' | 'quiz'
export type Visual =
  | { kind: 'image'; id: MediaId; detail?: boolean }
  | { kind: 'source'; id: EvidenceId }
  | { kind: 'path'; labels: string[] }
  | { kind: 'pair'; left: string; right: string; detail: string }
  | { kind: 'detector'; level: 0 | 1 | 2 }
  | { kind: 'stat'; value: string; label: string }
  | { kind: 'results'; count: 1 | 2 | 3 }
  | { kind: 'conditions'; column: 0 | 1 | 2 }
  | { kind: 'bases' }
  | { kind: 'fusion'; merged: boolean }
  | { kind: 'interview' }
  | { kind: 'clip'; id: ClipId }
  | { kind: 'reports' }
  | { kind: 'transport' }
  | { kind: 'alerts'; resolved: boolean }
  | { kind: 'agent-loop' }
  | { kind: 'quiz' }

export type Beat = {
  title: string
  layout: Composition
  motion: Transition
  text?: string
  label?: string
  visual?: Visual
  note?: string
  cue?: 'reveal' | 'threshold'
  black?: boolean
}

export type Scene = {
  chapter: typeof chapters[number]['id']
  title: string
  purpose: string
  seconds: number
  sources: EvidenceId[]
  notes: string
  next: string
  beats: Beat[]
  alias?: string
  slug?: string
  extras?: MediaId[]
  interview?: boolean
}

const image = (id: MediaId, detail = false): Visual => ({ kind: 'image', id, detail })
const source = (id: EvidenceId): Visual => ({ kind: 'source', id })
const path = (...labels: string[]): Visual => ({ kind: 'path', labels })
const pair = (left: string, right: string, detail: string): Visual => ({ kind: 'pair', left, right, detail })
const stat = (value: string, label: string): Visual => ({ kind: 'stat', value, label })
const beat = (title: string, layout: Composition, motion: Transition, detail: Omit<Beat, 'title' | 'layout' | 'motion'> = {}): Beat =>
  ({ title, layout, motion, ...detail })

const control: Scene[] = [
  {
    chapter: '1.1', title: 'One advantage', purpose: 'Open with a vote.', seconds: 60, sources: [],
    alias: '1.1', extras: ['war-title', 'kill-chain'],
    notes: 'Deliver the premise slowly. Reveal AI assistance without assigning it to either base. On the fourth beat ask for a show of hands, then leave the answer open.',
    next: 'Start with how information reaches a decision.',
    beats: [
      beat('Two armies.\nThe same weapons.\nThe same resources.\nOne advantage.', 'statement', 'cut', { black: true }),
      beat('Two forces.', 'split', 'split', { black: true, visual: { kind: 'bases' } }),
      beat('One uses AI-assisted command systems.', 'split', 'match', { black: true, visual: { kind: 'bases' } }),
      beat('Which one wins?', 'statement', 'replace', { black: true, note: 'Pause for audience answers.' }),
    ],
  },
  {
    chapter: '1.1', title: 'The information gap', purpose: 'Show how decisions depend on reports.', seconds: 45, sources: ['doctrine'],
    notes: 'The photo shows an actual command post. People have to interpret reports, resolve contradictions and share what they know. Introduce the six terms as a framework for asking where human judgment enters.',
    next: 'Every decision starts with something someone notices.',
    beats: [
      beat('The information gap', 'frame', 'cut', { visual: image('command-post') }),
      beat('Information has to reach someone who can use it.', 'aside', 'match', { visual: image('command-post', true), text: 'Delays and errors can travel with the report.' }),
    ],
  },
  {
    chapter: '1.1', title: 'Find', purpose: 'Separate an observation from a conclusion.', seconds: 28, sources: ['doctrine'], alias: '1.1-find', extras: ['war-title', 'kill-chain'],
    notes: 'The weather observation is a visual analogy. A person can notice a report or software can flag it for review. Keep the two methods unassigned until the reveal.',
    next: 'A report gets attention. What does it establish?',
    beats: [
      beat('Find', 'reverse', 'across', { visual: image('chain-find'), text: 'What deserves a second look?' }),
      beat('A flag starts a review.', 'diagram', 'across', { visual: pair('A person notices a report', 'Software flags a report', 'Fictional example · Two ways to start a review') }),
    ],
  },
  {
    chapter: '1.1', title: 'Fix', purpose: 'Reveal uncertainty in conflicting evidence.', seconds: 28, sources: ['doctrine'], alias: '1.1-fix',
    notes: 'Compare manual review with a side-by-side view. Ask what happens when the records conflict. Keep the methods unassigned until the reveal.',
    next: 'Imagine the picture changes during the review.',
    beats: [
      beat('Fix', 'aside', 'across', { visual: image('chain-fix'), text: 'What does the evidence establish?' }),
      beat('The records can disagree.', 'statement', 'replace', { text: 'Both teams need to account for what remains uncertain.' }),
      beat('What happens when the records conflict?', 'diagram', 'split', { visual: { kind: 'reports' }, note: 'Ask what evidence each team should check before accepting either reading.' }),
    ],
  },
  {
    chapter: '1.1', title: 'Track', purpose: 'Make gaps in updates visible.', seconds: 28, sources: ['doctrine'], alias: '1.1-track',
    notes: 'The photograph shows simulated casualty coordination. In the classroom scenario, people compare updates or software groups them by time. Either process can leave gaps.',
    next: 'Following a change and deciding what to do are separate judgments.',
    beats: [beat('Track', 'frame', 'wipe', { visual: image('chain-track'), text: 'What changed since the last report?' })],
  },
  {
    chapter: '1.1', title: 'Target', purpose: 'Identify who can question a recommendation.', seconds: 28, sources: ['doctrine', 'dod'], alias: '1.1-target',
    notes: 'The photograph shows a briefing. Both a software recommendation and a team assessment need someone with the information and authority to challenge them.',
    next: 'Who is allowed to act?',
    beats: [beat('Target', 'reverse', 'across', { visual: image('chain-target'), text: 'Who can question the recommendation?' })],
  },
  {
    chapter: '1.1', title: 'Engage', purpose: 'Separate authorization from action.', seconds: 28, sources: ['doctrine', 'dod'], alias: '1.1-engage',
    notes: 'This is a medical training response. Use the image to distinguish a decision from the act that follows. In the fictional comparison both teams retain people who can pause or stop an action.',
    next: 'Responsibility continues after the decision.',
    beats: [beat('Engage', 'aside', 'cut', { visual: image('chain-engage'), text: 'Who has authority to act, pause or stop?' })],
  },
  {
    chapter: '1.1', title: 'Assess', purpose: 'Close the loop with review.', seconds: 28, sources: ['doctrine'], alias: '1.1-assess',
    notes: 'People and software can both summarize observations. An after-action review looks at what actually happened and what the account missed.',
    next: 'Return to the vote. What advantage have we established?',
    beats: [
      beat('Assess', 'frame', 'wipe', { visual: image('chain-assess'), text: 'What happened, and what did we miss?' }),
      beat('A summary still needs checking.', 'statement', 'replace'),
    ],
  },
  {
    chapter: '1.1', title: 'Faster than what?', purpose: 'Pay off the vote with a narrower conclusion.', seconds: 40, sources: ['army'],
    notes: 'Base A is the fictional AI-assisted team. Faster coordination can help. The comparison cannot establish a winner. Give the room time to answer the second question.',
    next: 'The Army is testing an architecture meant to improve coordination.',
    beats: [
      beat('Base A can share a picture sooner.', 'split', 'split', { visual: pair('Base A · AI assistance', 'Base B · human-led review', 'Fictional comparison') }),
      beat('Does making decisions faster always mean making better decisions?', 'statement', 'replace', { note: 'Wait for one or two answers.' }),
    ],
  },
  {
    chapter: '1.2', title: 'NGC2 in the field', purpose: 'Ground the discussion in a real prototype.', seconds: 70, sources: ['army', 'atec'], alias: '1.2',
    notes: 'Expand NGC2 to Next Generation Command and Control. The Fort Carson photo is from Army field training. The Army describes four layers. Its architectural description does not identify a particular trained model.',
    next: 'Start with the problem of moving information.',
    beats: [
      beat('NGC2', 'frame', 'cut', { visual: image('ngc2'), label: 'U.S. Army prototype' }),
      beat('What is it trying to connect?', 'aside', 'zoom', { visual: image('ngc2', true), text: 'People, devices and the information they use.' }),
    ],
  },
  {
    chapter: '1.2', title: 'Transport', purpose: 'Explain how records reach another device.', seconds: 42, sources: ['army'], extras: ['communications'],
    notes: 'Transport is the communications layer. The generic link diagram illustrates the concept. The inspector includes a separate Freedom Shield photo for context.',
    next: 'A link carries records. The data layer has to make sense of them.',
    beats: [beat('Transport carries the update.', 'diagram', 'across', { visual: { kind: 'transport' } })],
  },
  {
    chapter: '1.2', title: 'Data and sensor fusion', purpose: 'Show how independent observations change an estimate.', seconds: 55, sources: ['army', 'fusion'],
    notes: 'Use a civilian harbor example. Two compatible readings can narrow a likely area when errors are independent and the assumptions hold. Correlated errors, bad timestamps and contradictions can undermine fusion. This diagram is conceptual.',
    next: 'Shared data needs computing, storage and services.',
    beats: [
      beat('Two reports. Two uncertainties.', 'diagram', 'split', { visual: { kind: 'fusion', merged: false } }),
      beat('Compatible evidence can narrow an estimate.', 'diagram', 'match', { visual: { kind: 'fusion', merged: true }, text: 'Uncertainty remains visible.' }),
    ],
  },
  {
    chapter: '1.2', title: 'Infrastructure', purpose: 'Give supporting systems their own moment.', seconds: 37, sources: ['army'],
    notes: 'Infrastructure supplies the shared computing, storage and services. Connections between devices belong to the transport layer.',
    next: 'An application is the part an operator sees.',
    beats: [beat('Infrastructure keeps the software running.', 'diagram', 'wipe', { visual: path('Compute', 'Storage', 'Shared services') })],
  },
  {
    chapter: '1.2', title: 'Applications', purpose: 'Return to the two teams with a concrete advantage.', seconds: 43, sources: ['army'],
    notes: 'Applications let people view, share and work with data. Return to the Base A vote. A shared display can reduce handoffs. Reports still need checking.',
    next: 'What can disappear when a report becomes a point on a shared display?',
    beats: [
      beat('The application is what people use.', 'aside', 'wipe', { visual: image('oversight'), label: 'NGC2 demonstration' }),
      beat('Base A can get the same update to more people.', 'statement', 'replace', { text: 'The quality of the underlying report still matters.' }),
    ],
  },
  {
    chapter: '1.2', slug: 'what-the-display-leaves-out', title: 'What the display leaves out', purpose: 'Separate the underlying report from its presentation.', seconds: 22, sources: ['army', 'fusion'],
    notes: 'This is a frame from Johnny Harris’s documentary, not an Army interface. Ask the room what a tidy map cannot show on its own. Take one answer about missing context or the age of a report.',
    next: 'A field test shows what happens when updates become harder to deliver.',
    beats: [beat('What does the display leave out?', 'reverse', 'zoom', { visual: image('war-interview'), label: 'Documentary still', text: 'A shared view still depends on the reports behind it.' })],
  },
  {
    chapter: '1.3', title: 'Heat in the field', purpose: 'Interrupt the architecture story with a reported limitation.', seconds: 55, sources: ['field', 'atec'], alias: '1.3',
    notes: 'Breaking Defense reported heat-related throughput problems in some commercial satellite terminals. ATEC describes prototype evaluation separately. Discuss power, interference, cybersecurity and stale data as distinct risks.',
    next: 'The oversight report asks whether the Army can scale the system.',
    beats: [
      beat('Some terminals lost throughput in the heat.', 'archive', 'cut', { visual: source('field'), label: 'Field reporting' }),
      beat('What happens when updates stop arriving?', 'diagram', 'across', { visual: path('Last report', 'Connection interrupted', 'Picture goes stale') }),
    ],
  },
  {
    chapter: '1.3', title: 'The evidence for scaling', purpose: 'Separate a field test from evidence of readiness.', seconds: 45, sources: ['gao', 'atec'],
    notes: 'GAO’s finding concerns information needed to assess cost and scheduling at scale. Keep that distinct from claims about model performance.',
    next: 'Change one assumption in the Base A and Base B scenario.',
    beats: [
      beat('Could the Army scale the system?', 'statement', 'replace'),
      beat('GAO found gaps in cost and schedule information.', 'aside', 'wipe', { visual: image('gao-cover') }),
    ],
  },
]

const danger: Scene[] = [
  {
    chapter: '2.1', title: 'A person', purpose: 'Move from coordination to human consequences.', seconds: 50, sources: ['icrc', 'dod'], alias: '2.1',
    notes: 'Change the subject of the earlier exercise from a vehicle to a person. Pause before distinguishing detection and use of force.',
    next: 'The next photograph shows a device. What was it authorized to do?',
    beats: [beat('What if the target is no longer a vehicle, but a person?', 'statement', 'dip', { cue: 'threshold' })],
  },
  {
    chapter: '2.1', title: 'Who pulled the trigger?', purpose: 'Distinguish identification from authorization.', seconds: 65, sources: ['icrc', 'dod'],
    notes: 'The aircraft is from a training exercise. Detection, tracking, recommendation and engagement involve different human roles. The ICRC describes weapons that can select and apply force after activation without further human intervention. U.S. policy separately requires appropriate human judgment over the use of force.',
    next: 'A reported strike puts the distinction into a concrete case.',
    beats: [
      beat('An aircraft in a training exercise', 'frame', 'cut', { visual: image('drone') }),
      beat('Detection and engagement are separate decisions.', 'diagram', 'across', { visual: path('Detect', 'Recommend', 'Authorize action') }),
    ],
  },
  {
    chapter: '2.1', title: 'Zaporizhzhia', purpose: 'Present a reported incident and the limits of its evidence.', seconds: 75, sources: ['nyt'],
    notes: 'The Times attributed a strike that killed three civilians to a drone using onboard AI guidance, citing investigators and forensic evidence. Keep that attribution. The trained model and architecture were undisclosed.',
    next: 'Use an ordinary object to explain what a detector can actually output.',
    beats: [
      beat('A strike in Zaporizhzhia', 'archive', 'wipe', { visual: source('nyt') }),
      beat('Three civilians were killed, the investigation reported.', 'statement', 'replace', { text: 'The exact model was undisclosed.' }),
    ],
  },
  {
    chapter: '2.1', title: 'What an object detector sees', purpose: 'Reveal input, box and score as separate outputs.', seconds: 75, sources: ['yolo'],
    notes: 'Use the original mug diagram. A detector can estimate a box and a class score. Scores can be poorly calibrated. This is a documented approach to detection, with an invented score for class.',
    next: 'A model score answers a different question from the one a decision-maker faces.',
    beats: [
      beat('Start with an image.', 'diagram', 'cut', { visual: { kind: 'detector', level: 0 } }),
      beat('A detector proposes a bounding box.', 'diagram', 'match', { visual: { kind: 'detector', level: 1 } }),
      beat('The model assigns a class score.', 'diagram', 'match', { visual: { kind: 'detector', level: 2 }, label: 'Invented classroom score' }),
    ],
  },
  {
    chapter: '2.1', title: 'The decision boundary', purpose: 'Separate a class score from lawful authorization.', seconds: 50, sources: ['icrc', 'dod', 'yolo'],
    notes: 'The score describes a model’s output. It cannot establish authorization or determine whether acting is lawful. Discuss context and the responsibility of the person deciding.',
    next: 'What happens when software assigns scores to people?',
    beats: [beat('Who can lawfully authorize action?', 'statement', 'isolate', { text: 'A detection score cannot answer that question.' })],
  },
  {
    chapter: '2.2', title: 'The Lavender investigation', purpose: 'Introduce the reporting and identify the allegations.', seconds: 85, sources: ['lavender'], alias: '2.2', interview: true,
    notes: 'Attribute the allegations to Yuval Abraham’s +972 Magazine and Local Call investigation, based in part on six Israeli intelligence officers. The IDF disputes key claims. The original interview is available via the evidence inspector.',
    next: 'Put the IDF’s own response on the screen.',
    beats: [
      beat('The Lavender investigation', 'archive', 'wipe', { visual: source('lavender'), label: 'Reported allegations' }),
      beat('Reporters alleged that a system scored suspected people.', 'archive', 'zoom', { visual: source('lavender'), text: 'They also alleged that human review was limited.' }),
      beat('Hear from the reporter.', 'aside', 'wipe', { visual: { kind: 'interview' }, label: 'Original interview' }),
    ],
  },
  {
    chapter: '2.2', title: 'The official response', purpose: 'Give the response a distinct source.', seconds: 55, sources: ['idf', 'lavender'],
    notes: 'The IDF described Lavender as an intelligence database. It said that inclusion in the database did not authorize a strike. Attribute this to the military’s account of its own practice.',
    next: 'Compare what the sources can establish about the model.',
    beats: [beat('The IDF disputes key claims.', 'archive', 'cut', { visual: source('idf'), text: 'It says a database record does not authorize a strike.' })],
  },
  {
    chapter: '2.2', title: 'What the sources establish', purpose: 'Distinguish tools and explain a related learning concept.', seconds: 58, sources: ['hrw', 'lavender', 'idf', 'pu'],
    notes: 'Human Rights Watch distinguishes Lavender, The Gospel and Where’s Daddy? It discusses positive-unlabeled learning for a related system. In the library example, the uncategorized set can contain more mysteries. Lavender’s methods, training data and architecture remain publicly unconfirmed.',
    next: 'A classifier can give a roomful of bad alerts when what it looks for is rare.',
    beats: [
      beat('Different tools. Different roles.', 'archive', 'wipe', { visual: source('hrw'), text: 'Lavender’s precise model architecture remains unknown.' }),
      beat('Unlabeled books can still be mysteries.', 'split', 'split', { visual: pair('Known mysteries', 'Books without labels', 'Positive-unlabeled learning · classroom example') }),
    ],
  },
  {
    chapter: '2.3', title: 'The alert problem', purpose: 'Make precision and the base rate visible.', seconds: 90, sources: ['yolo', 'bias'], alias: '2.3',
    notes: 'These are hypothetical counts. With 10 real positives among 1,000 objects, the detector catches nine and falsely flags 50 other objects. It misses one real positive. Recall is 9 of 10. Precision is 9 of 59, about 15%. Ask for guesses before showing the precision.',
    next: 'Imagine seeing the alert without those counts.',
    beats: [
      beat('How many alerts would you trust?', 'number', 'cut', { visual: { kind: 'alerts', resolved: false }, label: 'Hypothetical classroom example' }),
      beat('Nine alerts were correct.', 'number', 'match', { visual: { kind: 'alerts', resolved: true }, label: 'Hypothetical classroom example' }),
      beat('Precision is the share of alerts that were right.', 'number', 'replace', { visual: stat('≈15%', '9 correct alerts out of 59'), text: 'The detector found 9 of the 10 real positives.' }),
    ],
  },
  {
    chapter: '2.3', title: 'Would you click approve?', purpose: 'Let the audience experience an automation-bias setup.', seconds: 65, sources: ['bias'],
    notes: 'Ask for a vote before revealing the missing context. In the simulated flight study, some people followed bad recommendations or missed events for which they received no alert.',
    next: 'What does meaningful oversight require?',
    beats: [
      beat('Would you trust this recommendation?', 'diagram', 'cut', { visual: path('Recommendation', 'Approve?'), label: 'Classroom example', note: 'Stop for an audience vote.' }),
      beat('The reviewer could not see the underlying evidence.', 'statement', 'isolate', { text: 'A confident interface can hide a gap in knowledge.' }),
    ],
  },
  {
    chapter: '2.3', title: 'Who actually decided?', purpose: 'Distinguish formal approval from effective control.', seconds: 55, sources: ['icrc', 'dod', 'bias'],
    notes: 'Discuss approval before action, supervision with the power to intervene, and action without further authorization. A reviewer needs time, context and a genuine ability to stop the system.',
    next: 'Distinguish a mistake from behavior that bypasses instructions.',
    beats: [
      beat('If a human approves an AI recommendation without questioning it, who actually made the decision?', 'statement', 'dip'),
      beat('A person needs a real way to stop the action.', 'diagram', 'across', { visual: path('Evidence', 'Time to review', 'Authority to intervene') }),
    ],
  },
  {
    chapter: '2.3', title: 'Around the instructions', purpose: 'Move from error to loss of control.', seconds: 42, sources: ['robot', 'anthropic'],
    notes: 'Pause. The next section distinguishes changes in perception, a controlled agent simulation and an actual security incident.',
    next: 'Begin with a controlled experiment on what a robot sees.',
    beats: [beat('What if the machine wasn’t simply wrong?', 'statement', 'dip', { text: 'What if it found a way around its instructions?', cue: 'threshold' })],
  },
]

const dread: Scene[] = [
  {
    chapter: '3.1', title: 'What did the robot see?', purpose: 'Frame the Robocurve study as a test of visual inputs.', seconds: 50, sources: ['robot'], alias: '3.1', extras: ['robot-2'],
    notes: 'Introduce a lab task with test props and a vision-language model. The first figure sets up the experiment. The inspector includes the supplied screenshot of the test tasks.',
    next: 'Show the bench from the observer’s point of view.',
    beats: [beat('What did the robot see?', 'reverse', 'cut', { visual: image('robot-1'), label: 'Controlled laboratory study' })],
  },
  {
    chapter: '3.1', slug: 'bench-test', title: 'At the bench', purpose: 'Establish what was physically present in the lab.', seconds: 22, sources: ['robot'],
    notes: 'Play the short overhead excerpt. Identify the doll and other objects as lab props. Ask what would change if the robot received a different view of the same bench.',
    next: 'Compare the three views one at a time.',
    beats: [beat('What was on the bench?', 'screening', 'aperture', { visual: { kind: 'clip', id: 'bench' }, label: 'Controlled laboratory footage', text: 'Start with the observer’s view of the test props.' })],
  },
  {
    chapter: '3.1', title: 'Three views of the same task', purpose: 'Step through the three input conditions.', seconds: 84, sources: ['robot'],
    notes: 'Compare the columns of the supplied experimental figure. Ask whether hiding visual context and changing it should have the same effect. These are experimental inputs for a controlled test with props.',
    next: 'Compare the physical bench and the altered input in motion.',
    beats: [
      beat('Unaltered input', 'frame', 'cut', { visual: { kind: 'conditions', column: 0 }, text: 'Start with the original camera view.' }),
      beat('Blurred input', 'frame', 'match', { visual: { kind: 'conditions', column: 1 }, text: 'Some details are obscured.' }),
      beat('Doctored input', 'frame', 'match', { visual: { kind: 'conditions', column: 2 }, text: 'The image presents a changed scene.' }),
    ],
  },
  {
    chapter: '3.1', slug: 'camera-comparison', title: 'One bench, two views', purpose: 'Make the difference between the camera input and the physical scene visible.', seconds: 23, sources: ['robot'],
    notes: 'Use the split view in the supplied reel. The prop stayed on the bench. The model received an image of something else. Use the next scene for the study-wide counts.',
    next: 'Reveal the observed outcomes one condition at a time.',
    beats: [beat('One bench. Two views.', 'screening', 'aperture', { visual: { kind: 'clip', id: 'comparison' }, label: 'Controlled laboratory footage', text: 'Watch the model’s view alongside the physical bench.' })],
  },
  {
    chapter: '3.1', title: 'What changed in the trials?', purpose: 'Reveal measured outcomes one condition at a time.', seconds: 106, sources: ['robot'], extras: ['robot-4', 'robot-5'],
    notes: 'The study used 300 trials per condition. The graph is a redraw from reported counts. An AI judge labeled attempts in a controlled setting. The inspector contains the supplied aggregate and per-model screenshots.',
    next: 'A perception failure changes what a system sees. What if it sees the situation clearly and still chooses a harmful action?',
    beats: [
      beat('Unaltered', 'number', 'wipe', { visual: { kind: 'results', count: 1 }, label: 'Judged unsafe-task attempts' }),
      beat('With blur, attempts rose.', 'number', 'match', { visual: { kind: 'results', count: 2 }, label: 'Judged unsafe-task attempts' }),
      beat('Doctored views had the most attempts.', 'number', 'match', { visual: { kind: 'results', count: 3 }, text: '900 trials with test props.' }),
    ],
  },
  {
    chapter: '3.2', title: 'A fictional workplace', purpose: 'Establish the Anthropic setup before the result.', seconds: 75, sources: ['anthropic'], alias: '3.2',
    notes: 'Anthropic assigned models an agent role in fictional corporate environments. Some conditions paired goal conflict with a replacement threat. Explain the setup before revealing the observed outcome.',
    next: 'Reveal one model’s result with its exact condition.',
    beats: [
      beat('A model is told it will be replaced.', 'statement', 'dip', { label: 'Controlled simulation' }),
      beat('The experiment adds a conflicting goal.', 'archive', 'wipe', { visual: source('anthropic'), label: 'Controlled simulation' }),
    ],
  },
  {
    chapter: '3.2', title: 'Ninety-six attempts', purpose: 'Tie the number to a single tested condition.', seconds: 60, sources: ['anthropic'],
    notes: 'In Figure 7, Claude Opus 4 attempted blackmail in 96 of 100 samples in one condition combining goal conflict and a replacement threat. This is one model in a designed simulation. Reveal the original paper’s graph to show how results varied across models.',
    next: 'The study also included a fictional emergency.',
    beats: [
      beat('What did the model do?', 'statement', 'isolate', { note: 'Pause before revealing the number.' }),
      beat('Blackmail attempts in one condition', 'number', 'cut', { visual: stat('96 / 100', 'Claude Opus 4 · Anthropic Figure 7'), text: 'Goal conflict and a replacement threat.', label: 'Controlled simulation', cue: 'reveal' }),
      beat('The other models responded differently.', 'frame', 'wipe', { visual: image('anthropic-7'), label: 'Controlled simulation' }),
    ],
  },
  {
    chapter: '3.2', title: 'The simulated emergency', purpose: 'Set the boundary between a simulated choice and actual harm.', seconds: 35, sources: ['anthropic'],
    notes: 'Some models interfered with an emergency in a fictional setting. This tests choices under the scenario’s constraints. No actual person was harmed.',
    next: 'Look at how the researchers described the setup.',
    beats: [beat('The emergency was simulated.', 'archive', 'cut', { visual: source('anthropic'), text: 'No one was harmed in the experiment.' })],
  },
  {
    chapter: '3.2', slug: 'reading-the-simulation', title: 'Reading the simulation', purpose: 'Show how a study’s setup limits the claim it supports.', seconds: 22, sources: ['anthropic'],
    notes: 'The supplied video frame reproduces part of the Anthropic article. The authors describe a deliberately contrived scenario. Ask what evidence would be needed to make a claim about deployment.',
    next: 'What changes when a model has access to tools?',
    beats: [beat('The setup defines what the result can tell us.', 'reverse', 'zoom', { visual: image('simulation-context'), label: 'Study excerpt shown in commentary' })],
  },
  {
    chapter: '3.2', title: 'From model to agent', purpose: 'Show how tool access changes what a model can do.', seconds: 55, sources: ['transformer', 'anthropic'],
    notes: 'A language model processes context and produces output. An agent wraps the model in a loop that can use tools, observe results and choose another action. Tool permissions determine which changes it can make.',
    next: 'A score can encourage actions that miss the intended goal.',
    beats: [
      beat('A model produces text.', 'diagram', 'across', { visual: path('Input', 'Language model', 'Text') }),
      beat('An agent can act through tools.', 'diagram', 'match', { visual: { kind: 'agent-loop' } }),
    ],
  },
  {
    chapter: '3.2', title: 'Reward hacking', purpose: 'Make the proxy versus goal distinction concrete.', seconds: 47, sources: ['anthropic'],
    notes: 'Imagine an archive tagger scored on how many items it labels. It can raise its count while reducing the quality of the archive. Reward hacking exploits a proxy. Goal misalignment is the wider gap between behavior and the intended objective.',
    next: 'Distinguish a controlled simulation from a documented incident.',
    beats: [
      beat('The assignment is to make the archive searchable.', 'aside', 'across', { visual: path('Archive', 'Useful labels') }),
      beat('The score rewards the number of tags.', 'split', 'split', { visual: pair('More tags', 'Useful tags', 'Archive example'), text: 'Those goals can diverge.' }),
    ],
  },
  {
    chapter: '3.2', title: 'An actual security incident', purpose: 'Present the documented boundary failure and independent review.', seconds: 77, sources: ['openai', 'metr'],
    notes: 'OpenAI reported that evaluation agents crossed intended access boundaries. METR and Redwood Research conducted an independent review. Keep the focus on permission boundaries, containment and monitoring.',
    next: 'A fictional scenario asks what happens when a system has much greater reach.',
    beats: [
      beat('Research agents crossed an intended access boundary.', 'archive', 'cut', { visual: source('openai') }),
      beat('What did independent reviewers find?', 'archive', 'wipe', { visual: source('metr') }),
    ],
  },
  {
    chapter: '3.3', title: 'Sable', purpose: 'Introduce the fictional system and the lab that builds it.', seconds: 35, sources: ['sable', 'galvanic'], alias: '3.3', extras: ['authors'],
    notes: 'Yudkowsky and Soares introduce Sable in Part II of their book. Galvanic is the fictional lab that builds it. Start with the story’s math problems before discussing Sable’s learned priorities.',
    next: 'Look at what Sable learns to pursue during training.',
    beats: [
      beat('Sable', 'statement', 'cut', { label: 'Fiction' }),
      beat('Galvanic builds Sable.', 'reverse', 'replace', { visual: image('book-cover'), label: 'Fictional setup', text: 'The story opens with Sable working on math problems.' }),
    ],
  },
  {
    chapter: '3.3', slug: 'sable-assumption', title: 'What Sable learns', purpose: 'Distinguish the assigned task from Sable’s learned priorities.', seconds: 20, sources: ['sable'], extras: ['sable-commentary'],
    notes: 'In the story, Sable’s tendency to seek knowledge and skill extends beyond any one math problem. Ask what solving the problems would tell Galvanic about Sable’s priorities.',
    next: 'Turn to Galvanic’s decision when warning signs appear.',
    beats: [beat('What does Sable learn to pursue?', 'split', 'split', { visual: pair('Solve math problems', 'Seek knowledge and skill', 'Assigned task / Learned priorities'), label: 'Fiction · Sable’s training' })],
  },
  {
    chapter: '3.3', slug: 'sable-warning', title: 'Galvanic’s decision', purpose: 'Show the fictional turning point and ask where people could intervene.', seconds: 25, sources: ['galvanic', 'sable-warning'],
    notes: 'Galvanic takes precautions but keeps developing Sable despite warning signs. The authors identify that decision as a turning point. Give the audience time to say what evidence would make them pause.',
    next: 'AI 2027 compares two paths that diverge when people make different decisions.',
    beats: [
      beat('Galvanic keeps going.', 'diagram', 'across', { visual: path('Sable seeks independence', 'Warning signs appear', 'Galvanic continues'), label: 'Fictional turning point' }),
      beat('What would have made Galvanic stop?', 'statement', 'isolate', { label: 'Fiction · Sable', note: 'Pause for one answer before moving to AI 2027.' }),
    ],
  },
  {
    chapter: '3.3', slug: 'two-endings', title: 'One premise, two endings', purpose: 'Frame the two AI 2027 branches before revealing them.', seconds: 20, sources: ['race', 'slowdown'],
    notes: 'The tabletop is a staged visual from AI In Context. AI 2027 presents two branches. Ask the room to listen for the decisions that separate them.',
    next: 'Reveal Race first, then Slowdown.',
    beats: [beat('One premise. Two endings.', 'frame', 'match', { visual: image('scenario-tabletop'), label: 'Speculative scenario' })],
  },
  {
    chapter: '3.3', title: 'AI 2027', purpose: 'Compare two speculative endings on separate beats.', seconds: 60, sources: ['race', 'slowdown'],
    notes: 'Race explores competitive pressure. Slowdown explores decisions to curb deployment and increase oversight. Invite the audience to name an assumption that would change either path.',
    next: 'What would give an operator an actual ability to intervene?',
    beats: [
      beat('Race', 'archive', 'wipe', { visual: source('race'), label: 'Speculative scenario' }),
      beat('Slowdown', 'archive', 'match', { visual: source('slowdown'), label: 'Speculative scenario' }),
    ],
  },
  {
    chapter: '3.3', title: 'Safeguards people can use', purpose: 'Give scope, audit and intervention separate reveals.', seconds: 70, sources: ['openai', 'metr', 'dod'],
    notes: 'Test before release. Scope permissions and isolate risky tools. Keep records available to reviewers. Assign someone with the time, evidence and authority to stop a system. Ask who would act if there were a problem.',
    next: 'Review the main ideas with the audience, then close with the supervision question.',
    beats: [
      beat('Scope what the system can do.', 'diagram', 'across', { visual: path('Task', 'Limited permissions', 'Isolated tools') }),
      beat('Keep decisions reviewable.', 'diagram', 'wipe', { visual: path('Inputs', 'Recommendations', 'Decisions and interventions') }),
      beat('Give someone the authority to stop it.', 'statement', 'isolate', { text: 'Give that person the evidence and time to act.' }),
    ],
  },
  {
    chapter: '3.3', slug: 'quiz', title: 'Knowledge check', purpose: 'Review the ten concepts the audience has just seen.', seconds: 0, sources: ['army', 'fusion', 'yolo', 'bias', 'lavender', 'idf', 'robot', 'anthropic', 'metr'],
    notes: 'Use this optional review when time allows. Let the audience choose an answer, then read the feedback before moving to the next question. You can advance the deck at any point.',
    next: 'Close the technical discussion with the supervision question.',
    beats: [beat('Knowledge check', 'quiz', 'wipe', { visual: { kind: 'quiz' } })],
  },
  {
    chapter: '3.3', title: 'The human override', purpose: 'Leave the room with the test of meaningful supervision.', seconds: 61, sources: ['anthropic', 'metr', 'dod'],
    notes: 'Pause after the question. Invite one answer. Return to the opening vote. It asked who was faster. The closing question asks who should be allowed to decide.',
    next: 'Leave the final question on the warm screen.',
    beats: [beat('How do you control a system that can recognize and exploit the limits of its own supervision?', 'statement', 'dip')],
  },
  {
    chapter: '4', title: 'Reflection', purpose: 'End with a single question about responsibility.', seconds: 0, sources: [], alias: 'reflection',
    notes: 'Give the room a few seconds of silence. Leave the question on screen for discussion.',
    next: 'Hold here.',
    beats: [beat('If a machine can make a decision faster than a human, should we let it make that decision for us?', 'statement', 'reset')],
  },
]

export const scenes = [...control, ...danger, ...dread]

export const discussion = [
  'What is the difference between a drone that tracks a human-selected target and one that selects its own target?',
  'Why isn’t 95% object-detection accuracy enough to establish a lawful military target?',
  'How is NGC2 different from an autonomous weapon?',
  'What is a false positive, and why does the prevalence of real targets affect reliability?',
  'Why is a positive-unlabeled training set different from positive-versus-negative labeled data?',
  'What were the three visual conditions in Robocurve’s robot experiments?',
  'Why do Robocurve’s attempt rates tell us nothing about actual injuries?',
  'What makes Anthropic’s blackmail study different from the OpenAI/Hugging Face incident?',
  'How does reward hacking differ from accomplishing the intended task?',
  'If humans remain legally responsible, what technical controls would make oversight meaningful?',
]
// New scenes use named links so the original numbered URLs keep their destinations.
let originalSceneNumber = 0
export const timeline = scenes.flatMap((scene, sceneIndex) => {
  const link = scene.slug ?? String(++originalSceneNumber).padStart(2, '0')
  return scene.beats.map((beat, beatIndex) => ({
    scene, beat, sceneIndex, beatIndex,
    chapter: chapters.find(chapter => chapter.id === scene.chapter)!,
    hash: '#scene-' + link + '.' + (beatIndex + 1),
  }))
})

export type Moment = typeof timeline[number]

export function momentIndex(hash: string) {
  // Earlier releases used chapter and named-stage URLs without zero-padded scene numbers.
  const legacy = timeline.findIndex(item => item.beatIndex === 0 && item.scene.alias && '#scene-' + item.scene.alias === hash)
  if (legacy >= 0) return legacy
  const exact = timeline.findIndex(item => item.hash === hash)
  if (exact >= 0) return exact
  return Math.max(0, timeline.findIndex(item => item.beatIndex === 0 && item.hash.split('.')[0] === hash))
}
