import type { Business } from "@/lib/types";

/**
 * MVP seed data. Contact details (phone/email/website/address) are left
 * null/placeholder where not independently verified — fill in real details
 * before the public launch. Real photography should replace the placeholder
 * tiles rendered by <PlaceholderPhoto> before go-live.
 */

const now = new Date().toISOString();

function biz(partial: Partial<Business> & Pick<Business, "id" | "name" | "category" | "description" | "story">): Business {
  return {
    subcategory: null,
    address: "Tombstone, AZ 85638",
    phone: null,
    email: null,
    website: null,
    image_url: "",
    tier: "free",
    event_host: false,
    event_types: [],
    event_capacity: null,
    is_featured_on_homepage: false,
    featured_expires_at: null,
    created_at: now,
    updated_at: now,
    ...partial,
  };
}

export const businesses: Business[] = [
  // ---------- LODGING ----------
  biz({
    id: "silver-spur-glamping",
    name: "Silver Spur Glamping",
    category: "Lodging",
    subcategory: "Glamping",
    description: "Luxury tent camping under the Arizona sky, minutes from Allen Street.",
    story: "Sleep in a canvas tent with a real bed and a view of the same stars Wyatt Earp saw. Modern comfort, old desert.",
    tier: "premium_featured",
    event_host: true,
    event_types: ["Destination Retreats", "Glamping Experiences"],
    event_capacity: "Up to 40 guests",
    is_featured_on_homepage: true,
  }),
  biz({
    id: "tombstone-monument-guest-ranch",
    name: "Tombstone Monument Guest Ranch",
    category: "Lodging",
    subcategory: "Ranch",
    description: "A working guest ranch on the edge of town built for groups, retreats, and reunions.",
    story: "Horses, open land, and a bunkhouse big enough for your whole team. This is where retreats stop being meetings.",
    tier: "premium_featured",
    event_host: true,
    event_types: ["Corporate Retreats", "Weddings", "Conferences"],
    event_capacity: "Up to 200 guests",
    is_featured_on_homepage: true,
  }),
  biz({ id: "allen-street-inn", name: "Allen Street Inn", category: "Lodging", subcategory: "Inn", description: "A historic inn steps from Tombstone's main street.", story: "Wake up above the same boardwalk where the town's whole history walked by." }),
  biz({ id: "hotel-tombstone", name: "Hotel Tombstone", category: "Lodging", subcategory: "Hotel", description: "A restored hotel built for travelers who want the town, not just a room.", story: "Every hallway here has heard a hundred years of stories." }),
  biz({ id: "inn-history-tombstone", name: "Inn History Tombstone", category: "Lodging", subcategory: "Inn", description: "A small inn built around Tombstone's layered past.", story: "The kind of place where the innkeeper knows more local history than the guidebooks." }),
  biz({ id: "katies-cozy-suites-cabins", name: "Katie's Cozy Suites & Cabins", category: "Lodging", subcategory: "Cabins", description: "Warm, private cabins just off the historic district.", story: "Named for a woman who knew this town's rougher edges — now it's just quiet and warm." }),
  biz({ id: "tombstone-lookout-lodge", name: "Tombstone Lookout Lodge", category: "Lodging", subcategory: "Lodge", description: "Elevated lodging with desert views in every direction.", story: "From here you can watch the sun set over the same hills the miners worked." }),
  biz({ id: "sagebrush-inn", name: "Sagebrush Inn", category: "Lodging", subcategory: "Inn", description: "A no-frills, well-kept inn for travelers passing through the real Southwest.", story: "Simple rooms, honest prices, and sagebrush as far as you can see." }),
  biz({ id: "the-russ-house", name: "The Russ House", category: "Lodging", subcategory: "Historic Inn", description: "One of Tombstone's original boarding houses, still welcoming guests.", story: "This house has been putting people up since the boom years — you're part of the same tradition." }),
  biz({ id: "the-larian-motel", name: "The Larian Motel", category: "Lodging", subcategory: "Motel", description: "A classic Route-style motel in the heart of town.", story: "Park at your door, walk to the gunfight. Simple as that." }),
  biz({ id: "tombstone-boarding-house-inn", name: "Tombstone Boarding House Inn", category: "Lodging", subcategory: "Inn", description: "An old boarding house turned inn, keeping its original character.", story: "Miners once bunked here between shifts. Now it's your base for exploring the same streets." }),
  biz({ id: "tombstone-grand-hotel", name: "Tombstone Grand Hotel", category: "Lodging", subcategory: "Hotel", description: "The town's largest hotel, built for groups and families.", story: "Big enough to host your whole crew without losing the small-town feel." }),
  biz({ id: "tombstone-miners-cabins", name: "Tombstone Miners Cabins", category: "Lodging", subcategory: "Cabins", description: "Cabins modeled on the original miners' quarters.", story: "Stay where the silver rush actually happened, not a recreation of it." }),
  biz({ id: "trail-riders-inn-rv-park", name: "Trail Rider's Inn & RV Park", category: "Lodging", subcategory: "RV Park", description: "Inn rooms and RV hookups for travelers on the move.", story: "Whether you're on four wheels or towing your house behind you, there's a spot here." }),
  biz({ id: "crazy-annies-bordello", name: "Crazy Annie's Bordello", category: "Lodging", subcategory: "B&B", description: "A themed bed and breakfast leaning into Tombstone's rowdier history.", story: "The Old West wasn't polite, and this place doesn't pretend it was." }),
  biz({ id: "tombstone-bordello-bb", name: "Tombstone Bordello B&B", category: "Lodging", subcategory: "B&B", description: "A restored building with a past it doesn't hide.", story: "History here is honest — including the parts that don't make the postcards." }),
  biz({ id: "virgils-corner-bb", name: "Virgil's Corner B&B", category: "Lodging", subcategory: "B&B", description: "A quiet corner B&B named for one of the Earp brothers.", story: "Named for the Earp who kept the peace — a fittingly steady place to stay." }),
  biz({ id: "wyatts-hotel-bb", name: "Wyatt's Hotel B&B", category: "Lodging", subcategory: "B&B", description: "A small hotel honoring Tombstone's most famous name.", story: "You don't need a legend's reputation to get a good night's sleep here." }),
  biz({ id: "silver-belt-rv-park", name: "Silver Belt RV Park", category: "Lodging", subcategory: "RV Park", description: "Full hookup RV sites named for the silver that built the town.", story: "Same ground the silver rush ran on — now it's just a good place to park." }),
  biz({ id: "stampede-rv-resort", name: "Stampede RV Resort", category: "Lodging", subcategory: "RV Resort", description: "A larger RV resort with room to spread out.", story: "Open desert, wide sites, and Tombstone a short drive away." }),
  biz({ id: "shoot-out-arena-dry-camping", name: "Shoot Out Arena Dry Camping", category: "Lodging", subcategory: "Camping", description: "Dry camping near the arena where reenactments happen.", story: "Camp close enough to hear the gunfights start." }),
  biz({ id: "tombstone-rv-park-campground", name: "Tombstone RV Park and Campground", category: "Lodging", subcategory: "RV Park", description: "A straightforward campground for RVs and tents alike.", story: "The basics done right, with the whole town within walking distance." }),
  biz({ id: "wells-fargo-rv-park", name: "Wells Fargo RV Park", category: "Lodging", subcategory: "RV Park", description: "RV park named for the stagecoach line that once ran through town.", story: "The stagecoaches are gone, but the route still leads here." }),
  biz({ id: "gunslingers-hideout", name: "Gunslinger's Hideout", category: "Lodging", subcategory: "Cabin", description: "A private cabin retreat away from the main strip.", story: "A little distance from Allen Street, a lot of quiet." }),
  biz({ id: "cactus-rose-cottage", name: "Cactus Rose Cottage", category: "Lodging", subcategory: "Cottage", description: "A private cottage surrounded by desert bloom.", story: "Cactus roses only bloom for a season. This cottage is here for yours." }),
  biz({ id: "toughnut-blue", name: "Toughnut Blue", category: "Lodging", subcategory: "Vacation Rental", description: "A private vacation rental named for the mine that founded Tombstone.", story: "Named for the Tough Nut Mine — the discovery that started everything here." }),
  biz({ id: "the-vaquero-1885", name: "The Vaquero 1885", category: "Lodging", subcategory: "Historic Rental", description: "A restored 1885 property honoring the region's vaquero heritage.", story: "Built the same year the Bird Cage Theatre was already three years old — this town keeps its buildings working." }),
  biz({ id: "wild-west-707", name: "Wild West 707", category: "Lodging", subcategory: "Vacation Rental", description: "A modern vacation rental with an Old West address.", story: "Comfortable, private, and a short walk from the O.K. Corral." }),
  biz({ id: "the-wyatt-earp-house", name: "The Wyatt Earp House", category: "Lodging", subcategory: "Historic Rental", description: "A private rental tied to Tombstone's most famous resident.", story: "Stay under the name that made this town famous around the world." }),

  // ---------- DINING ----------
  biz({ id: "big-nose-kates-saloon", name: "Big Nose Kate's Saloon", category: "Dining", subcategory: "Saloon", description: "A landmark saloon in a building that dates to 1881.", story: "Named for Doc Holliday's partner — this bar has been pouring drinks since the town was young." }),
  biz({ id: "crystal-palace-saloon", name: "Crystal Palace Saloon", category: "Dining", subcategory: "Saloon", description: "One of the most storied saloons on Allen Street.", story: "The Earps and Clantons both drank under this roof. It's still pouring." }),
  biz({ id: "longhorn-restaurant", name: "Longhorn Restaurant", category: "Dining", subcategory: "Restaurant", description: "A family restaurant in a building with real gunfight history.", story: "Ride out the story of a building that took stray bullets in 1881 — then order lunch." }),
  biz({ id: "doc-hollidays-saloon", name: "Doc Holliday's Saloon", category: "Dining", subcategory: "Saloon", description: "A saloon named for Tombstone's most notorious dentist-gambler.", story: "Doc Holliday never ran from a fight or a card game. This place carries his name honestly." }),
  biz({ id: "tombstone-mercantile-kitchen", name: "Tombstone Mercantile Kitchen", category: "Dining", subcategory: "Café", description: "A daytime café serving locals and travelers alike.", story: "Where the people who actually live here get their coffee." }),

  // ---------- ATTRACTIONS ----------
  biz({ id: "ok-corral", name: "O.K. Corral", category: "Attractions", subcategory: "Historic Site", description: "Site of the 30-second gunfight that made Tombstone famous.", story: "October 26, 1881. Thirty seconds that the whole world still talks about." }),
  biz({ id: "boot-hill-graveyard", name: "Boot Hill Graveyard", category: "Attractions", subcategory: "Historic Cemetery", description: "The original cemetery where Tombstone's outlaws and pioneers rest.", story: "Read the headstones and you're reading the town's real history, one name at a time." }),
  biz({ id: "bird-cage-theatre", name: "Bird Cage Theatre", category: "Attractions", subcategory: "Historic Theatre", description: "A 19th-century theatre and gambling hall, preserved as it stood.", story: "The New York Times once called it the wildest, wickedest night spot between Basin Street and the Barbary Coast. It never got a remodel." }),
  biz({ id: "good-enough-mine-tours", name: "Good Enough Mine Tours", category: "Attractions", subcategory: "Mine Tour", description: "Underground tours of the mines that built the town.", story: "Go below Tombstone and see the silver veins that started the whole story." }),
  biz({ id: "tombstone-courthouse-state-historic-park", name: "Tombstone Courthouse State Historic Park", category: "Attractions", subcategory: "Museum", description: "The restored 1882 courthouse, now a museum of Tombstone's history.", story: "Justice, chaos, and everyday life in Tombstone — all documented under one roof." }),

  // ---------- SHOPPING ----------
  biz({ id: "tombstone-old-west-mercantile", name: "Tombstone Old West Mercantile", category: "Shopping", subcategory: "General Store", description: "A general store stocked with Old West goods and local makers.", story: "Part museum, part shop — everything here has a story attached." }),
  biz({ id: "silver-sombrero-gifts", name: "Silver Sombrero Gifts", category: "Shopping", subcategory: "Gift Shop", description: "Gifts and keepsakes made by Tombstone artisans.", story: "Take a piece of the real town home with you, made by the people who live here." }),
  biz({ id: "tombstone-trading-co", name: "Tombstone Trading Co.", category: "Shopping", subcategory: "Antiques", description: "Antiques and relics sourced from the region's mining and ranching past.", story: "Every item here passed through someone's hands a hundred years before yours." }),

  // ---------- SERVICES ----------
  biz({
    id: "team-franko-real-estate",
    name: "Team Franko Real Estate",
    category: "Services",
    subcategory: "Real Estate",
    description: "Local real estate experts helping people put down roots in Tombstone.",
    story: "They didn't just sell property here — they chose to build their lives here too.",
    tier: "premium_featured",
    is_featured_on_homepage: true,
  }),
  biz({ id: "tombstone-visitor-center-tours", name: "Tombstone Visitor Center & Tours", category: "Services", subcategory: "Visitor Services", description: "The first stop for planning your visit and booking local tours.", story: "The people who can point you toward the Tombstone the postcards don't show." }),
  biz({ id: "old-west-wedding-co", name: "Old West Wedding Co.", category: "Services", subcategory: "Event Planning", description: "Full-service wedding and event planning built around Tombstone's historic venues.", story: "They know which building, which street, and which backdrop tells your story right." }),
  biz({ id: "tombstone-stagecoach-tours", name: "Tombstone Stagecoach Tours", category: "Services", subcategory: "Tour Operator", description: "Historic stagecoach rides through the streets of Tombstone.", story: "The same ride visitors have taken for generations, pulled by real horses down real streets." }),
];

export const featuredHomepageBusinesses = businesses.filter((b) => b.is_featured_on_homepage);

export function getByCategory(category: Business["category"]) {
  return businesses.filter((b) => b.category === category);
}

export function getEventVenues() {
  return businesses.filter((b) => b.event_host);
}

export function getById(id: string) {
  return businesses.find((b) => b.id === id);
}
