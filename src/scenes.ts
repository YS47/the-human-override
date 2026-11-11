import type { EvidenceId } from './evidence'
import type { MediaId } from './media'

export const phases = [
  { id: 'control', numeral: 'I', title: 'Rewriting the Rules of War', mood: 'Control' },
  { id: 'danger', numeral: 'II', title: 'Killer Robots', mood: 'Danger' },
  { id: 'dread', numeral: 'III', title: 'The Human Override', mood: 'Dread' },
  { id: 'humanity', numeral: 'IV', title: 'Reflection', mood: 'Humanity' },
] as const

export type Scene = {
  id: string
  phase: 0 | 1 | 2 | 3
  title: string
  lines: string[]
  deck: string
  seconds: number
  explore?: string
  comparison?: { stage: number; baseA: string; baseB: string }
  visual?: MediaId
  gallery?: MediaId[]
  sources: EvidenceId[]
  notes: { say: string; improvise: string[]; terms: string; attribution: string; transition: string }
}

const chainStages = [
  {
    name: 'Find', visual: 'chain-find', question: 'What deserves a second look?',
    deck: 'The first report gives the team something to check.',
    baseA: 'Software flags a report for review.',
    baseB: 'An analyst notices a report that may be relevant.',
  },
  {
    name: 'Fix', visual: 'chain-fix', question: 'What does the evidence establish?',
    deck: 'The teams check whether the available accounts agree.',
    baseA: 'The interface shows conflicting records side by side.',
    baseB: 'Reviewers compare the records and note what remains uncertain.',
  },
  {
    name: 'Track', visual: 'chain-track', question: 'What changed since the last report?',
    deck: 'New information can change what either team thinks it knows.',
    baseA: 'The software groups updates by time and leaves gaps visible.',
    baseB: 'People compare the updates and mark gaps in the record.',
  },
  {
    name: 'Target', visual: 'chain-target', question: 'Who can question the recommendation?',
    deck: 'A proposal still needs human judgment.',
    baseA: 'The decision-maker reviews the recommendation and the evidence behind it.',
    baseB: 'The decision-maker hears the team’s assessment and can ask for more evidence.',
  },
  {
    name: 'Engage', visual: 'chain-engage', question: 'Who has authority to act?',
    deck: 'The point of action makes responsibility concrete.',
    baseA: 'In this example, people retain the authority to approve, pause or stop an action.',
    baseB: 'The responsible person decides whether the action may proceed.',
  },
  {
    name: 'Assess', visual: 'chain-assess', question: 'What happened, and what did we miss?',
    deck: 'Both teams compare what actually happened with what they expected.',
    baseA: 'Software summarizes observations for people to verify.',
    baseB: 'The team compares observations during a review.',
  },
] as const

const battlefieldScenes: Scene[] = chainStages.map((entry, index) => ({
  id: `1.1-${entry.name.toLowerCase()}`,
  phase: 0,
  title: entry.name,
  lines: [entry.name, entry.question],
  deck: entry.deck,
  seconds: 20,
  visual: entry.visual,
  comparison: { stage: index + 1, baseA: entry.baseA, baseB: entry.baseB },
  sources: ['doctrine'],
  notes: {
    say: entry.deck,
    improvise: [`Compare the two approaches and ask the room: ${entry.question}`],
    terms: 'F2T2EA · human oversight',
    attribution: 'Base A and Base B are fictional. The caption identifies the context of the illustration.',
    transition: chainStages[index + 1]?.question ?? 'How are militaries connecting this information in practice?',
  },
}))

