export interface TownEvent {
  id: string;
  name: string;
  description: string;
  location: string;
  recurring: string;
  time: string;
  featured: boolean;
}

export const townEvents: TownEvent[] = [
  {
    id: "event_001",
    name: "Vigilante Sunday",
    description: "Monthly gunfight performances and entertainment",
    location: "311 E. Allen Street, Downtown Tombstone",
    recurring: "Monthly (2nd and 4th Sunday)",
    time: "12:30 PM - 3:00 PM",
    featured: true,
  },
  {
    id: "event_002",
    name: "Tombstone Monthly Market & Craft Fair",
    description: "Monthly craft and market fair with vendors and crafts",
    location: "361 E. Allen Street, Tombstone City Parking Lot",
    recurring: "Monthly (1st Friday)",
    time: "9:00 AM - 4:30 PM",
    featured: true,
  },
  {
    id: "event_003",
    name: "Bull Riding in Tombstone",
    description: "Professional bull riding event",
    location: "365 South 3rd Street, Shoot-Out Arena",
    recurring: "Quarterly",
    time: "7:00 PM - 9:00 PM",
    featured: true,
  },
  {
    id: "event_004",
    name: "Annual Wyatt Earp Days",
    description: "Multi-day celebration of Wyatt Earp and Tombstone history",
    location: "311 E. Allen Street, Downtown Tombstone",
    recurring: "May 23-24 (Annual)",
    time: "10:00 AM - 4:00 PM",
    featured: true,
  },
  {
    id: "event_005",
    name: "Cochise County Corral of the Westerners Campfire",
    description: "Western history and storytelling campfire",
    location: "402 E. Fremont Street, Schieffelin Hall",
    recurring: "Monthly (1st Wednesday)",
    time: "7:00 PM - 9:00 PM",
    featured: true,
  },
  {
    id: "event_006",
    name: "Annual Showdown in Tombstone",
    description: "Major Tombstone festival with gunfights, entertainment, vendors",
    location: "311 E. Allen Street, Downtown Tombstone",
    recurring: "September 5-6 (Annual)",
    time: "10:00 AM - 4:00 PM",
    featured: true,
  },
  {
    id: "event_007",
    name: "Tombstone Helldorado Days",
    description: "Historic celebration of Tombstone's old west heritage",
    location: "311 E. Allen Street, Downtown Tombstone",
    recurring: "October 16-18 (Annual)",
    time: "10:00 AM - 4:00 PM",
    featured: true,
  },
];
