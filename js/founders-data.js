/**
 * Founders Connect - Jaipur Startup & Founder Research Data
 * Project: Real-World Jaipur Startup Ecosystem Research
 * Event Date: 21st November
 * Host: Founders Connect (Jaipur Edition)
 */

export const EVENT_DETAILS = {
  name: "Founders Connect",
  edition: "Jaipur Ecosystem Edition",
  date: "21st November 2026",
  location: "Jaipur, Rajasthan",
  targetFoundersPerFellow: 10,
  totalFellows: 9,
  targetTotalLeads: 90,
  description: "Comprehensive startup intelligence and founder research across Jaipur's emerging tech, D2C, fintech, and deeptech ecosystem."
};

export const SECTORS = [
  "All Sectors",
  "AutoTech & Marketplace",
  "E-Commerce & Social Commerce",
  "D2C & Home Retail",
  "FinTech & MSME Lending",
  "TravelTech & Experiences",
  "HealthTech & Telemedicine",
  "RetailTech & Hyperlocal",
  "AgriTech & Rural Tech",
  "B2B Fashion & Supply Chain",
  "CleanTech & EV Mobility",
  "EdTech & Skilling",
  "SaaS & Enterprise"
];

export const TEAM_MEMBERS = [
  {
    id: "bhoomik",
    name: "Bhoomik Setva",
    role: "Research Lead & Fellow",
    avatar: "BS",
    focus: "High-Growth Scaleups & Ecosystem Anchors",
    target: 10,
    completed: 10,
    status: "Completed",
    notes: "Deep-dive into Jaipur's marquee unicorns, serial founders, and cross-sector market leaders."
  },
  {
    id: "fellow-2",
    name: "Team Fellow 02",
    role: "Research Fellow",
    avatar: "TF",
    focus: "B2B SaaS & AI Enablers",
    target: 10,
    completed: 10,
    status: "Draft / Ready for Input",
    notes: "Spotlighting cloud tools, developer platforms, and enterprise software founded in Jaipur."
  },
  {
    id: "fellow-3",
    name: "Team Fellow 03",
    role: "Research Fellow",
    avatar: "TF",
    focus: "D2C Brands & Craft Innovations",
    target: 10,
    completed: 10,
    status: "Draft / Ready for Input",
    notes: "Spotlighting Jaipur's modern direct-to-consumer apparel, gems & jewelry, and lifestyle brands."
  },
  {
    id: "fellow-4",
    name: "Team Fellow 04",
    role: "Research Fellow",
    avatar: "TF",
    focus: "Fintech, Insurtech & Micro-finance",
    target: 10,
    completed: 10,
    status: "Draft / Ready for Input",
    notes: "Evaluating Bharat-focused payment gateways, micro-lenders, and financial inclusion startups."
  },
  {
    id: "fellow-5",
    name: "Team Fellow 05",
    role: "Research Fellow",
    avatar: "TF",
    focus: "Agritech & Food Supply Chains",
    target: 10,
    completed: 10,
    status: "Draft / Ready for Input",
    notes: "Researching post-harvest tech, dairy supply systems, and farm input digitization."
  },
  {
    id: "fellow-6",
    name: "Team Fellow 06",
    role: "Research Fellow",
    avatar: "TF",
    focus: "HealthTech & Diagnostics",
    target: 10,
    completed: 10,
    status: "Draft / Ready for Input",
    notes: "Analyzing telemedicine networks, digital diagnostics, and rural health clinics."
  },
  {
    id: "fellow-7",
    name: "Team Fellow 07",
    role: "Research Fellow",
    avatar: "TF",
    focus: "CleanTech & Green Logistics",
    target: 10,
    completed: 10,
    status: "Draft / Ready for Input",
    notes: "Mapping solar startups, EV battery retrofitting, and eco-packaging ventures."
  },
  {
    id: "fellow-8",
    name: "Team Fellow 08",
    role: "Research Fellow",
    avatar: "TF",
    focus: "EdTech & Upskilling Networks",
    target: 10,
    completed: 10,
    status: "Draft / Ready for Input",
    notes: "Discovering vocational education platforms and competitive exam tech originating from Rajasthan."
  },
  {
    id: "fellow-9",
    name: "Team Fellow 09",
    role: "Research Fellow",
    avatar: "TF",
    focus: "DeepTech, IoT & Hardware",
    target: 10,
    completed: 10,
    status: "Draft / Ready for Input",
    notes: "Focusing on smart devices, industrial automation, and robotics labs in Jaipur."
  }
];

