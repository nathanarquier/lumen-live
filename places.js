const LONDON_PLACES = [
  {
    name: "The Old Blue Last",
    lat: 51.5246,
    lng: -0.0756,
    type: "Live venue",
    why: "A classic grassroots room for emerging artists and a realistic place to build momentum.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Cafe OTO",
    lat: 51.5465,
    lng: -0.0753,
    type: "Experimental venue",
    why: "Strong community for boundary-pushing and experimental music.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "Paper Dress Vintage",
    lat: 51.5493,
    lng: -0.0607,
    type: "Live venue / bar",
    why: "A realistic venue for building early live momentum and meeting music-focused people.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Colour Factory",
    lat: 51.5462,
    lng: -0.0216,
    type: "Live venue / club",
    why: "Good for artists and DJs working between live performance, club culture and audience-building.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "Village Underground",
    lat: 51.5271,
    lng: -0.0791,
    type: "Venue / culture space",
    why: "A stronger visibility room for artists thinking seriously about live positioning.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Hootananny Brixton",
    lat: 51.4632,
    lng: -0.1147,
    type: "Live venue",
    why: "A high-energy South London venue with community, live music and genre-diverse programming.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Windmill Brixton",
    lat: 51.4523,
    lng: -0.1207,
    type: "Grassroots venue",
    why: "A South London venue closely associated with emerging bands and scene-building.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "CLF Art Lounge",
    lat: 51.4723,
    lng: -0.0692,
    type: "Live venue / arts space",
    why: "Good for artists whose work sits between live performance, culture and club audiences.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Matchstick Piehouse",
    lat: 51.4756,
    lng: -0.0545,
    type: "Community venue",
    why: "A supportive DIY-style space for artists who need community as much as stage time.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Amersham Arms",
    lat: 51.4746,
    lng: -0.0392,
    type: "Live venue",
    why: "A useful South East London room for testing live sets and reaching younger audiences.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Half Moon Putney",
    lat: 51.4662,
    lng: -0.2188,
    type: "Live music pub",
    why: "A strong South West room for live experience outside the usual East London circuit.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Bedford",
    lat: 51.4431,
    lng: -0.1525,
    type: "Live venue",
    why: "A South West venue that works well for songwriters, vocalists and more attentive rooms.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Northcote Records",
    lat: 51.4574,
    lng: -0.1673,
    type: "Music bar",
    why: "Good for low-pressure networking, music-led crowds and local live culture.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Magic Garden",
    lat: 51.4657,
    lng: -0.1703,
    type: "Live venue",
    why: "A lively South West venue for informal gigs, genre-mixing and receptive crowds.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Omnibus Theatre",
    lat: 51.4625,
    lng: -0.1384,
    type: "Creative venue",
    why: "Useful for artists working between music, performance and cross-disciplinary projects.",
    profiles: ["LIVE", "BALANCED", "STREAMING"]
  },
  {
    name: "Bush Hall",
    lat: 51.5036,
    lng: -0.2243,
    type: "Grassroots venue",
    why: "A strong West London room with proper music heritage and a credible stage.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Tabernacle",
    lat: 51.5166,
    lng: -0.2057,
    type: "Arts venue",
    why: "Good for curated, acoustic or culturally rooted performances in West London.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Notting Hill Arts Club",
    lat: 51.5142,
    lng: -0.1969,
    type: "Live venue / club",
    why: "Useful for artists looking for a West London room with music and industry crossover.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Troubadour",
    lat: 51.4898,
    lng: -0.1901,
    type: "Independent live venue",
    why: "A historic West London room for intimate shows, songwriting and early fan-building.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Distillers",
    lat: 51.4926,
    lng: -0.2272,
    type: "Pub / live music",
    why: "A local West London option for casual gigs and low-pressure stage time.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Camden Assembly",
    lat: 51.5390,
    lng: -0.1426,
    type: "Live venue",
    why: "A useful room to understand the step between tiny gigs and bigger London momentum.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Finsbury",
    lat: 51.5647,
    lng: -0.1062,
    type: "Live venue",
    why: "An accessible North London venue for new artists, regular gigs and early live development.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Lexington",
    lat: 51.5319,
    lng: -0.1087,
    type: "Live venue",
    why: "A respected small venue with tastemaker audiences and useful indie credibility.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Green Note",
    lat: 51.5415,
    lng: -0.1422,
    type: "Acoustic venue",
    why: "Good for intimate songwriting, folk, jazz and quieter live performance.",
    profiles: ["LIVE", "BALANCED", "STREAMING"]
  },
  {
    name: "The Waiting Room",
    lat: 51.5496,
    lng: -0.0755,
    type: "Live venue",
    why: "A credible small-room circuit venue for artists building their first serious live network.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Social",
    lat: 51.5161,
    lng: -0.1357,
    type: "Venue / bar",
    why: "A good central spot where music, conversation and industry-adjacent crowds overlap.",
    profiles: ["LIVE", "BALANCED", "FREELANCE"]
  },
  {
    name: "91 Living Room",
    lat: 51.5149,
    lng: -0.1324,
    type: "Creative venue",
    why: "Useful for curated events, soft networking and creative community in central London.",
    profiles: ["BALANCED", "FREELANCE", "STREAMING"]
  },
  {
    name: "SJQ",
    lat: 51.5466,
    lng: -0.0757,
    type: "Grassroots venue / bar",
    why: "Good for artists who need a real room with a music-aware crowd.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Piano Works",
    lat: 51.5123,
    lng: -0.1225,
    type: "Live venue",
    why: "Useful for performers looking for paid live work and more commercial performance settings.",
    profiles: ["LIVE", "FREELANCE", "BALANCED"]
  },
  {
    name: "Ronnie Scott's",
    lat: 51.5136,
    lng: -0.1321,
    type: "Jazz venue",
    why: "A long-term benchmark for jazz, soul and high-level live musicianship.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "Studio 9294",
    lat: 51.5460,
    lng: -0.0210,
    type: "Live venue / club",
    why: "Useful for electronic artists and DJs looking for East London audience context.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "Night Tales",
    lat: 51.5465,
    lng: -0.0573,
    type: "Venue / club",
    why: "Good for artists and DJs who sit between live performance, nightlife and social scenes.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "EartH Hackney",
    lat: 51.5537,
    lng: -0.0585,
    type: "Live venue",
    why: "A professional Hackney venue bridging emerging and established artists.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Oslo Hackney",
    lat: 51.5462,
    lng: -0.0552,
    type: "Live venue",
    why: "A useful room between grassroots shows and more established bookings.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Shacklewell Arms",
    lat: 51.5523,
    lng: -0.0752,
    type: "Grassroots venue",
    why: "A DIY-friendly room with a strong indie scene and useful local credibility.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Ridley Road Market Bar",
    lat: 51.5490,
    lng: -0.0745,
    type: "Bar / DJ space",
    why: "A casual entry point for DJ sets, local scenes and informal music networking.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "NT's Loft",
    lat: 51.5467,
    lng: -0.0570,
    type: "DJ venue",
    why: "Good exposure for DJs and artists working in club-facing contexts.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "The Jago",
    lat: 51.5462,
    lng: -0.0757,
    type: "Live venue",
    why: "A culturally diverse room for live music, community and engaged crowds.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Power Lunches",
    lat: 51.5528,
    lng: -0.0741,
    type: "DIY venue",
    why: "A useful DIY reference point for artist-led shows and independent community energy.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Phonox",
    lat: 51.4630,
    lng: -0.1140,
    type: "Club",
    why: "A strong Brixton club context for DJs and electronic artists aiming higher.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "Electric Brixton",
    lat: 51.4637,
    lng: -0.1145,
    type: "Live venue",
    why: "A bigger South London stage for artists thinking beyond small-room gigs.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Prince of Wales Brixton",
    lat: 51.4627,
    lng: -0.1143,
    type: "Live venue / club",
    why: "Useful for artists and DJs who want crossover audiences and energetic nights.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "Brixton Jamm",
    lat: 51.4619,
    lng: -0.1150,
    type: "Live venue",
    why: "A practical South London venue with varied programming and accessible live context.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Cavendish Arms",
    lat: 51.4624,
    lng: -0.1106,
    type: "Creative venue",
    why: "Good for open mics, experimental performance and lower-pressure stage time.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Deptford Northern Soul Club",
    lat: 51.4796,
    lng: -0.0234,
    type: "Music bar",
    why: "A community-driven music crowd that can be useful for local scene-building.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Biddle Bros",
    lat: 51.4732,
    lng: -0.0402,
    type: "Bar / creative space",
    why: "Good for informal connections, small performances and local creative circles.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Montague Arms",
    lat: 51.4698,
    lng: -0.0204,
    type: "DIY venue",
    why: "A useful underground reference for experimental and independent music nights.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Fox & Firkin Lewisham",
    lat: 51.4385,
    lng: -0.0124,
    type: "Live venue",
    why: "A relaxed South East option for local audiences, live shows and outdoor energy.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Ivy House",
    lat: 51.4689,
    lng: -0.0540,
    type: "Community venue",
    why: "Useful for artists who care about community-led programming and local audiences.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Exhibit Balham",
    lat: 51.4434,
    lng: -0.1518,
    type: "Creative venue",
    why: "A mixed-use South West space with events, casual audiences and local creative potential.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Venn Street Records",
    lat: 51.4621,
    lng: -0.1382,
    type: "Music bar",
    why: "A music-first bar that can be useful for meeting people around Clapham’s nightlife.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Northcote Theatre",
    lat: 51.4570,
    lng: -0.1678,
    type: "Creative venue",
    why: "A South West creative space for artists interested in cross-discipline opportunities.",
    profiles: ["LIVE", "BALANCED", "STREAMING"]
  },
  {
    name: "The Clapham Grand",
    lat: 51.4643,
    lng: -0.1326,
    type: "Live venue",
    why: "A bigger South West venue for performance experience and higher-energy crowds.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Bread & Roses",
    lat: 51.4637,
    lng: -0.1334,
    type: "Theatre / music",
    why: "A good space for stripped-back shows, storytelling and performance-led artists.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Temple of Art and Music",
    lat: 51.4764,
    lng: -0.0703,
    type: "Creative hub",
    why: "Useful for rehearsal, live performance and community around artist development.",
    profiles: ["LIVE", "FREELANCE", "STREAMING", "BALANCED"]
  },
  {
    name: "Nine Elms Tavern",
    lat: 51.4815,
    lng: -0.1280,
    type: "Pub / live music",
    why: "A casual South West spot for local exposure and low-pressure performance.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Ritzy",
    lat: 51.4634,
    lng: -0.1150,
    type: "Culture venue",
    why: "A useful Brixton cultural space for film, events and occasional music-led programming.",
    profiles: ["STREAMING", "BALANCED"]
  },
  {
    name: "The Railway Putney",
    lat: 51.4623,
    lng: -0.2161,
    type: "Live venue",
    why: "A practical South West venue with regular live music nights and local audience potential.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Selkirk",
    lat: 51.4412,
    lng: -0.1875,
    type: "Pub / music",
    why: "A low-pressure South West option for informal gigs and testing material.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Blues Kitchen Shepherd's Bush",
    lat: 51.5035,
    lng: -0.2226,
    type: "Live venue",
    why: "Good for performers who want crowd engagement, paid gigs and a music-led bar setting.",
    profiles: ["LIVE", "FREELANCE", "BALANCED"]
  },
  {
    name: "The Phoenix",
    lat: 51.5120,
    lng: -0.3020,
    type: "Live venue",
    why: "A West London local gig option with community feel and accessible live opportunities.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Paradise by Way of Kensal Green",
    lat: 51.5305,
    lng: -0.2242,
    type: "Venue / bar",
    why: "A stylish West London place for curated events and softer networking.",
    profiles: ["LIVE", "BALANCED", "FREELANCE"]
  },
  {
    name: "Laylow",
    lat: 51.5050,
    lng: -0.2170,
    type: "Members club / venue",
    why: "Useful for higher-end music-adjacent networking and more polished performance contexts.",
    profiles: ["FREELANCE", "LIVE", "BALANCED"]
  },
  {
    name: "The Eagle Ladbroke Grove",
    lat: 51.5200,
    lng: -0.2050,
    type: "Pub / music",
    why: "A casual West London spot for low-pressure gigs and local connection.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Crown and Sceptre",
    lat: 51.5095,
    lng: -0.2331,
    type: "Pub / live music",
    why: "A small West London option for grassroots gigs and local visibility.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Westbourne Studios",
    lat: 51.5203,
    lng: -0.2142,
    type: "Creative workspace",
    why: "A useful West London creative environment for meetings, work and soft networking.",
    profiles: ["FREELANCE", "BALANCED"]
  },
  {
    name: "Tileyard West",
    lat: 51.5185,
    lng: -0.2405,
    type: "Music hub",
    why: "A useful West London anchor for artists and producers who want music-business proximity.",
    profiles: ["FREELANCE", "STREAMING", "BALANCED"]
  },
  {
    name: "Pirate Studios Notting Hill",
    lat: 51.5150,
    lng: -0.2050,
    type: "Studio",
    why: "A practical West London option for rehearsal, writing and recording without heavy commitment.",
    profiles: ["FREELANCE", "STREAMING", "BALANCED"]
  },
  {
    name: "KOKO Camden",
    lat: 51.5343,
    lng: -0.1387,
    type: "Live venue",
    why: "An iconic North London venue for artists thinking about bigger-stage ambition.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Jazz Cafe",
    lat: 51.5391,
    lng: -0.1425,
    type: "Live venue",
    why: "A high-quality Camden venue for artists in soul, jazz, electronic and global scenes.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "Dingwalls",
    lat: 51.5413,
    lng: -0.1457,
    type: "Live venue",
    why: "A historic Camden venue with useful context for live development and support slots.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Dublin Castle",
    lat: 51.5395,
    lng: -0.1421,
    type: "Grassroots venue",
    why: "A legendary Camden room for early gigs, bands and local music credibility.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Camden Club",
    lat: 51.5410,
    lng: -0.1405,
    type: "Live venue",
    why: "A smaller Camden venue for showcases, intimate gigs and early audience-building.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Lock Tavern",
    lat: 51.5415,
    lng: -0.1450,
    type: "Bar / venue",
    why: "Useful for casual gigs, music-adjacent audiences and Camden conversations.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Garage",
    lat: 51.5506,
    lng: -0.1084,
    type: "Live venue",
    why: "A good North London mid-size venue to understand the next step after tiny rooms.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Scala",
    lat: 51.5306,
    lng: -0.1209,
    type: "Live venue",
    why: "A useful central/North venue for artists thinking about larger audiences and club crossover.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "The Islington",
    lat: 51.5362,
    lng: -0.1023,
    type: "Live venue",
    why: "A small venue that works well for emerging artists and early live development.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Box Soho",
    lat: 51.5132,
    lng: -0.1340,
    type: "Performance venue",
    why: "A high-end performance reference point for artists interested in theatrical live worlds.",
    profiles: ["LIVE", "FREELANCE", "BALANCED"]
  },
  {
    name: "Soho House Dean Street",
    lat: 51.5138,
    lng: -0.1365,
    type: "Networking space",
    why: "More useful for conversations, soft networking and being around creative industry people.",
    profiles: ["FREELANCE", "BALANCED"]
  },
  {
    name: "The Groucho Club",
    lat: 51.5135,
    lng: -0.1320,
    type: "Members club",
    why: "A creative-industry reference point for networking and proximity to media and culture.",
    profiles: ["FREELANCE", "BALANCED"]
  },
  {
    name: "100 Club",
    lat: 51.5153,
    lng: -0.1410,
    type: "Live venue",
    why: "A historic central venue and useful long-term reference point for serious live acts.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Spiritland",
    lat: 51.5294,
    lng: -0.1266,
    type: "Listening bar",
    why: "Good for sharpening references, taste and how music is experienced in a designed space.",
    profiles: ["STREAMING", "BALANCED", "FREELANCE"]
  },
  {
    name: "Tileyard London",
    lat: 51.5347,
    lng: -0.1176,
    type: "Studio hub",
    why: "Useful if you want to be around producers, writers and music businesses.",
    profiles: ["FREELANCE", "STREAMING", "BALANCED"]
  },
  {
    name: "Strongroom Bar",
    lat: 51.5249,
    lng: -0.0771,
    type: "Studio / bar / networking",
    why: "A crossover spot where studio culture and real-world conversations meet.",
    profiles: ["FREELANCE", "LIVE", "BALANCED", "STREAMING"]
  },
  {
    name: "Metropolis Studios",
    lat: 51.5005,
    lng: -0.2350,
    type: "Studio",
    why: "A high-end studio reference point for understanding professional recording standards.",
    profiles: ["FREELANCE", "STREAMING", "BALANCED"]
  },
  {
    name: "Abbey Road Studios",
    lat: 51.5321,
    lng: -0.1774,
    type: "Studio",
    why: "An iconic long-term benchmark for studio craft, credibility and ambition.",
    profiles: ["FREELANCE", "STREAMING", "BALANCED"]
  },
  {
    name: "Terminal Studios",
    lat: 51.4905,
    lng: -0.0528,
    type: "Rehearsal studio",
    why: "Useful for bands who need practical rehearsal rooms and proper preparation space.",
    profiles: ["LIVE", "FREELANCE", "BALANCED"]
  },
  {
    name: "Bally Studios",
    lat: 51.5883,
    lng: -0.0604,
    type: "Rehearsal studio",
    why: "Good for North London bands, vocalists and producers who need regular practical space.",
    profiles: ["LIVE", "FREELANCE", "STREAMING", "BALANCED"]
  },
  {
    name: "Bush Studios",
    lat: 51.5038,
    lng: -0.2247,
    type: "Rehearsal / production studio",
    why: "A strong West London option for serious rehearsal, production and pre-show preparation.",
    profiles: ["LIVE", "FREELANCE", "STREAMING", "BALANCED"]
  },
  {
    name: "Ritz Rehearsal Studios",
    lat: 51.5480,
    lng: -0.0760,
    type: "Rehearsal studio",
    why: "Useful if you need a proper studio environment with practical rehearsal infrastructure.",
    profiles: ["LIVE", "FREELANCE", "BALANCED"]
  },
  {
    name: "Peckham Studios",
    lat: 51.4742,
    lng: -0.0694,
    type: "Music studio",
    why: "A South East studio environment that can support writing, production and collaboration.",
    profiles: ["FREELANCE", "STREAMING", "BALANCED"]
  },
  {
    name: "Stanley Arts",
    lat: 51.3986,
    lng: -0.0757,
    type: "Arts / rehearsal space",
    why: "Useful for artists working across music, performance and wider creative projects.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "Sound Minds",
    lat: 51.4568,
    lng: -0.1888,
    type: "Community music space",
    why: "A community-facing music space useful for rehearsal, local connection and support.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Pirate Studios Camden",
    lat: 51.5420,
    lng: -0.1470,
    type: "Rehearsal / recording studio",
    why: "A practical North London choice for writing, rehearsal and quick recording work.",
    profiles: ["FREELANCE", "STREAMING", "LIVE", "BALANCED"]
  },
  {
    name: "Pirate Studios Wembley",
    lat: 51.5560,
    lng: -0.2796,
    type: "Rehearsal / recording studio",
    why: "Useful for West and North West artists who need accessible studio time.",
    profiles: ["FREELANCE", "STREAMING", "LIVE", "BALANCED"]
  },
  {
    name: "Pirate Studios Tottenham",
    lat: 51.5886,
    lng: -0.0607,
    type: "Rehearsal / recording studio",
    why: "A useful North London base for building consistency in rehearsal and recording.",
    profiles: ["FREELANCE", "STREAMING", "LIVE", "BALANCED"]
  },
  {
    name: "MOTH Club",
    lat: 51.5456,
    lng: -0.0541,
    type: "Live venue",
    why: "A strong East London room with music, culture and good audience energy.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Chats Palace",
    lat: 51.5481,
    lng: -0.0437,
    type: "Community arts venue",
    why: "Useful for artists who want a local, community-facing creative environment.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Victoria Dalston",
    lat: 51.5453,
    lng: -0.0740,
    type: "Live venue",
    why: "A small East London room for early gigs, scene-building and local credibility.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Folklore Hoxton",
    lat: 51.5303,
    lng: -0.0834,
    type: "Live venue / bar",
    why: "Good for intimate gigs, acoustic sets and low-pressure music conversations.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The George Tavern",
    lat: 51.5149,
    lng: -0.0515,
    type: "Historic live venue",
    why: "A characterful East London venue for raw, independent and atmospheric live projects.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Signature Brew Blackhorse Road",
    lat: 51.5904,
    lng: -0.0414,
    type: "Brewery / live venue",
    why: "A useful North East option for live shows, community events and music-led crowds.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Cause",
    lat: 51.5877,
    lng: -0.0605,
    type: "Club / venue",
    why: "Good for electronic artists and DJs looking for stronger underground context.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "Number 90 Hackney Wick",
    lat: 51.5429,
    lng: -0.0229,
    type: "Bar / music space",
    why: "Useful for DJs, live-adjacent events and creative conversations around Hackney Wick.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "Grow Hackney",
    lat: 51.5431,
    lng: -0.0222,
    type: "Community venue",
    why: "Good for informal music events, local creative energy and relaxed networking.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Yard Theatre",
    lat: 51.5440,
    lng: -0.0225,
    type: "Performance venue",
    why: "Useful for artists interested in experimental, performance-led or cross-disciplinary work.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "Peckham Audio",
    lat: 51.4707,
    lng: -0.0677,
    type: "Live venue",
    why: "A useful small-room venue for testing live material and reaching South East audiences.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "AMP Studios",
    lat: 51.4748,
    lng: -0.0680,
    type: "Studio / venue",
    why: "Good for artists working between rehearsal, production and live community.",
    profiles: ["FREELANCE", "STREAMING", "LIVE", "BALANCED"]
  },
  {
    name: "The Albany",
    lat: 51.4785,
    lng: -0.0257,
    type: "Arts venue",
    why: "A South East arts hub for performance, community and cross-disciplinary opportunities.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "New Cross Inn",
    lat: 51.4751,
    lng: -0.0377,
    type: "Live venue",
    why: "A practical grassroots venue for bands and artists building stage experience.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Birds Nest",
    lat: 51.4798,
    lng: -0.0279,
    type: "Live pub venue",
    why: "A local live room useful for informal gigs and building confidence.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Sister Midnight",
    lat: 51.4616,
    lng: -0.0120,
    type: "Community music venue",
    why: "A South East music space with a community-led spirit and artist-first energy.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Mercato Metropolitano",
    lat: 51.4983,
    lng: -0.0997,
    type: "Food hall / events space",
    why: "Useful for pop-up performances, casual networking and culturally mixed audiences.",
    profiles: ["LIVE", "FREELANCE", "BALANCED"]
  },
  {
    name: "Toulouse Lautrec Jazz Club",
    lat: 51.4927,
    lng: -0.1058,
    type: "Jazz venue",
    why: "Good for jazz, soul and acoustic-leaning artists who need an intimate live room.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "Eventim Apollo",
    lat: 51.4908,
    lng: -0.2250,
    type: "Large venue",
    why: "A West London reference point for understanding bigger live positioning.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "O2 Shepherd's Bush Empire",
    lat: 51.5030,
    lng: -0.2247,
    type: "Live venue",
    why: "An aspirational West London stage for artists thinking beyond grassroots rooms.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Gate Hammersmith",
    lat: 51.4927,
    lng: -0.2259,
    type: "Arts venue",
    why: "Useful for artists working across performance, theatre, sound and cultural events.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "Lyric Hammersmith",
    lat: 51.4927,
    lng: -0.2265,
    type: "Creative venue",
    why: "Good for artists who want links into performance and wider creative networks.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "LAMDA",
    lat: 51.4894,
    lng: -0.2165,
    type: "Performance / rehearsal space",
    why: "Useful context for performance-adjacent work and West London production culture.",
    profiles: ["FREELANCE", "STREAMING", "BALANCED"]
  },
  {
    name: "The Sound Lounge Sutton",
    lat: 51.3614,
    lng: -0.1937,
    type: "Grassroots venue",
    why: "Useful for artists in deeper South London who still want a music-focused venue.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Ram Jam Records",
    lat: 51.4116,
    lng: -0.3000,
    type: "Live venue",
    why: "Good for South West artists looking for smaller, music-led rooms outside central London.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Fighting Cocks",
    lat: 51.4105,
    lng: -0.3005,
    type: "Grassroots venue",
    why: "Useful for punk, alternative and live-heavy artists building stage experience.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Boileroom Guildford",
    lat: 51.2360,
    lng: -0.5715,
    type: "Grassroots venue",
    why: "Useful for artists considering reachable South West touring routes beyond London.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "O2 Forum Kentish Town",
    lat: 51.5521,
    lng: -0.1410,
    type: "Live venue",
    why: "A strong North London reference point for scaling live audiences.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Dome Tufnell Park",
    lat: 51.5577,
    lng: -0.1382,
    type: "Live venue",
    why: "Useful for heavier, alternative and guitar-led acts building beyond tiny rooms.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Boston Music Room",
    lat: 51.5575,
    lng: -0.1380,
    type: "Live venue",
    why: "A practical North London venue for developing support slots and early audiences.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Grace",
    lat: 51.5505,
    lng: -0.1082,
    type: "Live venue",
    why: "A useful small-to-mid room for emerging artists around Highbury and Islington.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Union Chapel",
    lat: 51.5468,
    lng: -0.1022,
    type: "Live venue",
    why: "A beautiful seated venue for songwriting, acoustic and atmospheric projects.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "Kings Place",
    lat: 51.5348,
    lng: -0.1224,
    type: "Concert venue",
    why: "Useful for composed, jazz, classical, experimental or intentional listening contexts.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "Roundhouse",
    lat: 51.5433,
    lng: -0.1510,
    type: "Live venue / creative hub",
    why: "A major North London reference for youth development, performance and bigger live ambition.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "Roundhouse Creative Studios",
    lat: 51.5433,
    lng: -0.1510,
    type: "Creative studios",
    why: "A strong place for younger artists who want development, community and output support.",
    profiles: ["FREELANCE", "STREAMING", "BALANCED"]
  },
  {
    name: "The Black Heart",
    lat: 51.5390,
    lng: -0.1436,
    type: "Live venue",
    why: "Useful for heavier, alternative and independent artists building Camden connections.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Underworld Camden",
    lat: 51.5394,
    lng: -0.1428,
    type: "Live venue",
    why: "Good for rock, alternative and heavier artists needing a scene-specific room.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Green Rooms Hotel",
    lat: 51.5973,
    lng: -0.1095,
    type: "Arts hotel / creative hub",
    why: "Useful for North London creatives looking for artist-friendly space and conversations.",
    profiles: ["FREELANCE", "BALANCED"]
  },
  {
    name: "Somerset House Studios",
    lat: 51.5111,
    lng: -0.1176,
    type: "Artist studios",
    why: "Useful for artists thinking beyond music into cultural, experimental and interdisciplinary work.",
    profiles: ["FREELANCE", "STREAMING", "BALANCED"]
  },
  {
    name: "Southbank Centre",
    lat: 51.5058,
    lng: -0.1166,
    type: "Culture venue",
    why: "A major cultural reference for performance, festivals and public programming.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "Queen Elizabeth Hall",
    lat: 51.5060,
    lng: -0.1164,
    type: "Concert venue",
    why: "An aspirational stage for developed live, composed or experimental projects.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "ICA",
    lat: 51.5068,
    lng: -0.1308,
    type: "Contemporary arts venue",
    why: "Good for artists who sit between music, film, performance and contemporary culture.",
    profiles: ["STREAMING", "BALANCED"]
  },
  {
    name: "Barbican Centre",
    lat: 51.5202,
    lng: -0.0938,
    type: "Arts centre",
    why: "A major cultural venue for ambitious, cross-disciplinary and experimental work.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "The Lower Third",
    lat: 51.5150,
    lng: -0.1303,
    type: "Live venue",
    why: "A central showcase venue that can connect artists to more industry-facing crowds.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "Ain't Nothin But Blues Bar",
    lat: 51.5137,
    lng: -0.1380,
    type: "Live music bar",
    why: "Good for blues, soul and jam-oriented musicians looking for live playing energy.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "PizzaExpress Jazz Club Soho",
    lat: 51.5134,
    lng: -0.1319,
    type: "Jazz venue",
    why: "A useful aspirational room for jazz, soul and session-level musicians.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  },
  {
    name: "Crazy Coqs",
    lat: 51.5109,
    lng: -0.1355,
    type: "Cabaret / live venue",
    why: "Useful for vocalists, songwriters and more theatrical performers building a polished live world.",
    profiles: ["LIVE", "BALANCED"]
  },
  {
    name: "The Halley",
    lat: 51.5362,
    lng: -0.0732,
    type: "Workspace / studios",
    why: "Helpful if you need more routine and a music-adjacent work environment.",
    profiles: ["FREELANCE", "STREAMING", "BALANCED"]
  },
  {
    name: "The Ministry",
    lat: 51.4988,
    lng: -0.0984,
    type: "Workspace",
    why: "A useful option if you need a more professional structure around your freelance rhythm.",
    profiles: ["FREELANCE", "BALANCED"]
  },
  {
    name: "Cafe 1001",
    lat: 51.5219,
    lng: -0.0719,
    type: "Casual work / meeting spot",
    why: "Good for low-pressure meetings, planning sessions and East London creative energy.",
    profiles: ["FREELANCE", "BALANCED"]
  },
  {
    name: "TAM Elephant and Castle",
    lat: 51.4948,
    lng: -0.1004,
    type: "Artist platform / live space",
    why: "Useful if you want a space built around musicians, community and emerging talent.",
    profiles: ["LIVE", "FREELANCE", "STREAMING", "BALANCED"]
  },
  {
    name: "House of MOBO",
    lat: 51.4613,
    lng: -0.1156,
    type: "Creative venue",
    why: "A South London culture space with a focus on emerging voices and community.",
    profiles: ["LIVE", "STREAMING", "BALANCED"]
  }
];

const PLACES = {
  FREELANCE: LONDON_PLACES.filter((place) => place.profiles.includes("FREELANCE")),
  LIVE: LONDON_PLACES.filter((place) => place.profiles.includes("LIVE")),
  STREAMING: LONDON_PLACES.filter((place) => place.profiles.includes("STREAMING")),
  BALANCED: LONDON_PLACES.filter((place) => place.profiles.includes("BALANCED"))
};

Object.keys(PLACES).forEach((profile) => {
  PLACES[profile] = PLACES[profile].map((place) => ({
    ...place,
    mapsUrl:
      place.mapsUrl ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        place.name + " London"
      )}`
  }));
});