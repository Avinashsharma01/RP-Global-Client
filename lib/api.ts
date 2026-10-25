import {
  Product,
  JobOpening,
  ProjectGallery,
  AuthResponse,
  Lead,
  Partner,
  FAQItem,
  AdminFAQResponse,
  Certificate,
} from "./types";

export interface AdminSummaryData {
  metrics: {
    totalLeads: number;
    newLeads: number;
    evaluationLeads: number;
    wonLeads: number;
    totalProducts: number;
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
  };
  analytics?: {
    leadsByCategory?: Array<{ _id: string; count: number; totalValue?: number }>;
    leadsByStatus?: Array<{ _id: string; count: number }>;
    monthlyLeadTrends?: Array<{ _id: { year: number; month: number }; count: number }>;
  };
  recentLeads: Array<{
    _id: string;
    fullName: string;
    companyName: string;
    plantCategory: string;
    requiredCapacityKLD: string;
    status: string;
    createdAt: string;
  }>;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

/**
 * Generic fetch wrapper with timeout and JSON error handling
 */
async function fetcher<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
  try {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // Attach Authorization header if token exists in localStorage (browser-only)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("rpglobal_admin_token");
      if (token && !headers["Authorization"]) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Request failed with status ${response.status}`,
        error: data.error,
      };
    }

    return data;
  } catch (err: unknown) {
    return {
      success: false,
      message: "Network connection error. Server may be unreachable.",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export const api = {
  // Public Products / Plants
  getProducts: async () => {
    return fetcher<Product[]>("/products");
  },

  getProductBySlug: async (slug: string) => {
    return fetcher<Product>(`/products/${slug}`);
  },

  createProduct: async (productData: Partial<Product> | FormData) => {
    const isFormData = productData instanceof FormData;
    return fetcher<Product>("/products", {
      method: "POST",
      body: isFormData ? productData : JSON.stringify(productData),
      headers: isFormData ? {} : { "Content-Type": "application/json" },
    });
  },

  updateProduct: async (id: string, productData: Partial<Product> | FormData) => {
    const isFormData = productData instanceof FormData;
    return fetcher<Product>(`/products/${id}`, {
      method: "PUT",
      body: isFormData ? productData : JSON.stringify(productData),
      headers: isFormData ? {} : { "Content-Type": "application/json" },
    });
  },

  deleteProduct: async (id: string) => {
    return fetcher(`/products/${id}`, {
      method: "DELETE",
    });
  },

  // Public RFQ Lead Submission
  submitRFQ: async (body: FormData | Record<string, unknown>) => {
    const isFormData = body instanceof FormData;
    return fetcher<{ leadId: string }>("/rfq", {
      method: "POST",
      body: isFormData ? body : JSON.stringify(body),
      headers: isFormData
        ? {} // Let browser set multipart boundary
        : { "Content-Type": "application/json" },
    });
  },

  // Public & Admin Careers / ATS
  getJobs: async (department?: string) => {
    const query = department ? `?department=${encodeURIComponent(department)}` : "";
    return fetcher<JobOpening[]>(`/jobs${query}`);
  },

  getJobByIdentifier: async (identifier: string) => {
    return fetcher<JobOpening>(`/jobs/${identifier}`);
  },

  createJob: async (jobData: Partial<JobOpening>) => {
    return fetcher<JobOpening>("/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData),
    });
  },

  updateJob: async (id: string, jobData: Partial<JobOpening>) => {
    return fetcher<JobOpening>(`/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData),
    });
  },

  deleteJob: async (id: string) => {
    return fetcher(`/jobs/${id}`, {
      method: "DELETE",
    });
  },

  applyJob: async (jobId: string, formData: FormData) => {
    return fetcher<{ applicationId: string }>(`/jobs/${jobId}/apply`, {
      method: "POST",
      body: formData,
    });
  },

  // Public Gallery
  getGallery: async (
    params?: { category?: string; status?: string; featured?: boolean } | string
  ) => {
    let query = "";
    if (typeof params === "string") {
      query = params && params !== "ALL" ? `?category=${encodeURIComponent(params)}` : "";
    } else if (params) {
      const q = new URLSearchParams();
      if (params.category && params.category !== "ALL") q.set("category", params.category);
      if (params.status && params.status !== "ALL") q.set("status", params.status);
      if (params.featured) q.set("featured", "true");
      const qs = q.toString();
      query = qs ? `?${qs}` : "";
    }
    return fetcher<ProjectGallery[]>(`/gallery${query}`);
  },

  // Admin Auth
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  getMe: async () => {
    return fetcher("/auth/me");
  },

  // Admin Operations
  getAdminSummary: async () => {
    return fetcher<AdminSummaryData>("/admin/summary");
  },

  getAdminLeads: async (params: { status?: string; search?: string; page?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", params.page.toString());
    return fetcher<Lead[]>(`/rfq?${query.toString()}`);
  },

  updateLeadStatus: async (leadId: string, status: string, priority?: string) => {
    return fetcher(`/rfq/${leadId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, priority }),
    });
  },

  addLeadNote: async (leadId: string, note: string) => {
    return fetcher(`/rfq/${leadId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });
  },

  getAdminApplications: async (jobId?: string) => {
    const query = jobId ? `?jobId=${jobId}` : "";
    return fetcher(`/jobs/admin/applications${query}`);
  },

  updateApplicationStatus: async (applicationId: string, status: string, note?: string) => {
    return fetcher(`/jobs/admin/applications/${applicationId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, note }),
    });
  },

  createGalleryItem: async (formData: FormData | Record<string, unknown>) => {
    const isFormData = formData instanceof FormData;
    return fetcher<ProjectGallery>("/gallery", {
      method: "POST",
      body: isFormData ? formData : JSON.stringify(formData),
      headers: isFormData ? {} : { "Content-Type": "application/json" },
    });
  },

  updateGalleryItem: async (id: string, formData: FormData | Record<string, unknown>) => {
    const isFormData = formData instanceof FormData;
    return fetcher<ProjectGallery>(`/gallery/${id}`, {
      method: "PUT",
      body: isFormData ? formData : JSON.stringify(formData),
      headers: isFormData ? {} : { "Content-Type": "application/json" },
    });
  },

  deleteGalleryItem: async (id: string) => {
    return fetcher(`/gallery/${id}`, {
      method: "DELETE",
    });
  },

  uploadProjectGalleryImages: async (id: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    return fetcher<ProjectGallery>(`/gallery/${id}/images`, {
      method: "POST",
      body: formData,
    });
  },

  addProjectGalleryImageUrl: async (id: string, imageUrl: string) => {
    return fetcher<ProjectGallery>(`/gallery/${id}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    });
  },

  deleteProjectGalleryImage: async (id: string, imageUrl: string) => {
    return fetcher<ProjectGallery>(`/gallery/${id}/images`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    });
  },

  // Partners & Clients
  getPartners: async (category?: string) => {
    const query = category && category !== "ALL" ? `?category=${encodeURIComponent(category)}` : "";
    return fetcher<Partner[]>(`/partners${query}`);
  },

  getAllPartners: async () => {
    return fetcher<Partner[]>("/partners/all");
  },

  getPartnerById: async (id: string) => {
    return fetcher<Partner>(`/partners/${id}`);
  },

  createPartner: async (data: FormData | Partial<Partner>) => {
    const isFormData = data instanceof FormData;
    return fetcher<Partner>("/partners", {
      method: "POST",
      body: isFormData ? data : JSON.stringify(data),
      headers: isFormData ? {} : { "Content-Type": "application/json" },
    });
  },

  updatePartner: async (id: string, data: FormData | Partial<Partner>) => {
    const isFormData = data instanceof FormData;
    return fetcher<Partner>(`/partners/${id}`, {
      method: "PUT",
      body: isFormData ? data : JSON.stringify(data),
      headers: isFormData ? {} : { "Content-Type": "application/json" },
    });
  },

  deletePartner: async (id: string) => {
    return fetcher(`/partners/${id}`, {
      method: "DELETE",
    });
  },

  togglePartnerStatus: async (id: string) => {
    return fetcher<{ isActive: boolean }>(`/partners/${id}/toggle`, {
      method: "PATCH",
    });
  },

  // Public & Admin FAQ methods
  getFAQs: async (params?: { category?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.category && params.category !== "All") q.set("category", params.category);
    if (params?.search) q.set("search", params.search);
    const qs = q.toString() ? `?${q.toString()}` : "";
    return fetcher<FAQItem[]>(`/faqs${qs}`);
  },

  getAdminFAQs: async () => {
    return fetcher<FAQItem[]>("/faqs/admin/all");
  },

  getFAQById: async (id: string) => {
    return fetcher<FAQItem>(`/faqs/item/${id}`);
  },

  createFAQ: async (faqData: Partial<FAQItem>) => {
    return fetcher<FAQItem>("/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(faqData),
    });
  },

  updateFAQ: async (id: string, faqData: Partial<FAQItem>) => {
    return fetcher<FAQItem>(`/faqs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(faqData),
    });
  },

  deleteFAQ: async (id: string) => {
    return fetcher(`/faqs/${id}`, {
      method: "DELETE",
    });
  },

  reorderFAQs: async (orders: Array<{ id: string; order: number }>) => {
    return fetcher("/faqs/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orders }),
    });
  },

  // Certificates & Accreditations (Public & Admin CMS)
  getCertificates: async (params?: { category?: string; search?: string; includeInactive?: boolean }) => {
    const q = new URLSearchParams();
    if (params?.category && params.category !== "ALL") q.set("category", params.category);
    if (params?.search) q.set("search", params.search);
    if (params?.includeInactive) q.set("includeInactive", "true");
    const qs = q.toString() ? `?${q.toString()}` : "";
    return fetcher<Certificate[]>(`/certificates${qs}`);
  },

  getCertificateById: async (id: string) => {
    return fetcher<Certificate>(`/certificates/${id}`);
  },

  createCertificate: async (data: FormData | Partial<Certificate>) => {
    const isFormData = data instanceof FormData;
    return fetcher<Certificate>("/certificates", {
      method: "POST",
      body: isFormData ? data : JSON.stringify(data),
      headers: isFormData ? {} : { "Content-Type": "application/json" },
    });
  },

  updateCertificate: async (id: string, data: FormData | Partial<Certificate>) => {
    const isFormData = data instanceof FormData;
    return fetcher<Certificate>(`/certificates/${id}`, {
      method: "PUT",
      body: isFormData ? data : JSON.stringify(data),
      headers: isFormData ? {} : { "Content-Type": "application/json" },
    });
  },

  deleteCertificate: async (id: string) => {
    return fetcher(`/certificates/${id}`, {
      method: "DELETE",
    });
  },
};