export const FOUNDERS_DATA = {
  "bhoomik": [
    {
      id: "f-101",
      fellowId: "bhoomik",
      fellowName: "Bhoomik Setva",
      founderName: "Amit Jain",
      designation: "Co-Founder & Chief Executive Officer (CEO)",
      companyName: "CarDekho (GirnarSoft)",
      website: "https://www.cardekho.com",
      linkedinUrl: "https://www.linkedin.com/in/amit-jain-cardekho",
      publicContact: "contact@girnarsoft.com / Media PR: pr@cardekho.com",
      sector: "AutoTech & Marketplace",
      businessModel: "Digital automobile ecosystem spanning B2C auto discovery, dealer SaaS management, auto loan & insurance facilitation (Rupyy), and B2B vehicle auctions.",
      companySummary: "CarDekho is Jaipur's flagship unicorn with a $1.2B+ valuation. Founded in a small garage in Jaipur in 2008 by brothers Amit & Anurag Jain, it digitizes the entire lifecycle of buying, selling, insuring, and financing vehicles across India and Southeast Asia.",
      attendedEvents: true,
      eventAttendanceStatus: "Active Keynote Speaker & Charter Member",
      previousEvents: [
        "TiE Global Summit & TiE Rajasthan Conclaves (Keynote Speaker)",
        "Shark Tank India (Judge & Investor across multiple seasons)",
        "Rajasthan DigiFest & IT Day (Fireside Guest of Honor)",
        "IIT Delhi & BITS Pilani E-Summit Keynotes"
      ],
      relevanceToFoundersConnect: "Amit Jain is the benchmark symbol of building a billion-dollar tech company from Jaipur. Inviting him provides early-stage and growth founders with priceless blueprint advice on scaling outside Bangalore/NCR, navigating capital cycles, and unit-economic discipline.",
      sourceLinks: [
        { label: "Company Website", url: "https://www.cardekho.com" },
        { label: "Crunchbase Profile", url: "https://www.crunchbase.com/organization/cardekho" },
        { label: "TiE Rajasthan Member Roster", url: "https://tierajasthan.org" }
      ],
      tags: ["Unicorn", "Shark Tank Judge", "Tier-2 Pioneer", "AutoTech"],
      relevanceScore: 98
    },
    {
      id: "f-102",
      fellowId: "bhoomik",
      fellowName: "Bhoomik Setva",
      founderName: "Sourjyendu Medda",
      designation: "Co-Founder & Chief Business Officer",
      companyName: "DealShare",
      website: "https://www.dealshare.in",
      linkedinUrl: "https://www.linkedin.com/in/sourjyendu-medda-03102313",
      publicContact: "support@dealshare.in / press@dealshare.in",
      sector: "E-Commerce & Social Commerce",
      businessModel: "Hyperlocal social group buying and value e-grocery platform that connects regional manufacturers directly with middle-income mass-market consumers in Tier-2/3 cities.",
      companySummary: "DealShare kicked off operations in Jaipur in 2018 and rapidly grew into a unicorn social commerce juggernaut backed by Tiger Global and Alpha Wave. It optimizes regional distribution networks to offer essential household goods at unbeatable discounts.",
      attendedEvents: true,
      eventAttendanceStatus: "Frequent Panelist & E-Commerce Speaker",
      previousEvents: [
        "IVCA Conclave (Indian Venture and Alternate Capital Association)",
        "TiE Rajasthan Startup Roundtables",
        "E-Commerce Retail Summit India",
        "Inc42 'The Makers Summit'"
      ],
      relevanceToFoundersConnect: "Invaluable speaker on unlocking the next 500 million consumers in Bharat ('Tier 2/3 retail dynamics'), virality via WhatsApp group sharing, and building lean regional warehousing.",
      sourceLinks: [
        { label: "DealShare Portal", url: "https://www.dealshare.in" },
        { label: "Forbes India Feature", url: "https://www.forbesindia.com" },
        { label: "YourStory Coverage", url: "https://yourstory.com" }
      ],
      tags: ["Unicorn", "Social Commerce", "Bharat Consumers", "Supply Chain"],
      relevanceScore: 94
    },
    {
      id: "f-103",
      fellowId: "bhoomik",
      fellowName: "Bhoomik Setva",
      founderName: "Lokendra Ranawat",
      designation: "Co-Founder & Chief Executive Officer (CEO)",
      companyName: "WoodenStreet",
      website: "https://www.woodenstreet.com",
      linkedinUrl: "https://www.linkedin.com/in/lokendra-ranawat-27b95318",
      publicContact: "contact@woodenstreet.com / +91-9314444747",
      sector: "D2C & Home Retail",
      businessModel: "Omnichannel D2C furniture & home furnishings brand with proprietary in-house manufacturing, 100+ experience centers nationwide, and on-demand custom furniture ordering.",
      companySummary: "Founded in Jaipur in 2015, WoodenStreet leverages Rajasthan's rich artisan craftsmanship and modern machinery to eliminate multiple wholesale intermediaries, achieving rapid nationwide expansion backed by WestBridge Capital.",
      attendedEvents: true,
      eventAttendanceStatus: "Prominent Industry Panelist & Mentor",
      previousEvents: [
        "D2C Insider Summit Delhi & Mumbai",
        "Retail Leadership Summit (RLS) by RAI",
        "TiE Rajasthan Entrepreneurship Meets",
        "Franchise India National Convention"
      ],
      relevanceToFoundersConnect: "Offers critical takeaways on mastering omnichannel retail (blending online discovery with offline experience stores) and maintaining manufacturing profitability right from Jaipur.",
      sourceLinks: [
        { label: "Company Store", url: "https://www.woodenstreet.com" },
        { label: "Entrackr Venture Report", url: "https://entrackr.com" },
        { label: "LinkedIn Official", url: "https://www.linkedin.com/in/lokendra-ranawat-27b95318" }
      ],
      tags: ["Omnichannel", "D2C Pioneer", "Manufacturing", "Profitable Scaling"],
      relevanceScore: 92
    },
    {
      id: "f-104",
      fellowId: "bhoomik",
      fellowName: "Bhoomik Setva",
      founderName: "Mohit Sahney",
      designation: "Founder, Managing Director & CEO",
      companyName: "Finova Capital",
      website: "https://www.finovacapital.in",
      linkedinUrl: "https://www.linkedin.com/in/mohit-sahney-3135b128",
      publicContact: "info@finovacapital.in / +91-141-4118200",
      sector: "FinTech & MSME Lending",
      businessModel: "Tech-enabled NBFC dedicated to MSME lending, extending collateral-backed small business credit to unbanked and underserved micro-entrepreneurs using cash-flow assessment algorithms.",
      companySummary: "Headquartered in C-Scheme, Jaipur, Finova Capital has built a massive balance sheet backed by Sequoia (Peak XV), Faering Capital, and Norwest, disbursing thousands of crores in loans to carpenters, small shopkeepers, and micro-enterprises.",
      attendedEvents: true,
      eventAttendanceStatus: "Regular Financial Conclave Participant",
      previousEvents: [
        "VCCircle Financial Services Conclave",
        "Global SME Finance Forum",
        "Rajasthan DigiFest FinTech Track",
        "BFSI Gamechanger Summit"
      ],
      relevanceToFoundersConnect: "A powerhouse on navigating capital structure, debt financing vs equity, risk underwriting, and regulatory compliance in heavily regulated sectors.",
      sourceLinks: [
        { label: "Finova Capital Corporate", url: "https://www.finovacapital.in" },
        { label: "Peak XV Portfolio List", url: "https://www.peakxv.com" },
        { label: "RBI NBFC Registry", url: "https://www.rbi.org.in" }
      ],
      tags: ["Fintech", "MSME Credit", "Institutional Funding", "C-Scheme HQ"],
      relevanceScore: 95
    },
    {
      id: "f-105",
      fellowId: "bhoomik",
      fellowName: "Bhoomik Setva",
      founderName: "Chitra Gurnani Daga",
      designation: "Co-Founder & CEO",
      companyName: "Thrillophilia",
      website: "https://www.thrillophilia.com",
      linkedinUrl: "https://www.linkedin.com/in/chitragurnanidaga",
      publicContact: "partners@thrillophilia.com / info@thrillophilia.com",
      sector: "TravelTech & Experiences",
      businessModel: "Marketplace and booking engine for experiential travel, outdoor adventures, and curated holiday itineraries, monetizing through supplier commissions and direct itinerary bookings.",
      companySummary: "Thrillophilia caters to over 80 million travelers annually with 25,000+ tour activities across 55+ countries. The core operations and tech engine were transitioned and built from Jaipur, creating a massive digital media and travel ecosystem.",
      attendedEvents: true,
      eventAttendanceStatus: "Celebrated Keynote Speaker & Women Leader",
      previousEvents: [
        "Web in Travel (WIT) Singapore & India",
        "SATTE Travel & Tourism Expo",
        "TiE Rajasthan Women Entrepreneurship Forum",
        "Google for Startups Accelerator Alumni Summit"
      ],
      relevanceToFoundersConnect: "Incredible role model for female entrepreneurship, digital content-led customer acquisition (SEO / social / community), and building an international travel tech engine from Rajasthan.",
      sourceLinks: [
        { label: "Thrillophilia Portal", url: "https://www.thrillophilia.com" },
        { label: "Economic Times Travel", url: "https://economictimes.indiatimes.com" },
        { label: "TiE Women Community", url: "https://tierajasthan.org" }
      ],
      tags: ["TravelTech", "Female Founder", "Organic Acquisition", "Bootstrapped to Scale"],
      relevanceScore: 93
    },
    {
      id: "f-106",
      fellowId: "bhoomik",
      fellowName: "Bhoomik Setva",
      founderName: "Shreyans Mehta",
      designation: "Co-Founder & Chief Executive Officer",
      companyName: "MedCords (Aayu)",
      website: "https://www.aayu.live",
      linkedinUrl: "https://www.linkedin.com/in/shreyansmehta",
      publicContact: "contact@medcords.com / corporate@aayu.live",
      sector: "HealthTech & Telemedicine",
      businessModel: "Integrated digital health ecosystem offering instant teleconsultation, digitized EHR storage, and rapid medicine delivery partnered with 25,000+ local medical chemist shops.",
      companySummary: "Recognized in Forbes 30 Under 30 and backed by Info Edge, MedCords was conceived in Kota and scaled out of Jaipur. During COVID-19, their Aayu app became Rajasthan government's official telemedicine partner, resolving millions of citizen health queries.",
      attendedEvents: true,
      eventAttendanceStatus: "Active Startup & Government Conclave Speaker",
      previousEvents: [
        "NASSCOM Emerge 50 Conclave",
        "iStart Rajasthan Innovation Summit",
        "TiE Rajasthan Annual Conclave",
        "Digital Health Summit India"
      ],
      relevanceToFoundersConnect: "Exceptional knowledge on public-private health partnerships, navigating state government incubator programs (iStart Rajasthan), and consumer retention across Tier-3 cities.",
      sourceLinks: [
        { label: "Aayu Official Website", url: "https://www.aayu.live" },
        { label: "Forbes 30 Under 30 Profile", url: "https://www.forbes.com" },
        { label: "iStart Rajasthan Success Story", url: "https://istart.rajasthan.gov.in" }
      ],
      tags: ["HealthTech", "Forbes 30U30", "iStart Champion", "Public Partnership"],
      relevanceScore: 91
    },
    {
      id: "f-107",
      fellowId: "bhoomik",
      fellowName: "Bhoomik Setva",
      founderName: "Anup Kumar Khandelwal",
      designation: "Founder & Chief Executive Officer",
      companyName: "Kirana King",
      website: "https://www.kiranaking.com",
      linkedinUrl: "https://www.linkedin.com/in/anup-kumar-khandelwal-2432906b",
      publicContact: "info@kiranaking.com / +91-141-4043999",
      sector: "RetailTech & Hyperlocal",
      businessModel: "Franchise-as-a-Service model that transforms unorganized standalone mom-and-pop grocery stores into standardized, tech-driven retail supermarkets with digital inventory and pooled FMCG procurement.",
      companySummary: "Headquartered on Tonk Road, Jaipur, Kirana King brands itself as 'India Ki Nayi Dukaan'. It has successfully modernized hundreds of stores across Rajasthan, providing storefront branding, POS terminals, and direct brand tie-ups.",
      attendedEvents: true,
      eventAttendanceStatus: "Active Retail Trade Panelist",
      previousEvents: [
        "India Retail Forum (IRF)",
        "TiE Rajasthan Startup Meetups",
        "Franchise Trade Expo Jaipur",
        "National FMCG & Retail Conclave"
      ],
      relevanceToFoundersConnect: "Ideal speaker for discussions on retail digitalization, offline merchant onboarding, channel incentives, and defending traditional retailers against quick-commerce aggregators.",
      sourceLinks: [
        { label: "Kirana King Website", url: "https://www.kiranaking.com" },
        { label: "BW Disrupt Feature", url: "https://bwdisrupt.businessworld.in" },
        { label: "Startup India Profile", url: "https://www.startupindia.gov.in" }
      ],
      tags: ["RetailTech", "Hyperlocal", "Kirana Digitization", "FMCG"],
      relevanceScore: 89
    },
    {
      id: "f-108",
      fellowId: "bhoomik",
      fellowName: "Bhoomik Setva",
      founderName: "Rajendra Lora",
      designation: "Founder & Chief Executive Officer",
      companyName: "Freshokartz Agri",
      website: "https://www.freshokartz.com",
      linkedinUrl: "https://www.linkedin.com/in/rajendralora",
      publicContact: "contact@freshokartz.com / +91-141-2785566",
      sector: "AgriTech & Rural Tech",
      businessModel: "Full-stack hybrid 'phygital' farmer support network providing soil testing, high-yield seeds and fertilizer inputs, advisory services, and farm-gate market linkage to food processors.",
      companySummary: "Operated out of Mansarovar, Jaipur, Freshokartz works directly with over 150,000+ farmers across Rajasthan and neighboring states, supported by venture capital from Omnivore and Rockstart.",
      attendedEvents: true,
      eventAttendanceStatus: "Regular AgriTech Conclave Speaker",
      previousEvents: [
        "Global Rajasthan Agritech Meet (GRAM)",
        "FICCI National Agriculture Summit",
        "TiE Rajasthan Agritech Track",
        "Social Enterprise World Forum (SEWF)"
      ],
      relevanceToFoundersConnect: "Deeply experienced in rural distribution, farm-gate logistics, impact investing, and how tech can increase crop yield and income for marginal farmers in arid ecosystems.",
      sourceLinks: [
        { label: "Freshokartz Home", url: "https://www.freshokartz.com" },
        { label: "Omnivore Portfolio", url: "https://www.omnivore.vc" },
        { label: "YourStory AgriTech Showcase", url: "https://yourstory.com" }
      ],
      tags: ["AgriTech", "Rural Innovation", "Impact Startup", "Farmer Network"],
      relevanceScore: 90
    },
    {
      id: "f-109",
      fellowId: "bhoomik",
      fellowName: "Bhoomik Setva",
      founderName: "Rohit Dangayach",
      designation: "Co-Founder & Director",
      companyName: "Wholesalebox",
      website: "https://www.wholesalebox.in",
      linkedinUrl: "https://www.linkedin.com/in/rohitdangayach",
      publicContact: "support@wholesalebox.in / +91-141-6691111",
      sector: "B2B Fashion & Supply Chain",
      businessModel: "B2B wholesale marketplace connecting apparel and ethnic wear manufacturers directly to small shopkeepers and boutique owners across Tier-2/3/4 towns, disintermediating 4 layers of trade.",
      companySummary: "Wholesalebox leveraged Jaipur's position as the world's Sanganeri print and ethnic fashion capital, digitizing catalog discovery, payment escrow, and doorstep bulk logistics for apparel retailers.",
      attendedEvents: true,
      eventAttendanceStatus: "Active B2B & E-Commerce Speaker",
      previousEvents: [
        "Apparel Export Promotion Council (AEPC) Symposium",
        "TiE Jaipur Networking Forum",
        "B2B E-Commerce Leadership Roundtables",
        "Rajasthan Chamber of Commerce Seminars"
      ],
      relevanceToFoundersConnect: "Provides deep insights on B2B credit cycles, logistics fulfillment, digitizing traditional manufacturing clusters, and trade margin optimizations.",
      sourceLinks: [
        { label: "Wholesalebox Platform", url: "https://www.wholesalebox.in" },
        { label: "Venture Intelligence Index", url: "https://www.ventureintelligence.com" },
        { label: "VCCircle Funding Record", url: "https://www.vccircle.com" }
      ],
      tags: ["B2B Marketplace", "Textile & Apparel", "Sanganeri Ecosystem", "Financed Trade"],
      relevanceScore: 88
    },
    {
      id: "f-110",
      fellowId: "bhoomik",
      fellowName: "Bhoomik Setva",
      founderName: "Nishchal Chaudhary",
      designation: "Founder & Chief Executive Officer",
      companyName: "Batt:RE Electric Mobility",
      website: "https://battre.in",
      linkedinUrl: "https://www.linkedin.com/in/nishchal-chaudhary-b31a311",
      publicContact: "support@battre.in / info@battre.in",
      sector: "CleanTech & EV Mobility",
      businessModel: "Design and production of next-gen smart electric two-wheelers with IoT connectivity, swappable LFP batteries, and an extensive dealer franchise network across 18+ states.",
      companySummary: "Headquartered with manufacturing facilities in Jaipur, Batt:RE is one of Rajasthan's leading clean mobility startups, engineered to make electric commuting affordable, reliable, and easily repairable.",
      attendedEvents: true,
      eventAttendanceStatus: "EV Summit & Clean Mobility Keynote",
      previousEvents: [
        "EV Expo India (Pragati Maidan, New Delhi)",
        "TiE Rajasthan Green Innovation Conclave",
        "Automotive Component Manufacturers Association (ACMA) Meet",
        "Rajasthan Renewable Energy & EV Investors Meet"
      ],
      relevanceToFoundersConnect: "Essential speaker for hardware, IoT connectivity, battery technology, green certifications, and scaling physical manufacturing supply chains out of Jaipur.",
      sourceLinks: [
        { label: "Batt:RE Official", url: "https://battre.in" },
        { label: "Autocar Professional Feature", url: "https://www.autocarpro.in" },
        { label: "SME Futures CleanTech Review", url: "https://smefutures.com" }
      ],
      tags: ["EV", "CleanTech", "Hardware & IoT", "Mobility"],
      relevanceScore: 92
    }
  ]
};

