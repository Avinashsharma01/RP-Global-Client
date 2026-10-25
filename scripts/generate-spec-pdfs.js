/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const downloadsDir = path.join(__dirname, "../public/downloads");
const uploadsDir = path.join(__dirname, "../public/uploads");

if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function createPdfContent(title, subtitle, specs) {
  const streamLines = [
    "BT",
    "/F1 20 Tf",
    "50 740 Td",
    `(${title}) Tj`,
    "/F1 12 Tf",
    "0 -24 Td",
    `(${subtitle}) Tj`,
    "/F1 10 Tf",
    "0 -20 Td",
    "(R P GLOBAL PROJECTS | ISO 9001:2015 Turnkey EPC Contractor | Noida - Bihar) Tj",
    "0 -20 Td",
    "(-------------------------------------------------------------------------------------) Tj",
    "0 -25 Td",
    "/F1 12 Tf",
    "(TECHNICAL PERFORMANCE & MECHANICAL SPECIFICATIONS:) Tj",
    "/F1 10 Tf",
  ];

  specs.forEach((item) => {
    streamLines.push("0 -18 Td");
    streamLines.push(`( * ${item.label}: ${item.value}) Tj`);
  });

  streamLines.push("0 -30 Td");
  streamLines.push("(-------------------------------------------------------------------------------------) Tj");
  streamLines.push("0 -20 Td");
  streamLines.push("(Contact Engineering Desk: info@rpglobalprojects.com | +91 7739283565) Tj");
  streamLines.push("ET");

  const streamContent = streamLines.join("\n");
  const streamLength = Buffer.byteLength(streamContent, "utf-8");

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page
   /Parent 2 0 R
   /MediaBox [0 0 595 842]
   /Resources << /Font << /F1 5 0 R >> >>
   /Contents 4 0 R
>>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${streamContent}
endstream
endobj
5 0 obj
<< /Type /Font
   /Subtype /Type1
   /BaseFont /Helvetica-Bold
>>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000252 00000 n 
000000${String(310 + streamLength).padStart(4, "0")} 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${390 + streamLength}
%%EOF
`;
  return pdf;
}

const SPEC_FILES = [
  {
    filename: "rpglobal-dm-plants-spec.pdf",
    title: "DEMINERALIZATION (DM) PLANTS - TECHNICAL SPECIFICATION",
    subtitle: "Turnkey Two-Bed & Mixed-Bed High Purity Deionization Systems",
    specs: [
      { label: "Conductivity (Mixed Bed)", value: "< 0.1 uS/cm at 25 deg C" },
      { label: "Reactive Silica as SiO2", value: "< 0.02 ppm max" },
      { label: "Capacity Range", value: "500 LPH to 100 m3/hr" },
      { label: "Vessel MOC", value: "FRP / Rubber-Lined Mild Steel (MSRL)" },
      { label: "Automation", value: "PLC with Automated Acid/Alkali Regeneration" },
    ],
  },
  {
    filename: "rpglobal-etp-plants-spec.pdf",
    title: "EFFLUENT TREATMENT PLANTS (ETP) - TECHNICAL SPECIFICATION",
    subtitle: "Industrial Chemical Coagulation, Biological MBBR & ZLD Evaporation",
    specs: [
      { label: "COD Reduction Efficiency", value: "> 90% (Inlet up to 10,000 mg/L)" },
      { label: "BOD Reduction Efficiency", value: "> 95% (Discharge < 10 mg/L)" },
      { label: "TSS in Treated Water", value: "< 10 mg/L" },
      { label: "Capacity Range", value: "10 KLD to 2,000+ KLD" },
      { label: "Compliance Standard", value: "Guaranteed CPCB / State Pollution Board Norms" },
    ],
  },
  {
    filename: "rpglobal-ro-plants-spec.pdf",
    title: "REVERSE OSMOSIS (RO) PLANTS - TECHNICAL SPECIFICATION",
    subtitle: "Industrial Brackish & Seawater Desalination Membrane Systems",
    specs: [
      { label: "Salt Rejection Rate", value: "> 99.2% via TFC Polyamide Membranes" },
      { label: "Permeate Recovery", value: "Up to 80% with Multi-Stage Concentration" },
      { label: "Capacity Range", value: "250 LPH to 200 m3/hr" },
      { label: "High Pressure Pump", value: "Grundfos / CNP SS316 Multistage Vertical" },
      { label: "Pre-Treatment", value: "Sand + Carbon Filters + Antiscalant Dosing" },
    ],
  },
  {
    filename: "rpglobal-stp-plants-spec.pdf",
    title: "SEWAGE TREATMENT PLANTS (STP) - TECHNICAL SPECIFICATION",
    subtitle: "MBBR / MBR / SBR Odourless Domestic & Commercial Wastewater Plants",
    specs: [
      { label: "Treated BOD", value: "< 10 mg/L (Safe for Toilet Flushing & Horticulture)" },
      { label: "Treated COD", value: "< 50 mg/L" },
      { label: "Total Suspended Solids", value: "< 10 mg/L" },
      { label: "Bio-Media MOC", value: "Virgin HDPE Media (550 m2/m3 Surface Area)" },
      { label: "Capacity Range", value: "25 KLD to 5,000+ KLD" },
    ],
  },
  {
    filename: "rpglobal-softener-plants-spec.pdf",
    title: "WATER SOFTENING PLANTS - TECHNICAL SPECIFICATION",
    subtitle: "Automatic Ion-Exchange Resin Hardness Elimination Systems",
    specs: [
      { label: "Outlet Hardness", value: "< 5 ppm as CaCO3" },
      { label: "Resin Type", value: "Strong Acid Cation (Gel Type High Exchange Capacity)" },
      { label: "Capacity Range", value: "500 LPH to 150 m3/hr" },
      { label: "Multiport Valve", value: "Automatic Time/Volume Initiated Regeneration" },
      { label: "Applications", value: "Cooling Towers, Boiler Feeds, Hotels, Hospitals" },
    ],
  },
  {
    filename: "rpglobal-wtp-plants-spec.pdf",
    title: "WATER TREATMENT PLANTS (WTP) - TECHNICAL SPECIFICATION",
    subtitle: "Turnkey Surface & River Water Purification Plants",
    specs: [
      { label: "Outlet Turbidity", value: "< 1 NTU (Drinking Water Standard IS:10500)" },
      { label: "Pathogen Removal", value: "Complete Disinfection via Gas/Liquid Chlorination" },
      { label: "Capacity Range", value: "1 MLD to 50 MLD" },
      { label: "Clarification Tech", value: "High-Rate Lamella Clarifiers + Rapid Sand Gravity" },
      { label: "Delivery Model", value: "Turnkey EPC with Civil, Mechanical & Electrical" },
    ],
  },
];

SPEC_FILES.forEach((f) => {
  const filePath = path.join(downloadsDir, f.filename);
  fs.writeFileSync(filePath, createPdfContent(f.title, f.subtitle, f.specs));
  console.log(`[Generated] Spec PDF: ${f.filename}`);
});

// Sample ATS Resume
const resumePdf = createPdfContent(
  "APPLICANT RESUME - R P GLOBAL PROJECTS CAREERS",
  "Senior Water & Wastewater Commissioning Engineer",
  [
    { label: "Candidate Name", value: "Demo Applicant" },
    { label: "Education", value: "B.Tech Chemical / Environmental Engineering" },
    { label: "Experience", value: "6+ Years Industrial STP / ETP Execution" },
    { label: "Skills", value: "MBBR, ZLD, MEE Skids, SCADA, CPCB Compliance" },
    { label: "Notice Period", value: "30 Days / Immediate" },
  ]
);
fs.writeFileSync(path.join(uploadsDir, "sample-resume.pdf"), resumePdf);
console.log("[Generated] Sample Resume PDF: sample-resume.pdf");