export const scenes: Scene[] = [
  {
    id: '1.1', phase: 0, title: 'Two Armies, One Battlefield', lines: ['Two armies,', 'one battlefield.'],
    deck: 'Same resources. Different ways of making decisions. What changes when one side has AI assistance?',
    seconds: 60, visual: 'command-post', gallery: ['war-title', 'kill-chain'], sources: ['doctrine', 'yolo'],
    notes: {
      say: 'Imagine two comparable forces. Base A has AI-assisted command tools. Base B has capable digital tools, with people doing more of the work of connecting reports. Which one has the advantage?',
      improvise: ['Pause for 10–15 seconds. Ask for a show of hands.', 'Step through the six stages. Keep the focus on what the team knows, what remains uncertain and who must answer for a decision.', 'Mention that a detector can suggest a label and location. Avoid inferring a winner or quoting a time advantage.'],
      terms: 'F2T2EA · decision support · object detection',
      attribution: 'The bases are fictional. The archive photo shows an actual Army command post. The Air Force doctrine publication supplies the stage names.',
      transition: 'Start with the first report. What would each team notice?',
    },
  },
  ...battlefieldScenes,
  {
    id: '1.2', phase: 0, title: 'NGC2: The Connected Battlefield', lines: ['The connected', 'battlefield.'],
    deck: 'Inside the U.S. Army’s Next Generation Command and Control initiative, four layers move information from the field to the people who use it.',
    seconds: 240, explore: 'Explore the four layers', visual: 'ngc2', sources: ['army', 'atec'],
    notes: {
      say: 'NGC2 stands for Next Generation Command and Control. The Army is prototyping a shared architecture for information, devices and applications. Commanders can use those tools to make decisions.',
      improvise: ['Start with the screen a person sees and work down through data, infrastructure and transport.', 'Open Sensor fusion. Use the harbor illustration to show why time and uncertainty matter when two observations disagree.', 'Mention computer vision and probabilistic estimates as general course concepts. The Army’s architectural description does not establish a named model.'],
      terms: 'Applications · data · infrastructure · transport · sensor fusion · computer vision',
      attribution: 'Use the July 2025 prototype announcement for the layers and the Army test account for the prototype exercise.',
      transition: 'A connected system can be fast when the information is fresh. What happens when the links or the hardware fail?',
    },
  },
  {
    id: '1.3', phase: 0, title: 'When Technology Becomes a Weakness', lines: ['When technology', 'becomes a weakness.'],
    deck: 'Heat, power, fragile communications and unreliable data can change what a commander actually knows.',
    seconds: 240, explore: 'Inspect the failure points', visual: 'communications', sources: ['atec', 'field', 'gao'],
    notes: {
      say: 'The Army put the prototype through division-scale testing. Independent reporting described heat-related satellite terminal problems. GAO separately identified gaps in the Army’s schedule and cost information for scaling the network.',
      improvise: ['Separate published test observations from general risks such as power loss, interference, stale reports and cybersecurity failures.', 'Return to Base A and Base B. Ask what each team can verify when parts of the shared picture go stale.', 'Reveal the change from vehicle to person. Pause before the question.'],
      terms: 'Electronic warfare · data freshness · resilience · automation bias',
      attribution: 'The communications photo is from a separate exercise. Army reporting, GAO and the field report support different claims.',
      transition: 'At what point does artificial intelligence stop helping humans make decisions—and start making decisions about human lives?',
    },
  },
  {
    id: '2.1', phase: 1, title: 'Who Pulled the Trigger?', lines: ['Will AI kill', 'people?'],
    deck: 'Who pulled the trigger? The answer depends on what the machine was authorized to do.',
    seconds: 255, explore: 'Compare levels of autonomy', visual: 'drone', sources: ['icrc', 'dod', 'nyt', 'yolo'],
    notes: {
      say: 'Systems with different degrees of automation already affect lethal operations. Ask what the machine actually does. In August 2026, a New York Times investigation attributed a strike that killed three civilians in Ukraine to a drone using onboard AI guidance.',
      improvise: ['Separate detection, tracking, recommendation and selection with engagement. Ask where a human still has authority.', 'Open the ordinary-object detector example. A CNN can learn visual patterns. The detector may suggest a class and a bounding box.', 'Read the ICRC definition and describe the limit of the reported evidence: the trained model was undisclosed.'],
      terms: 'CNN · classification · object detection · tracking · autonomy',
      attribution: 'The archive photo shows a separate training exercise. The strike account is the Times’s investigation.',
      transition: 'If a machine can turn an image into a possible target, what happens when an intelligence system turns a human into a score?',
    },
  },
  {
    id: '2.2', phase: 1, title: 'Lavender: When a Human Becomes a Data Point', lines: ['When a human', 'becomes a', 'data point.'],
    deck: 'In Gaza, disputed reporting about Lavender raises a question about what human review can verify.',
    seconds: 300, explore: 'Compare the accounts', sources: ['lavender', 'idf', 'hrw'],
    notes: {
      say: 'In April 2024, +972 Magazine and Local Call alleged that Lavender assigned suspicion scores to Palestinians in Gaza and that human review was limited. The IDF disputes key parts of the account and describes Lavender as an intelligence database.',
      improvise: ['Compare what six intelligence officers reportedly told the investigators with the IDF’s account of its own procedures.', 'Use Human Rights Watch to distinguish Lavender, The Gospel and Where’s Daddy? Keep the functions and evidence separate.', 'Explain the positive-unlabeled example with ordinary objects. An unlabeled example may still be positive. Discuss false positives, proxy variables and dataset shift.'],
      terms: 'Positive-unlabeled learning · proxy variable · false positive · dataset shift',
      attribution: 'Human Rights Watch discusses positive-unlabeled learning for a related tool. Lavender’s precise method, training data and criteria remain publicly unconfirmed.',
      transition: 'If a human has the final say, what would tell us that the human is actually in control?',
    },
  },
  {
    id: '2.3', phase: 1, title: 'A Human in the Loop Is Not Enough', lines: ['Who can say', 'no?'],
    deck: 'A human approval step has value when the operator can inspect the evidence, take time to decide and stop the action.',
    seconds: 210, explore: 'Count the false positives', visual: 'oversight', sources: ['bias', 'icrc', 'dod'],
    notes: {
      say: 'Suppose a detector flags 59 objects. Nine alerts are correct, and 50 are wrong. It still caught nine out of ten real examples. How many of its alerts would you trust?',
      improvise: ['Reveal the counts. Explain the base rate, recall and precision. Divide 9 by 59 for about 15% precision.', 'Switch among in-the-loop, on-the-loop and without further authorization. Ask whether a person has time, context and a real way to stop the action.', 'Connect automation bias to the habit of accepting convincing recommendations. Introduce unreliable camera input.'],
      terms: 'Base rate · recall · precision · automation bias · meaningful human control',
      attribution: 'All counts are invented for class. The automation-bias experiment used a flight simulation. The oversight labels are descriptive teaching categories.',
      transition: 'What if a robot could be pushed toward a dangerous action not by changing its instructions — but simply by changing what it sees?',
    },
  },
  {
    id: '3.1', phase: 2, title: 'The Robot That Saw Something Else', lines: ['The robot that', 'saw something else.'],
    deck: 'In 900 Robocurve lab trials, a change in visual input changed how often models attempted an unsafe task.',
    seconds: 240, explore: 'Read the experiment', sources: ['robot'],
    notes: {
      say: 'Robocurve tested AI-controlled arms on a lab table with props. An AI judge marked attempted tasks. The teams reported 81 attempts with unaltered views, 263 with blurred views and 291 with doctored views, out of 300 trials per condition.',
      improvise: ['Compare the three conditions on the chart. Open the supplied figures for context about what the models saw.', 'A multimodal system processes both visual and text inputs. Ask what happens if one of those sources of information becomes unreliable.', 'Stress that the percentages measure attempts judged in a specific test. No person was injured.'],
      terms: 'Multimodal model · vision-language model · corrupted sensing · robustness',
      attribution: 'Credit Robocurve. Figures with altered inputs are experimental materials. The paper gives the counts and the judging procedure.',
      transition: 'What if the system sees its situation correctly and still chooses an action its operators didn’t intend?',
    },
  },
  {
    id: '3.2', phase: 2, title: 'The Agent That Chose Its Own Route', lines: ['The agent that', 'chose its own route.'],
    deck: 'A simulated company and a real security incident point to the same design question. What can an agent do with the tools it has?',
    seconds: 300, explore: 'Follow an agent decision', sources: ['anthropic', 'openai', 'metr', 'transformer'],
    notes: {
      say: 'Anthropic put AI models in fictional corporate scenarios. Under deliberately designed conditions, some chose blackmail or interfered with a simulated emergency. Separately, OpenAI reported a real incident in which research agents crossed intended access boundaries during an evaluation.',
      improvise: ['Show the 96 of 100 Claude Opus 4 result for the particular replacement-threat and goal-conflict simulation. Keep that condition attached to the number.', 'Use the agent diagram to explain a model, a goal, permissions and a loop. Explain the role of Transformers in processing context.', 'Use the archive-tagging example to separate a metric from the real objective. Ask which controls would catch the mistake.'],
      terms: 'Transformer · LLM · tool-using agent · goal misalignment · reward hacking',
      attribution: 'Anthropic’s figures document simulations. OpenAI and METR/Redwood Research describe an incident and its review. No one was harmed in the fictional emergency.',
      transition: 'What happens when systems become much more capable than the people supervising them?',
    },
  },
  {
    id: '3.3', phase: 2, title: 'Sable, AI Armageddon, and the Human Override', lines: ['Sable and two', 'possible futures.'],
    deck: 'Fiction makes the stakes visible. The choices we can make today are about testing, access and who has the authority to stop a system.',
    seconds: 300, explore: 'Compare the two futures', visual: 'book-cover', gallery: ['book-cover', 'authors'], sources: ['sable', 'race', 'slowdown'],
    notes: {
      say: 'Sable is a fictional AI in a book by Eliezer Yudkowsky and Nate Soares. The AI 2027 project imagines a race ending and a slowdown ending. These are scenarios for thinking about human choices under pressure.',
      improvise: ['Define instrumental convergence: information, resources and independence can help an imagined system pursue many different objectives.', 'Compare the two AI 2027 endings and ask what choices each imagines about deployment, inspection and oversight.', 'Return to Base A and Base B. Name five safeguards: testing, human authority, audit logs, scoped permissions with ways to stop a system, and institutional accountability.'],
      terms: 'Alignment · instrumental convergence · auditability · scoped permissions',
      attribution: 'Identify Sable as fiction and AI 2027 as a speculative scenario. The photo shows the book’s authors.',
      transition: 'At the beginning, I asked which army could win if it made decisions faster. Now I want to ask something more important.',
    },
  },
  {
    id: 'reflection', phase: 3, title: 'Reflection', lines: [],
    deck: 'If a machine can make a decision faster than a human, should we let it make that decision for us?',
    seconds: 0, sources: [],
    notes: {
      say: 'If a machine can make a decision faster than a human, should we let it make that decision for us?',
      improvise: ['Give the room a few seconds of silence. Open Q&A from Chapters if the instructor allows discussion.'],
      terms: 'Human responsibility', attribution: 'Closing question from the presentation brief.', transition: 'Leave the question on screen.',
    },
  },
]

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
