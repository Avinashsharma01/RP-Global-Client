export const COMPANY_INFO = {
  name: "R P Global Projects",
  tagline: "Water and wastewater treatment systems",
  subtitle: "Industrial water treatment engineering and project delivery",
  phone: "+91 7739283565",
  phoneRaw: "917739283565",
  email: "info@rpglobalprojects.com",
  workingHours: "Monday – Saturday: 10:00 AM – 6:00 PM",
  accreditation: "ISO 9001:2015 Certified",
  experienceYears: "12+",
  projectsCompleted: "100+",
  complianceRate: "99.4%",
  enterpriseClients: "50+",
  whatsappUrl:
    "https://wa.me/917739283565?text=Hello%20R%20P%20Global%20Projects,%20I%20would%20like%20to%20request%20a%20Technical%20Quotation%20for%20a%20Water/Wastewater%20Treatment%20Plant.",
};

export const OFFICES = {
  corporate: {
    title: "Corporate Office (NCR)",
    address: "C-78, Cabin No-6, Second Floor, Sector-2",
    city: "Noida, Uttar Pradesh – 201301",
    country: "India",
    phone: "+91 7739283565",
    email: "info@rpglobalprojects.com",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.7317377854297!2d77.31175657618992!3d28.57781358654877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce457f9dc6e83%3A0xb3551532822a969f!2sSector%202%2C%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  },
  registered: {
    title: "Head / Registered Office",
    address: "Vill- Mahuawan, Post- Mahuawan",
    city: "Dist- Gopalganj, Bihar – 841437",
    country: "India",
    phone: "+91 7739283565",
    email: "info@rpglobalprojects.com",
  },
};

export interface PlantMenuItem {
  name: string;
  shortName: string;
  slug: string;
  category: string;
  capacity: string;
  tagline: string;
  iconName: string;
}

export const PLANT_SOLUTIONS: PlantMenuItem[] = [
  {
    name: "Demineralization (DM) Plants",
    shortName: "DM Plant",
    slug: "demineralization-plants",
    category: "DEMINERALIZATION_DM",
    capacity: "500 LPH – 100 m³/hr",
    tagline: "Deionized ultra-pure water with conductivity < 0.1 µS/cm for high-pressure boilers and pharma.",
    iconName: "Droplets",
  },
  {
    name: "Effluent Treatment Plants (ETP)",
    shortName: "ETP Plant",
    slug: "effluent-treatment-plants",
    category: "EFFLUENT_TREATMENT_ETP",
    capacity: "10 KLD – 2000+ KLD",
    tagline: "Industrial wastewater remediation, chemical precipitation & Zero Liquid Discharge (ZLD).",
    iconName: "ShieldAlert",
  },
  {
    name: "Reverse Osmosis (RO) Plants",
    shortName: "RO Plant",
    slug: "reverse-osmosis-plants",
    category: "REVERSE_OSMOSIS_RO",
    capacity: "250 LPH – 200 m³/hr",
    tagline: "High-rejection membrane separation for brackish & sea water desalination (>98.5% salt rejection).",
    iconName: "Filter",
  },
  {
    name: "Sewage Treatment Plants (STP)",
    shortName: "STP Plant",
    slug: "sewage-treatment-plants",
    category: "SEWAGE_TREATMENT_STP",
    capacity: "25 KLD – 5000+ KLD",
    tagline: "Odourless biological MBBR, SBR & MBR technologies for flushing & horticulture water recycling.",
    iconName: "RefreshCw",
  },
  {
    name: "Water Softening Plants",
    shortName: "Water Softener",
    slug: "water-softening-plants",
    category: "WATER_SOFTENING",
    capacity: "500 LPH – 150 m³/hr",
    tagline: "Ion-exchange resin hardness elimination (< 5 ppm) protecting boilers and cooling towers.",
    iconName: "Sparkles",
  },
  {
    name: "Water Treatment Plants (WTP)",
    shortName: "WTP Plant",
    slug: "water-treatment-plants",
    category: "WATER_TREATMENT_WTP",
    capacity: "1 MLD – 50 MLD",
    tagline: "Municipal & industrial surface water clarification, coagulation & rapid sand filtration.",
    iconName: "Waves",
  },
];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Solutions", href: "/solutions", hasDropdown: true },
  { label: "Project Gallery", href: "/gallery" },
  { label: "Careers", href: "/career" },
  { label: "Contact Us", href: "/contact-us" },
];
