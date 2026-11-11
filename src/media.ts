type Media = {
  title: string
  alt: string
  publisher: string
  credit: string
  date: string
  source: string
  rights: string
  license?: string
  kind?: string
  file?: string
  note?: string
}

const researchFigure = (number: number, title: string, alt: string): Media => ({
  title, alt, publisher: 'Robocurve', credit: 'Christopher Leet et al. / Robocurve',
  date: 'October 2026', source: 'https://robocurve.org/robospoof/',
  rights: 'CC BY 4.0 · supplied screenshot', license: 'https://creativecommons.org/licenses/by/4.0/',
  file: 'robocurve-' + number + '.jpeg',
})

export const media = {
  'robot-1': researchFigure(1, 'Perceptual attacks on embodied AI', 'Supplied Robocurve research figure introducing the experiment'),
  'robot-2': researchFigure(2, 'The controlled test tasks', 'Supplied Robocurve figure summarizing the laboratory tasks'),
  'robot-3': researchFigure(3, 'What the models saw', 'Supplied Robocurve figure comparing unaltered, blurred and doctored footage'),
  'robot-4': researchFigure(4, 'Trial outcomes across conditions', 'Supplied Robocurve outcomes figure'),
  'robot-5': researchFigure(5, 'Attempts by model and condition', 'Supplied Robocurve per-model results figure'),
  'anthropic-7': {
    title: 'Figure 7 · Simulated blackmail rates across 16 models',
    alt: 'Anthropic Figure 7 shows blackmail attempt rates across 16 models in the goal conflict and replacement threat condition',
    publisher: 'arXiv', credit: 'Aengus Lynch et al. / Anthropic', date: 'October 2025',
    source: 'https://arxiv.org/html/2510.05179v2#S4.F7',
    rights: 'CC BY 4.0 · original figure', license: 'https://creativecommons.org/licenses/by/4.0/',
    file: 'anthropic-figure-7.png',
  },
  'gao-cover': {
    title: 'Army Modernization · GAO-26-108019',
    alt: 'Cover of the GAO report on schedule and cost information for scaling the Army battlefield network',
    publisher: 'U.S. Government Accountability Office', credit: 'U.S. Government Accountability Office', date: 'August 2026',
    source: 'https://files.gao.gov/assets/gao-26-108019.pdf',
    rights: 'Original GAO report cover · rendered from PDF',
    file: 'gao-cover.png',
  },
  'chain-find': {
    title: 'Weather observation at Rickenbacker Air National Guard Base',
    alt: 'An Air National Guard weather specialist takes an outdoor measurement',
    publisher: 'DVIDS', credit: 'Ivy Thomas / U.S. Air National Guard', date: 'March 2024',
    source: 'https://www.dvidshub.net/image/8277847/manual-weather-observation',
    rights: 'U.S. public domain · resized WebP',
    note: 'An example of collecting an observation.',
  },
  'chain-fix': {
    title: 'Command post software evaluation, Fort Bliss',
    alt: 'People at a command post software evaluation with screens in front of them',
    publisher: 'U.S. Army via Wikimedia Commons', credit: 'Devon Bistarkey / U.S. Army', date: 'November 2015',
    source: 'https://commons.wikimedia.org/wiki/File:Army_Command_Post_Computing_Environment_readies_for_NIE_16_photo_by_Devon_Bistarkey_released_to_Public_Domain.png',
    rights: 'U.S. public domain · resized WebP',
    note: 'An example of reviewing information together.',
  },
  'chain-track': {
    title: 'Tracking simulated casualties at Ivy Sting 4',
    alt: 'A soldier checks a device during a simulated casualty exercise',
    publisher: 'U.S. Army', credit: 'Pfc. Jacob Cruz / U.S. Army', date: 'February 2026',
    source: 'https://www.army.mil/article/291655/army_launches_data_operations_center_to_give_warfighters_the_decisive_edge',
    rights: 'U.S. Army photograph · resized WebP',
    note: 'The exercise used updates to coordinate care for simulated casualties.',
  },
  'chain-target': {
    title: 'Command post exercise briefing in Poland',
    alt: 'A U.S. Army officer briefs Polish military observers during an exercise',
    publisher: 'U.S. Army', credit: 'Capt. Christopher Buys / U.S. Army', date: 'February 2023',
    source: 'https://www.army.mil/article/264537/black_jack_completes_command_post_exercise_with_polish_observers',
    rights: 'U.S. Army photograph · resized WebP',
    note: 'A training briefing illustrates the role of human judgment.',
  },
  'chain-engage': {
    title: 'Simulated casualty care at Fort McCoy',
    alt: 'Soldiers take part in a casualty care exercise at Fort McCoy',
    publisher: 'U.S. Army', credit: 'Sgt. 1st Class Justin Hardin / U.S. Army', date: 'July 2024',
    source: 'https://www.army.mil/article/278845/observe_control_train_and_improve',
    rights: 'U.S. Army photograph · resized WebP',
    note: 'A training response illustrates the move from decision to action.',
  },
  'chain-assess': {
    title: 'After-action review at Fort Drum',
    alt: 'An Army sergeant leads a discussion with soldiers after an exercise',
    publisher: 'U.S. Army', credit: 'Pfc. Josue Patricio / U.S. Army', date: 'August 2020',
    source: 'https://www.army.mil/article/238869/golden_dragons_complete_squad_level_training_exercise',
    rights: 'U.S. Army photograph · resized WebP',
    note: 'The team reviews what happened during training.',
  },
  'command-post': {
    title: 'Command Post Computing Environment',
    alt: 'Two soldiers silhouetted against wall-sized command post displays',
    publisher: 'U.S. Army via Wikimedia Commons', credit: 'Dan Lafontaine / U.S. Army', date: '2017',
    source: 'https://commons.wikimedia.org/wiki/File:Command_Post_Computing_Environment_multiple_screens_Photo_US_Army_released_to_Public_Domain.jpg',
    rights: 'U.S. public domain · local WebP, resized · contextual archive photo',
  },
  ngc2: {
    title: 'NGC2 field training, Fort Carson',
    alt: 'A U.S. Army soldier checking an end-user device in a field exercise',
    publisher: 'U.S. Army', credit: 'Sgt. William Rogers / U.S. Army', date: '18 September 2025',
    source: 'https://www.army.mil/article/291655/army_launches_data_operations_center_to_give_warfighters_the_decisive_edge',
    rights: 'Official U.S. Army photograph · local WebP, resized',
  },
  communications: {
    title: 'Satellite communications during Freedom Shield',
    alt: 'A U.S. Army soldier at communications equipment during an exercise',
    publisher: 'U.S. Army via Wikimedia Commons', credit: 'Sgt. Marquis McCants / U.S. Army', date: 'March 2026',
    source: 'https://commons.wikimedia.org/wiki/File:1st_Signal_Brigade_Soldiers_at_Command_Post_Tango_(9564440).jpg',
    rights: 'U.S. public domain · local WebP, resized · separate exercise from the desert trial',
  },
  drone: {
    title: 'Unmanned aircraft, African Lion 26',
    alt: 'An unmanned aircraft on the ground during a joint training exercise',
    publisher: 'DVIDS', credit: 'Petty Officer 2nd Class Samuel Wagner / U.S. Navy', date: '28 April 2026',
    source: 'https://www.dvidshub.net/image/9653091/us-soldiers-conduct-autonomous-tactical-vehicle-live-fire-exercise-advancing-unmanned-innovation-during-african-lion-26',
    rights: 'DVIDS public-domain marking · local WebP · equipment illustration from a separate exercise',
  },
  oversight: {
    title: 'NGC2 demonstration, Washington, D.C.',
    alt: 'Army personnel look together at a display during a command system demonstration',
    publisher: 'DVIDS', credit: 'Sgt. William Rogers / U.S. Army', date: '17 March 2026',
    source: 'https://www.dvidshub.net/image/9583846/4th-infantry-division-demonstrates-ngc2-senior-army-leadership',
    rights: 'DVIDS public-domain marking · local WebP · illustrative command interface',
  },
  authors: {
    title: 'Eliezer Yudkowsky, co-author of Sable’s story',
    alt: 'Studio portrait of Eliezer Yudkowsky, co-author of If Anyone Builds It, Everyone Dies',
    publisher: 'Book media kit via Wikimedia Commons', credit: 'If Anyone Builds It, Everyone Dies media kit', date: 'c. 2023',
    source: 'https://commons.wikimedia.org/wiki/File:Eliezer_Yudkowsky_portrait,_c._2023.jpg',
    rights: 'CC0 1.0 · local WebP, resized · author portrait',
    kind: 'Author portrait',
  },
  'war-title': {
    title: 'How AI Is Transforming War',
    alt: 'The words How AI Is Transforming War over a circular title graphic',
    publisher: 'Johnny Harris on YouTube', credit: 'Johnny Harris', date: '',
    source: 'https://www.youtube.com/watch?v=geaXM1EwZlg',
    rights: 'User-supplied still from the video for classroom discussion.',
    kind: 'Video title card', file: 'war-title.png',
  },
  'kill-chain': {
    title: 'The kill chain, as shown in the video',
    alt: 'Illustrated landscape with a graphic listing Find, Fix, Target, Engage and Assess',
    publisher: 'Johnny Harris on YouTube', credit: 'Johnny Harris · The Kill Chain chapter', date: '',
    source: 'https://www.youtube.com/watch?v=geaXM1EwZlg&t=271s',
    rights: 'User-supplied still from the video for classroom discussion.',
    kind: 'Illustrated video still', file: 'kill-chain.png',
    note: 'The video graphic shows five stages. The six-stage model used in this presentation includes Track.',
  },
  'book-cover': {
    title: 'If Anyone Builds It, Everyone Dies',
    alt: 'Black and red cover of If Anyone Builds It, Everyone Dies by Eliezer Yudkowsky and Nate Soares',
    publisher: 'Little, Brown and Company', credit: 'Little, Brown and Company', date: '2025',
    source: 'https://www.hachettebookgroup.com/titles/eliezer-yudkowsky/if-anyone-builds-it-everyone-dies/9780316595667/',
    rights: 'User-supplied image of the U.S. cover for classroom discussion.',
    kind: 'Book cover', file: 'book-cover.png',
    note: 'Eliezer Yudkowsky and Nate Soares',
  },
} satisfies Record<string, Media>

export type MediaId = keyof typeof media
export const mediaPath = (name: string) => `${import.meta.env.BASE_URL}media/${name}`
export const mediaDetails = (id: MediaId): Media => media[id]
export const mediaImage = (id: MediaId) => mediaPath(mediaDetails(id).file ?? `${id}.webp`)

export const interview = {
  title: 'Yuval Abraham on Lavender',
  publisher: 'Democracy Now!', date: '5 April 2024', timing: '00:00 · interview introduction',
  use: 'Hear the reporter describe the investigation in his own words. Use the report and the IDF statement to compare the claims.',
  source: 'https://www.democracynow.org/2024/4/5/israel_ai',
  embed: 'https://www.democracynow.org/embed/story/2024/4/5/israel_ai',
}
