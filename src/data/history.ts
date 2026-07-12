/**
 * Documented Tombstone history for the /story page. Every entry sticks to the
 * historical record; where the legend and the record differ, both are stated
 * explicitly (that contrast is the page's whole point). No invented quotes,
 * no invented outcomes.
 */

export interface TimelineEvent {
  year: string;
  title: string;
  story: string;
}

export const timeline: TimelineEvent[] = [
  {
    year: "1877",
    title: "“All you'll find is your tombstone”",
    story:
      "Prospector Ed Schieffelin works out of Camp Huachuca, scouting Apache country alone. Soldiers warn him the only thing he'll find in those hills is his own tombstone. He finds silver instead — and names his first claim Tombstone.",
  },
  {
    year: "1879",
    title: "A town on Goose Flats",
    story:
      "The townsite is laid out on a mesa above the Tough Nut Mine and takes the name of Schieffelin's claim. Within two years, a dusty camp of tents becomes one of the largest boomtowns in the Southwest.",
  },
  {
    year: "1880",
    title: "Boom",
    story:
      "Thousands pour in. John Clum founds The Tombstone Epitaph in May — still publishing today. Saloons, theaters, churches, and an ice cream parlor line Allen Street. In October, Marshal Fred White is fatally shot by Curly Bill Brocius; White himself calls it an accident before he dies.",
  },
  {
    year: "1881",
    title: "Thirty seconds in October",
    story:
      "October 26, 1881: the Earp brothers and Doc Holliday face the Clantons and McLaurys in a vacant lot off Fremont Street, near the rear entrance of the O.K. Corral. Around thirty shots in thirty seconds. Billy Clanton and both McLaurys die; Virgil, Morgan, and Doc are wounded. Wyatt walks away untouched. A June fire had already leveled much of the business district — the town rebuilt in weeks.",
  },
  {
    year: "1882",
    title: "Vengeance and fire",
    story:
      "Virgil Earp is ambushed and maimed in December 1881; Morgan Earp is assassinated at a billiard table in March 1882. Wyatt's federal posse rides out on the Vendetta Ride, and he never stands trial in Arizona. That May, a second great fire burns the district again. Again, Tombstone rebuilds.",
  },
  {
    year: "1886",
    title: "The water wins",
    story:
      "The silver veins run deep — below the water table. When the great Grand Central pump house burns in 1886, the mines flood for good. The boom is over. Most boomtowns die here. Tombstone doesn't.",
  },
  {
    year: "1929",
    title: "Too tough to die",
    story:
      "The county seat moves to Bisbee, the kind of blow that erases towns from the map. The same year, residents stage the first Helldorado Days celebration — deciding that if the mines are gone, the story isn't. The nickname sticks: the town too tough to die.",
  },
  {
    year: "1961",
    title: "A national landmark",
    story:
      "The Tombstone Historic District is declared a National Historic Landmark — one of the best-preserved frontier townscapes in America, protected because it's real, not rebuilt.",
  },
  {
    year: "Today",
    title: "Still alive, still wild",
    story:
      "Roughly 1,400 people choose to live here. The Bird Cage never got a remodel. The Epitaph still prints. Gunfights are reenacted a few steps from where the real one happened. This isn't a theme park — it's a town that refused to become a memory.",
  },
];

export interface Character {
  id: string;
  name: string;
  lived: string;
  role: string;
  myth: string;
  record: string;
}

export const characters: Character[] = [
  {
    id: "wyatt-earp",
    name: "Wyatt Earp",
    lived: "1848–1929",
    role: "Gambler, saloon keeper, sometime lawman",
    myth: "The fearless marshal who tamed Tombstone with a six-gun and an iron stare.",
    record:
      "Wyatt held brief, mostly deputy roles in Tombstone — he made his living at the gambling tables and in the saloons. He walked out of the gunfight untouched, led a federal posse after Morgan's murder rather than wait on the courts, and left Arizona ahead of warrants. He died in Los Angeles in 1929, where early Hollywood filmmakers sought him out — which is a big part of why you know his name.",
  },
  {
    id: "doc-holliday",
    name: "Doc Holliday",
    lived: "1851–1887",
    role: "Dentist, gambler, deadly friend",
    myth: "The South's most lethal gunman, quick to kill and impossible to beat at cards.",
    record:
      "John Henry Holliday was a Georgia-born, formally trained dentist who went west because tuberculosis was killing him. His verified gunfights are far fewer than legend claims, but his loyalty to Wyatt Earp was real — he stood in the Fremont Street lot and took a bullet graze doing it. He died of his disease in bed at Glenwood Springs, Colorado, at 36.",
  },
  {
    id: "big-nose-kate",
    name: "Big Nose Kate",
    lived: "1849–1940",
    role: "Frontier businesswoman, Doc Holliday's companion",
    myth: "A footnote in Doc Holliday's story.",
    record:
      "Mary Katherine Horony was born in Hungary, crossed the frontier on her own terms, and ran her own businesses when most women couldn't hold property. Her on-and-off partnership with Doc Holliday spanned his whole western life. She outlived every gunfighter in this story by decades, dying at the Arizona Pioneers' Home in Prescott in 1940, just shy of 90.",
  },
  {
    id: "curly-bill-brocius",
    name: "Curly Bill Brocius",
    lived: "c. 1845–1882?",
    role: "Outlaw Cowboy leader",
    myth: "Shot dead by Wyatt Earp at Iron Springs during the Vendetta Ride.",
    record:
      "William 'Curly Bill' Brocius led the rustling Cowboy faction that made Cochise County dangerous. He shot Marshal Fred White in 1880 — White testified before dying that it was accidental, and Bill was acquitted. Wyatt Earp swore he killed Curly Bill at Iron Springs in 1882, but no body was ever produced and his friends insisted he'd left Arizona. His end is a genuine unsolved question of the Old West.",
  },
];
