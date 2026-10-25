# R P Global Projects — Client Portal & Enterprise Backoffice

Modern Clean-Tech Web Portal & Enterprise Backoffice for **R P Global Projects** ([rpglobalprojects.com](https://rpglobalprojects.com/)), an ISO 9001:2015 certified turnkey engineering contractor specializing in industrial water and wastewater treatment plants (DM, ETP, RO, STP, Softeners, and WTP).

---

## 🚀 Technology Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Partial Prerendering)
* **UI Library:** [React 19](https://react.dev/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Typography:** [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (Primary Sans) & [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (Technical & Data Specs) via `next/font/google`
* **Icons:** [Lucide React](https://lucide.dev/)
* **Package Manager:** `pnpm`
* **Language:** TypeScript 5 (Strict Mode)

---

## 📁 Directory Structure

```
client/
├── app/
│   ├── layout.tsx                     # Root HTML layout with self-hosted fonts & global wrapper
│   ├── globals.css                    # Tailwind v4 theme tokens, custom industrial scrollbars
│   ├── page.tsx                       # Homepage (Hero, Who We Are, Calculator, Solutions Grid, Metrics)
│   ├── about-us/page.tsx              # About RP Global, 5-Stage EPC Lifecycle, Certifications
│   ├── solutions/
│   │   ├── page.tsx                   # Solutions catalog index
│   │   └── [slug]/page.tsx            # Dynamic pre-rendered pages for all 6 core industrial plants
│   ├── career/page.tsx                # Careers portal with department filters & CV upload modal
│   ├── gallery/page.tsx               # Commissioned plant installation showcase with lightbox
│   ├── contact-us/page.tsx            # Dual-office directory (Noida & Gopalganj) & Technical RFQ form
│   └── admin/                         # Enterprise Backoffice Console
│       ├── layout.tsx                 # Protected admin shell with sidebar, user badge, and guards
│       ├── login/page.tsx             # Staff authentication portal
│       ├── page.tsx                   # Operations KPI Dashboard with recent leads table
│       ├── leads/page.tsx             # RFQ Leads CRM with status workflow & PDF report viewer
│       ├── products/page.tsx          # Product Catalog CMS with dynamic technical spec editor
│       ├── jobs/page.tsx              # Recruitment ATS pipeline with candidate CV preview
│       └── gallery/page.tsx           # Installation Photo & Project Manager
├── components/
│   ├── layout/                        # TopBar, Navbar (Mega Menu), Footer, WhatsAppTrigger, ClientLayoutWrapper
│   ├── home/                          # Hero, WhoWeAre, PlantCalculator, SolutionsGrid, ValueProposition, MetricsSection, ClientMarquee, QuickRFQModal
│   ├── solutions/                     # ProcessFlowchart, SpecTable, TechnologyComparison, InlineRFQ
│   └── shared/                        # Modals, buttons, badges, file uploads
└── lib/
    ├── api.ts                         # Type-safe API client with JWT attachment & network fallbacks
    ├── constants.ts                   # Dual-office contact info, plant specs, navigation constants
    ├── types.ts                       # Shared TypeScript interfaces
    └── utils.ts                       # clsx and tailwind-merge helper (cn)
```

---

## 🎨 Industrial Clean-Tech Design System

The application uses an authoritative industrial color palette configured in `app/globals.css`:

* **Deep Navy (`#0A192F` / `#020C1B`):** Structural backdrops, footers, and admin sidebar.
* **Cobalt Blue (`#0077B6`):** Primary branding, interactive buttons, and highlight accents.
* **High-Tech Cyan (`#00E5FF`):** Water droplet highlights, live indicators, and tech accents.
* **Eco Emerald (`#10B981`):** CPCB environmental compliance badges, success indicators.
* **Slate Surfaces (`#F8FAFC` / `#FFFFFF`):** Readable, high-contrast content containers.

---

## 🌐 Public Pages & Features

1. **Homepage (`/`)**:
   * **Hero Section:** Value badges (100+ Plants, 12+ Yrs, 99.4% Compliance) and direct quotation CTA.
   * **Who We Are:** Authentic company heritage, ISO 9001:2015 accreditation, in-house manufacturing, and 3 value pillars.
   * **Plant Capacity Estimator:** Interactive 3-step KLD slider with instant technology recommendations.
   * **6 Core Solutions Grid:** High-level specifications and direct links for all 6 plants.
   * **Why Choose RP Global:** 6 industrial engineering pillars (Fabrication, Compliance, SCADA, EPC, O&M, ZLD).
   * **Verified Metrics Counter:** JetBrains Mono numbers displaying key operational metrics.
   * **Client Industries Marquee:** Sectors powered (Pharma, Textiles, F&B, Chemicals, Auto, Commercial).
   * **Quick RFQ Modal:** Fast-track lead submission modal pre-filled from calculator or cards.

2. **Dynamic Plant Pages (`/solutions/[slug]`)**:
   * Pre-rendered routes for:
     * `demineralization-plants` (DM)
     * `effluent-treatment-plants` (ETP)
     * `reverse-osmosis-plants` (RO)
     * `sewage-treatment-plants` (STP)
     * `water-softening-plants`
     * `water-treatment-plants` (WTP)
   * Each page includes a **Step-by-Step Process Flowchart**, **Technical Engineering Parameter Table** (guaranteed FAT values), **Technology Comparison Matrix** (e.g. MBBR vs SBR vs MBR), and an **Inline RFQ Form**.

3. **About Us (`/about-us`)**:
   * EPC turnkey lifecycle diagram (Water Analysis ➔ P&ID Design ➔ Fabrication ➔ Commissioning ➔ O&M).
   * Quality policy, vision, and environmental mission.

4. **Careers (`/career`)**:
   * Open positions fetched dynamically with department filters.
   * Drag-and-drop resume upload sending multipart form data to `/api/v1/jobs/:id/apply`.

5. **Project Gallery (`/gallery`)**:
   * Filterable installation showcase with capacity tags, location, and lightbox modal.

6. **Contact Us (`/contact-us`)**:
   * Dual-office cards for Noida Corporate Office and Gopalganj Head Office.
   * Embedded interactive Google Maps iframe.
   * Full engineering RFQ portal with raw water test report PDF attachment.

7. **Floating WhatsApp Widget:**
   * Bottom-right trigger opening direct WhatsApp chat to `+91 7739283565`.

---

## 🛡️ Enterprise Admin Backoffice (`/admin`)

Access the management console at [http://localhost:3000/admin](http://localhost:3000/admin):

* **Admin Login (`/admin/login`):** JWT token persistence with fallback demo login.
* **Dashboard Overview (`/admin`):** 4 real-time KPI metric cards and recent leads stream.
* **Leads CRM (`/admin/leads`):** Search, filter by category/status, progression pipeline (`NEW` ➔ `CONTACTED` ➔ `TECHNICAL_EVALUATION` ➔ `PROPOSAL_SENT` ➔ `WON`/`LOST`), water report PDF viewer, and internal notes.
* **Product Catalog CMS (`/admin/products`):** Manage plant listings with dynamic key-value technical parameter builders.
* **Recruitment ATS (`/admin/jobs`):** Manage job postings and candidate pipelines with direct CV view links and stage changers (`SUBMITTED` ➔ `SHORTLISTED` ➔ `INTERVIEW_SCHEDULED` ➔ `REJECTED` ➔ `HIRED`).
* **Gallery Manager (`/admin/gallery`):** Upload new commissioned plant installation photos with capacity, location, client sector, and featured flags.

---

## ⚙️ Environment Variables

Create `.env.local` inside `client/`:

```env
# URL pointing to the Express REST API
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## 🛠️ Development & Build Commands

```bash
# Install dependencies
pnpm install

# Start Next.js development server (runs on http://localhost:3000)
pnpm dev

# Build optimized production bundle
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```
