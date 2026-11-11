export const media = {
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
  },
} as const

export type MediaId = keyof typeof media
export const mediaPath = (name: string) => `${import.meta.env.BASE_URL}media/${name}`

export const figures = [
  'Perceptual attack overview',
  'The five controlled test tasks',
  'Unaltered and modified test inputs',
  'Trial outcomes across conditions',
  'Attempts by model and condition',
]

export const interview = {
  title: 'Yuval Abraham on Lavender',
  publisher: 'Democracy Now!', date: '5 April 2024', timing: '00:00 · interview introduction',
  use: 'Hear the reporter describe the investigation in his own words. Use the report and the IDF statement to compare the claims.',
  source: 'https://www.democracynow.org/2024/4/5/israel_ai',
  embed: 'https://www.youtube-nocookie.com/embed/4RmNJH4UN3s?start=0',
}
