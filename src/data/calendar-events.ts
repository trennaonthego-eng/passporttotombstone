/**
 * Dated Tombstone event calendar (provided by Trenna, 2026-07-11).
 * Event schedules and venues are subject to change — the page displays a
 * verify-before-you-go disclaimer. ISO timestamps use -07:00 (Arizona is on
 * MST year-round, no DST).
 */

export interface CalendarEvent {
  name: string;
  month: string; // grouping header, e.g. "July 2026"
  dateLabel: string; // "July 12" or "July 23–26"
  timeLabel: string;
  venue: string;
  address: string;
  startIso: string;
  endIso: string;
}

const DOWNTOWN = { venue: "Downtown Tombstone", address: "311 E. Allen Street, Tombstone, AZ 85638" };
const AUTO_CORRAL = { venue: "Tombstone City Parking Lot – Auto Corral", address: "361 E. Allen Street, Tombstone, AZ 85638" };
const SHOOTOUT_ARENA = { venue: "Shoot-Out Arena", address: "365 South 3rd Street, Tombstone, AZ 85638" };
const SCHIEFFELIN_HALL = { venue: "Schieffelin Hall", address: "402 E. Fremont Street, Tombstone, AZ 85638" };

export const calendarEvents: CalendarEvent[] = [
  { name: "Vigilante Sunday", month: "July 2026", dateLabel: "July 12", timeLabel: "12:30 PM – 3:00 PM", ...DOWNTOWN, startIso: "2026-07-12T12:30:00-07:00", endIso: "2026-07-12T15:00:00-07:00" },
  { name: "Tombstone's Weekend of the Cowboy", month: "July 2026", dateLabel: "July 23–26", timeLabel: "Starts 5:00 PM Thursday, ends 5:00 PM Sunday", ...DOWNTOWN, startIso: "2026-07-23T17:00:00-07:00", endIso: "2026-07-26T17:00:00-07:00" },
  { name: "Tombstone Monthly Market", month: "July 2026", dateLabel: "July 24–26", timeLabel: "9:00 AM – 4:30 PM", ...AUTO_CORRAL, startIso: "2026-07-24T09:00:00-07:00", endIso: "2026-07-26T16:30:00-07:00" },
  { name: "The Brady Seals Band Concert", month: "July 2026", dateLabel: "July 24", timeLabel: "6:00 PM – 9:30 PM", ...SHOOTOUT_ARENA, startIso: "2026-07-24T18:00:00-07:00", endIso: "2026-07-24T21:30:00-07:00" },
  { name: "Bull Riding in Tombstone", month: "July 2026", dateLabel: "July 25", timeLabel: "7:00 PM – 9:00 PM", ...SHOOTOUT_ARENA, startIso: "2026-07-25T19:00:00-07:00", endIso: "2026-07-25T21:00:00-07:00" },
  { name: "Vigilante Sunday", month: "July 2026", dateLabel: "July 26", timeLabel: "12:30 PM – 3:00 PM", ...DOWNTOWN, startIso: "2026-07-26T12:30:00-07:00", endIso: "2026-07-26T15:00:00-07:00" },
  { name: "Tombstone Monthly Market & Craft Fair", month: "August 2026", dateLabel: "August 1", timeLabel: "9:00 AM – 4:30 PM", ...AUTO_CORRAL, startIso: "2026-08-01T09:00:00-07:00", endIso: "2026-08-01T16:30:00-07:00" },
  { name: "Cochise County Corral of the Westerners Campfire", month: "August 2026", dateLabel: "August 6", timeLabel: "7:00 PM – 9:00 PM", ...SCHIEFFELIN_HALL, startIso: "2026-08-06T19:00:00-07:00", endIso: "2026-08-06T21:00:00-07:00" },
  { name: "Vigilante Sunday", month: "August 2026", dateLabel: "August 9", timeLabel: "12:00 PM – 3:00 PM", ...DOWNTOWN, startIso: "2026-08-09T12:00:00-07:00", endIso: "2026-08-09T15:00:00-07:00" },
  { name: "Vigilante Sunday", month: "August 2026", dateLabel: "August 23", timeLabel: "12:30 PM – 3:00 PM", ...DOWNTOWN, startIso: "2026-08-23T12:30:00-07:00", endIso: "2026-08-23T15:00:00-07:00" },
  { name: "Cochise County Corral of the Westerners Campfire", month: "September 2026", dateLabel: "September 3", timeLabel: "7:00 PM – 9:00 PM", ...SCHIEFFELIN_HALL, startIso: "2026-09-03T19:00:00-07:00", endIso: "2026-09-03T21:00:00-07:00" },
  { name: "Tombstone Monthly Market & Craft Fair", month: "September 2026", dateLabel: "September 5–6", timeLabel: "9:00 AM – 4:30 PM", ...AUTO_CORRAL, startIso: "2026-09-05T09:00:00-07:00", endIso: "2026-09-06T16:30:00-07:00" },
  { name: "Annual Showdown in Tombstone 2026", month: "September 2026", dateLabel: "September 5–6", timeLabel: "10:00 AM – 4:00 PM", ...DOWNTOWN, startIso: "2026-09-05T10:00:00-07:00", endIso: "2026-09-06T16:00:00-07:00" },
  { name: "Vigilante Sunday", month: "September 2026", dateLabel: "September 13", timeLabel: "12:30 PM – 3:00 PM", ...DOWNTOWN, startIso: "2026-09-13T12:30:00-07:00", endIso: "2026-09-13T15:00:00-07:00" },
  { name: "Vigilante Sunday", month: "September 2026", dateLabel: "September 27", timeLabel: "12:30 PM – 3:00 PM", ...DOWNTOWN, startIso: "2026-09-27T12:30:00-07:00", endIso: "2026-09-27T15:00:00-07:00" },
  { name: "Cochise County Corral of the Westerners Campfire", month: "October 2026", dateLabel: "October 1", timeLabel: "7:00 PM – 9:00 PM", ...SCHIEFFELIN_HALL, startIso: "2026-10-01T19:00:00-07:00", endIso: "2026-10-01T21:00:00-07:00" },
  { name: "Live to Ride", month: "October 2026", dateLabel: "October 2–4", timeLabel: "Starts 12:00 PM Friday, ends 5:00 PM Sunday", ...DOWNTOWN, startIso: "2026-10-02T12:00:00-07:00", endIso: "2026-10-04T17:00:00-07:00" },
  { name: "Vigilante Sunday", month: "October 2026", dateLabel: "October 11", timeLabel: "12:30 PM – 3:00 PM", ...DOWNTOWN, startIso: "2026-10-11T12:30:00-07:00", endIso: "2026-10-11T15:00:00-07:00" },
  { name: "Tombstone Helldorado Days", month: "October 2026", dateLabel: "October 16–18", timeLabel: "10:00 AM – 4:00 PM", ...DOWNTOWN, startIso: "2026-10-16T10:00:00-07:00", endIso: "2026-10-18T16:00:00-07:00" },
  { name: "Bull Riding in Tombstone", month: "October 2026", dateLabel: "October 17", timeLabel: "7:00 PM – 9:00 PM", ...SHOOTOUT_ARENA, startIso: "2026-10-17T19:00:00-07:00", endIso: "2026-10-17T21:00:00-07:00" },
  { name: "Vigilante Sunday", month: "October 2026", dateLabel: "October 25", timeLabel: "12:30 PM – 3:00 PM", ...DOWNTOWN, startIso: "2026-10-25T12:30:00-07:00", endIso: "2026-10-25T15:00:00-07:00" },
  { name: "Cochise County Corral of the Westerners Campfire", month: "November 2026", dateLabel: "November 5", timeLabel: "7:00 PM – 9:00 PM", ...SCHIEFFELIN_HALL, startIso: "2026-11-05T19:00:00-07:00", endIso: "2026-11-05T21:00:00-07:00" },
  { name: "Cochise County Corral of the Westerners Campfire", month: "December 2026", dateLabel: "December 3", timeLabel: "7:00 PM – 9:00 PM", ...SCHIEFFELIN_HALL, startIso: "2026-12-03T19:00:00-07:00", endIso: "2026-12-03T21:00:00-07:00" },
];

export const calendarMonths = Array.from(new Set(calendarEvents.map((e) => e.month)));