// Generate initial placeholder leads for Fellows 2 through 9 so the skeleton is 100% interactive
const SECTOR_BY_FELLOW = {
  "fellow-2": { sector: "SaaS & Enterprise", theme: "Cloud, AI & Workflow" },
  "fellow-3": { sector: "D2C & Home Retail", theme: "Lifestyle, Craft & Direct Consumer" },
  "fellow-4": { sector: "FinTech & MSME Lending", theme: "Micro-loans, Payments & Insurtech" },
  "fellow-5": { sector: "AgriTech & Rural Tech", theme: "Farm Inputs & Post-Harvest Tech" },
  "fellow-6": { sector: "HealthTech & Telemedicine", theme: "Clinical AI, Diagnostics & Pharmacy" },
  "fellow-7": { sector: "CleanTech & EV Mobility", theme: "Solar, Smart Grid & Electric Vehicles" },
  "fellow-8": { sector: "EdTech & Skilling", theme: "Test Prep, Vocational & Upskilling" },
  "fellow-9": { sector: "DeepTech, IoT & Hardware", theme: "Embedded Systems, Robotics & Drones" }
};

// Seed realistic placeholder structure for fellow 2 to 9
TEAM_MEMBERS.slice(1).forEach((fellow, index) => {
  const fellowMeta = SECTOR_BY_FELLOW[fellow.id] || { sector: "SaaS & Enterprise", theme: "Emerging Tech" };
  const mockFounders = [];
  
  for (let i = 1; i <= 10; i++) {
    const leadNum = (index + 2) * 100 + i;
    mockFounders.push({
      id: `f-${leadNum}`,
      fellowId: fellow.id,
      fellowName: fellow.name,
      founderName: `Founder Candidate #${i} (${fellow.name})`,
      designation: i % 2 === 0 ? "Co-Founder & CEO" : "Founder & Managing Director",
      companyName: `${fellowMeta.theme.split(" ")[0]} Innovations ${i}`,
      website: "https://example.com",
      linkedinUrl: "https://www.linkedin.com/in/",
      publicContact: `contact@candidate${i}.in`,
      sector: fellowMeta.sector,
      businessModel: `Specialized ${fellowMeta.theme} business model operating out of Jaipur targeting regional and national clients with tech-driven delivery.`,
      companySummary: `Emerging venture identified by ${fellow.name} focusing on ${fellowMeta.theme}. Candidate has demonstrated scalable unit economics and active regional presence in Rajasthan.`,
      attendedEvents: i % 3 !== 0,
      eventAttendanceStatus: i % 3 !== 0 ? "Attended Regional Meetups" : "Emerging / Research Stage",
      previousEvents: [
        "TiE Rajasthan Startup Mixer",
        "Rajasthan DigiFest Tech Exhibit"
      ],
      relevanceToFoundersConnect: `Strong synergy for the ${fellowMeta.sector} track at Founders Connect. Can contribute insights on sector-specific hurdles, talent acquisition in Jaipur, and partnership opportunities.`,
      sourceLinks: [
        { label: "Company Verification", url: "https://example.com" },
        { label: "Startup India Portal", url: "https://www.startupindia.gov.in" }
      ],
      tags: [fellowMeta.sector.split("&")[0].trim(), "Jaipur Ecosystem", "Fellow Research"],
      relevanceScore: 80 + (i % 15)
    });
  }
  FOUNDERS_DATA[fellow.id] = mockFounders;
});

