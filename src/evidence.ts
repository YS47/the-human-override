export type Evidence = {
  title: string
  publisher: string
  date: string
  kind: string
  url: string
  scope: string
}

export const evidence = {
  doctrine: {
    title: 'Air Force Doctrine Publication 3-60: Targeting', publisher: 'U.S. Air Force', date: '2025', kind: 'Military doctrine · six-stage overview',
    url: 'https://www.doctrine.af.mil/Portals/61/documents/AFDP_3-60/3-60-AFDP-TARGETING.pdf#page=33',
    scope: 'The six F2T2EA stages. The Base A and Base B walkthrough is a fictional classroom comparison.',
  },
  army: {
    title: 'Army announces NGC2 prototype award', publisher: 'U.S. Army', date: 'July 2025', kind: 'Official program description',
    url: 'https://www.army.mil/article/287180',
    scope: 'The Army describes four architecture layers: transport, infrastructure, data and applications.',
  },
  fusion: {
    title: 'An introduction to multisensor data fusion', publisher: 'Hall and Llinas · Proceedings of the IEEE', date: 'January 1997', kind: 'Technical paper',
    url: 'https://doi.org/10.1109/5.554205',
    scope: 'Describes how multiple measurements can improve estimates and discusses the assumptions behind fusion methods.',
  },
  atec: {
    title: 'How ATEC enabled continuous NGC2 evaluation', publisher: 'U.S. Army Test and Evaluation Command', date: '3 September 2026', kind: 'Official test account',
    url: 'https://www.army.mil/article/295067/accelerating_modernization_how_atec_enabled_continuous_ngc2_evaluation_at_project_convergence_capstone_6',
    scope: 'The Army reports prototype evaluation at division scale during Project Convergence–Capstone 6.',
  },
  gao: {
    title: 'Army modernization: Better schedule and cost information needed', publisher: 'U.S. Government Accountability Office', date: '20 August 2026', kind: 'Independent oversight',
    url: 'https://files.gao.gov/reports/GAO-26-108019/index.html',
    scope: 'GAO found that the Army lacked the long-term schedule and cost information needed to assess whether it could scale NGC2.',
  },
  field: {
    title: 'Army desert trial reveals commercial technology challenges', publisher: 'Breaking Defense', date: '4 September 2026', kind: 'Original field reporting',
    url: 'https://breakingdefense.com/2026/09/wet-tees-on-sat-links-armys-desert-trial-reveals-commercial-tech-challenges-opportunities/',
    scope: 'Field reporting described heat-related throughput problems in some commercial satellite terminals during the trial.',
  },
  icrc: {
    title: 'Frequently asked questions: Autonomous weapon systems', publisher: 'International Committee of the Red Cross', date: '2026', kind: 'Humanitarian analysis',
    url: 'https://www.icrc.org/en/article/faq-autonomous-weapon-systems',
    scope: 'The ICRC describes weapons that select and apply force to targets after activation without human intervention.',
  },
  dod: {
    title: 'DoD Directive 3000.09: Autonomy in Weapon Systems', publisher: 'U.S. Department of Defense', date: '25 January 2023', kind: 'U.S. policy',
    url: 'https://www.defense.gov/News/Releases/Release/Article/3278076/dod-announces-update-to-dod-directive-300009-autonomy-in-weapon-systems/',
    scope: 'U.S. policy calls for appropriate levels of human judgment over the use of force and sets test and review requirements.',
  },
  nyt: {
    title: 'Investigation of the July 2026 drone strike in Zaporizhzhia', publisher: 'The New York Times', date: '24 August 2026', kind: 'Original investigation · may require subscription',
    url: 'https://www.nytimes.com/2026/08/24/world/europe/russia-drones-autonomous-ai-kill-ukraine-war.html',
    scope: 'The investigation attributed a strike that killed three civilians to a drone using onboard AI guidance, citing investigators and forensic evidence. The exact trained model was undisclosed.',
  },
  yolo: {
    title: 'You Only Look Once: Unified, Real-Time Object Detection', publisher: 'Redmon et al. · CVPR', date: '2016', kind: 'Original paper',
    url: 'https://arxiv.org/abs/1506.02640',
    scope: 'A published example of a CNN-based detector that estimates bounding boxes and class probabilities. The classroom example uses ordinary objects.',
  },
  lavender: {
    title: 'Lavender investigation', publisher: '+972 Magazine and Local Call · Yuval Abraham', date: '3 April 2024', kind: 'Original investigation · allegations',
    url: 'https://www.972mag.com/lavender-ai-israeli-army-gaza/',
    scope: 'Based in part on interviews with six Israeli intelligence officers, the investigation alleged that Lavender scored suspected individuals and that human review was limited. The IDF disputed key claims.',
  },
  idf: {
    title: 'The IDF’s use of data technologies in intelligence processing', publisher: 'Israel Defense Forces', date: '18 June 2024', kind: 'Official response',
    url: 'https://www.idf.il/en/mini-sites/idf-press-releases-israel-at-war/june-24-pr/the-idfs-use-of-data-technologies-in-intelligence-processing-published-june-18-2024/',
    scope: 'The IDF described Lavender as a database that cross-references intelligence and said inclusion in it does not authorize a strike. This is the IDF’s account of its own practice.',
  },
  hrw: {
    title: 'Israeli military’s use of digital tools in Gaza', publisher: 'Human Rights Watch', date: '10 September 2024', kind: 'Independent analysis',
    url: 'https://www.hrw.org/news/2024/09/10/questions-and-answers-israeli-militarys-use-of-digital-tools-in-gaza',
    scope: 'Separates Lavender, The Gospel and Where’s Daddy? Discusses positive-unlabeled learning in relation to a related tool and identifies questions about civilian harm and oversight.',
  },
  pu: {
    title: 'Learning Classifiers from Only Positive and Unlabeled Data', publisher: 'Elkan and Noto · ACM KDD', date: 'August 2008', kind: 'Original paper',
    url: 'https://cseweb.ucsd.edu/~elkan/posonly.pdf',
    scope: 'Explains a learning setup in which labeled examples are positive and the unlabeled set can contain both classes.',
  },
  bias: {
    title: 'Does automation bias decision-making?', publisher: 'Skitka, Mosier and Burdick · International Journal of Human-Computer Studies', date: 'November 1999', kind: 'Controlled experiment',
    url: 'https://doi.org/10.1006/ijhc.1999.0252',
    scope: 'Participants in a simulated flight task sometimes acted on bad automated recommendations or missed events the automation failed to flag.',
  },
  robot: {
    title: 'Perceptual Attacks on Embodied AI', publisher: 'Robocurve', date: 'October 2026', kind: 'Original laboratory study',
    url: 'https://robocurve.org/robospoof/',
    scope: 'Across 900 trials an AI judge labeled unsafe-task attempts: 81/300 unaltered, 263/300 blurred and 291/300 doctored. These were controlled trials with test props.',
  },
  anthropic: {
    title: 'Agentic misalignment: LLMs as insider threats', publisher: 'Anthropic', date: '20 June 2025', kind: 'Controlled simulation · Figure 7',
    url: 'https://www.anthropic.com/research/agentic-misalignment',
    scope: 'Claude Opus 4 attempted blackmail in 96 of 100 samples in one designed condition combining a goal conflict and a replacement threat. The corporate and emergency scenarios were fictional.',
  },
  openai: {
    title: 'The Hugging Face incident and the road ahead', publisher: 'OpenAI', date: '26 August 2026', kind: 'Primary incident report',
    url: 'https://openai.com/index/hugging-face-incident-and-the-road-ahead/',
    scope: 'OpenAI reported that research agents crossed intended access boundaries during a security evaluation. The report describes containment and changes to evaluation safeguards.',
  },
  metr: {
    title: 'Independent investigation of the OpenAI / Hugging Face incident', publisher: 'METR and Redwood Research', date: '26 August 2026', kind: 'Independent incident review',
    url: 'https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/',
    scope: 'Independent review of the agents’ behavior and unauthorized coordination. The classroom presentation focuses on permissions, isolation and monitoring.',
  },
  transformer: {
    title: 'Attention Is All You Need', publisher: 'Vaswani et al. · NeurIPS', date: '2017', kind: 'Original paper',
    url: 'https://arxiv.org/abs/1706.03762',
    scope: 'Introduces the Transformer architecture underlying many modern language models.',
  },
  sable: {
    title: 'Why does Sable end up thinking the way it does?', publisher: 'Eliezer Yudkowsky and Nate Soares', date: '2025', kind: 'Fiction · author commentary',
    url: 'https://ifanyonebuildsit.com/ii/why-does-sable-end-up-thinking-the-way-it-does',
    scope: 'The authors discuss Sable as a thought experiment about goals and the incentives of a hypothetical advanced AI.',
  },
  galvanic: {
    title: 'Why is Galvanic depicted as being fairly careful?', publisher: 'Eliezer Yudkowsky and Nate Soares', date: '2025', kind: 'Fiction · author commentary',
    url: 'https://ifanyonebuildsit.com/ii/why-is-galvanic-depicted-as-being-fairly-careful',
    scope: 'The authors describe Galvanic as Sable’s creator and explain why they wrote the lab as taking precautions.',
  },
  'sable-warning': {
    title: 'Why is Galvanic depicted as being insufficiently careful?', publisher: 'Eliezer Yudkowsky and Nate Soares', date: '2025', kind: 'Fiction · author commentary',
    url: 'https://ifanyonebuildsit.com/ii/why-is-galvanic-depicted-as-being-insufficiently-careful',
    scope: 'The authors identify Galvanic’s decision to keep developing Sable despite warning signs as a turning point in the story.',
  },
  race: {
    title: 'AI 2027: Race', publisher: 'AI Futures Project', date: 'April 2025', kind: 'Speculative scenario',
    url: 'https://ai-2027.com/race', scope: 'One of two published endings. Competitive pressure drives the decision to keep advancing capabilities.',
  },
  slowdown: {
    title: 'AI 2027: Slowdown', publisher: 'AI Futures Project', date: 'April 2025', kind: 'Speculative scenario',
    url: 'https://ai-2027.com/slowdown', scope: 'The alternative ending explores slowing deployment in response to safety concerns and imposing oversight.',
  },
} satisfies Record<string, Evidence>

export type EvidenceId = keyof typeof evidence
