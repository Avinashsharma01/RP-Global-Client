export type PlantCategory =
  | "DEMINERALIZATION_DM"
  | "EFFLUENT_TREATMENT_ETP"
  | "REVERSE_OSMOSIS_RO"
  | "SEWAGE_TREATMENT_STP"
  | "WATER_SOFTENING"
  | "WATER_TREATMENT_WTP";

export interface ProcessStep {
  stepNumber: number;
  title: string;
  description: string;
  equipmentUsed?: string;
}

export interface TechnicalSpec {
  label: string;
  value: string;
  unit?: string;
  category?: string;
}

export interface ComparisonRow {
  parameter: string;
  techOptionA: string;
  techOptionB: string;
  techOptionC?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: PlantCategory;
  tagline: string;
  capacityRange: string;
  summary: string;
  description: string;
  keyFeatures: string[];
  processSteps: ProcessStep[];
  technicalSpecs: TechnicalSpec[];
  comparisonMatrix?: ComparisonRow[];
  applications: string[];
  imageUrl: string;
  brochureUrl?: string;
  order: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface InletParameters {
  pH?: string;
  TDS?: string;
  COD?: string;
  BOD?: string;
  TSS?: string;
  oilGrease?: string;
}

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "TECHNICAL_EVALUATION"
  | "PROPOSAL_SENT"
  | "WON"
  | "LOST";

export type LeadPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface InternalNote {
  text: string;
  author: string;
  createdAt: string;
}

export interface Lead {
  _id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  plantCategory: string;
  requiredCapacityKLD?: string;
  rawWaterSource?: string;
  inletParameters?: InletParameters;
  projectLocation?: string;
  message?: string;
  attachedReportUrl?: string;
  attachedReportFilename?: string;
  status: LeadStatus;
  priority: LeadPriority;
  internalNotes: InternalNote[];
  estimatedValueINR?: number;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobOpening {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: "Full-time" | "Contract" | "Part-time" | "Internship";
  experienceRequired: string;
  positionsOpen: number;
  responsibilities: string[];
  qualifications: string[];
  salaryRange?: string;
  isActive: boolean;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus =
  | "SUBMITTED"
  | "SHORTLISTED"
  | "INTERVIEW_SCHEDULED"
  | "OFFERED"
  | "REJECTED"
  | "HIRED";

export interface JobApplication {
  _id: string;
  jobOpeningId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  currentCompany?: string;
  currentCtc?: string;
  expectedCtc?: string;
  noticePeriodDays?: number;
  experienceYears?: string;
  resumeUrl: string;
  resumeFilename: string;
  coverNote?: string;
  status: ApplicationStatus;
  internalNotes: InternalNote[];
  createdAt: string;
}

export interface ProjectGallery {
  _id: string;
  id?: string;
  title: string;
  category: string;
  capacityKLD: string;
  location: string;
  clientSector: string;
  imageUrl: string;
  images?: string[];
  status?: "RUNNING" | "COMPLETED";
  progressPercentage?: number;
  currentStage?: string;
  expectedCompletion?: string;
  keyHighlights?: string[];
  completionYear?: number;
  isFeatured: boolean;
  order: number;
  createdAt?: string;
}

export interface ClientTestimonial {
  _id: string;
  clientName: string;
  designation: string;
  company: string;
  feedback: string;
  rating: number;
  plantInstalled: string;
  isApproved: boolean;
  order: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: "SUPER_ADMIN" | "SALES_MANAGER" | "HR_MANAGER" | "EDITOR";
  lastLogin?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface Partner {
  _id: string;
  name: string;
  logoUrl: string;
  category: string;
  website?: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FAQItem {
  _id: string;
  id?: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminFAQResponse {
  metrics: {
    total: number;
    active: number;
    inactive: number;
    categories: number;
  };
  categories: string[];
  data: FAQItem[];
}

export interface Certificate {
  _id: string;
  title: string;
  subtitle?: string;
  issuingAuthority: string;
  certificateNumber: string;
  category: "ISO" | "GOVERNMENT" | "LABOUR" | "CONTRACTOR" | "COMPLIANCE" | "OTHER";
  issueDate?: string;
  expiryDate?: string;
  imageUrl: string;
  pdfUrl?: string;
  verificationUrl?: string;
  description?: string;
  order: number;
  isActive: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}


