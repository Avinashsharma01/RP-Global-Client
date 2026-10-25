"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Users,
  FileText,
  Plus,
  CheckCircle2,
  X,
  Phone,
  Mail,
  MapPin,
  Loader2,
  AlertCircle,
  Search,
  CalendarDays,
  Clock3,
} from "lucide-react";
import { ApplicationStatus, JobOpening } from "@/lib/types";
import { api } from "@/lib/api";

interface AdminJob {
  id: string;
  title: string;
  department: string;
  location: string;
  experience: string;
  positionsOpen: number;
  isActive: boolean;
}

interface AdminApplicant {
  id: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  currentCompany: string;
  experienceYears: string;
  resumeUrl: string;
  status: ApplicationStatus;
  appliedDate: string;
}

const DEMO_JOBS: AdminJob[] = [
  {
    id: "job-1",
    title: "Senior Water Treatment Process Engineer",
    department: "Engineering & Design",
    location: "Noida, Uttar Pradesh",
    experience: "5-8 Years",
    positionsOpen: 2,
    isActive: true,
  },
  {
    id: "job-2",
    title: "STP / ETP Plant Commissioning Specialist",
    department: "Operations & Commissioning",
    location: "Site Locations (Pan-India)",
    experience: "3-6 Years",
    positionsOpen: 3,
    isActive: true,
  },
  {
    id: "job-3",
    title: "Industrial Sales & Business Development Manager - Water EPC",
    department: "Sales & Marketing",
    location: "Noida, Uttar Pradesh",
    experience: "4-7 Years",
    positionsOpen: 1,
    isActive: true,
  },
];

const DEMO_APPLICANTS: AdminApplicant[] = [
  {
    id: "app-1",
    jobTitle: "Senior Water Treatment Process Engineer",
    fullName: "Vipul Saxena",
    email: "vipul.saxena@gmail.com",
    phone: "+91 9811882233",
    currentCompany: "Thermax Ltd",
    experienceYears: "6.5 Years",
    resumeUrl: "/uploads/sample-resume.pdf",
    status: "SHORTLISTED",
    appliedDate: "Today, 11:30 AM",
  },
  {
    id: "app-2",
    jobTitle: "STP / ETP Plant Commissioning Specialist",
    fullName: "Rakesh Sharma",
    email: "rakesh.sharma@yahoo.com",
    phone: "+91 9765432109",
    currentCompany: "Voltas Water Solutions",
    experienceYears: "4 Years",
    resumeUrl: "/uploads/sample-resume.pdf",
    status: "INTERVIEW_SCHEDULED",
    appliedDate: "Yesterday",
  },
  {
    id: "app-3",
    jobTitle: "Industrial Sales & Business Development Manager - Water EPC",
    fullName: "Neha Tiwari",
    email: "neha.tiwari@salespro.com",
    phone: "+91 9988112233",
    currentCompany: "Ion Exchange India",
    experienceYears: "5 Years",
    resumeUrl: "/uploads/sample-resume.pdf",
    status: "SUBMITTED",
    appliedDate: "Oct 9, 2026",
  },
];

const STAGE_OPTIONS: ApplicationStatus[] = [
  "SUBMITTED",
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
  "OFFERED",
  "REJECTED",
  "HIRED",
];

const STAGE_LABELS: Record<ApplicationStatus, string> = {
  SUBMITTED: "Submitted",
  SHORTLISTED: "Shortlisted",
  INTERVIEW_SCHEDULED: "Interview scheduled",
  OFFERED: "Offer made",
  REJECTED: "Not selected",
  HIRED: "Hired",
};

export default function JobsATSPage() {
  const [activeTab, setActiveTab] = useState<"applicants" | "openings">("applicants");
  const [jobs, setJobs] = useState<AdminJob[]>(DEMO_JOBS);
  const [applicants, setApplicants] = useState<AdminApplicant[]>(DEMO_APPLICANTS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [applicantSearch, setApplicantSearch] = useState("");
  const [applicantStageFilter, setApplicantStageFilter] = useState<"ALL" | ApplicationStatus>("ALL");
  const [jobSearch, setJobSearch] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  // New Job State
  const [newTitle, setNewTitle] = useState("");
  const [newDept, setNewDept] = useState("Engineering & Design");
  const [newLocation, setNewLocation] = useState("Noida, Uttar Pradesh");
  const [newExp, setNewExp] = useState("3-5 Years");

  useEffect(() => {
    let isMounted = true;
    const fallbackTimer = window.setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 8000);

    const loadData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.allSettled([
          api.getJobs(),
          api.getAdminApplications(),
        ]);

        if (!isMounted) return;

        if (jobsRes.status === "fulfilled" && jobsRes.value.success && jobsRes.value.data && jobsRes.value.data.length > 0) {
          setJobs(
            jobsRes.value.data.map((j: JobOpening) => ({
              id: j._id || j.slug,
              title: j.title,
              department: j.department,
              location: j.location,
              experience: j.experienceRequired,
              positionsOpen: j.positionsOpen || 1,
              isActive: j.isActive ?? true,
            }))
          );
        }

        if (appsRes.status === "fulfilled" && appsRes.value.success && Array.isArray((appsRes.value as { data?: unknown[] }).data) && ((appsRes.value as { data: unknown[] }).data.length > 0)) {
          const rawApps = (appsRes.value as { data: Array<{ _id?: string; id?: string; jobTitle?: string; fullName?: string; email?: string; phone?: string; currentCompany?: string; experienceYears?: string; resumeUrl?: string; status?: ApplicationStatus; createdAt?: string }> }).data;
          setApplicants(
            rawApps.map((a) => ({
              id: a._id || a.id || `app-${Date.now()}`,
              jobTitle: a.jobTitle || "Engineering Position",
              fullName: a.fullName || "Candidate",
              email: a.email || "",
              phone: a.phone || "",
              currentCompany: a.currentCompany || "N/A",
              experienceYears: a.experienceYears || "N/A",
              resumeUrl: a.resumeUrl || "/uploads/sample-resume.pdf",
              status: a.status || "SUBMITTED",
              appliedDate: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "Recent",
            }))
          );
        }
      } catch (err) {
        console.warn("Could not load live ATS data, falling back to local demo state", err);
      } finally {
        window.clearTimeout(fallbackTimer);
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  const handleToggleJob = async (id: string) => {
    const target = jobs.find((j) => j.id === id);
    if (!target) return;
    const newStatus = !target.isActive;

    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, isActive: newStatus } : j))
    );

    try {
      await api.updateJob(id, { isActive: newStatus });
      setBanner({
        type: "success",
        text: `Opening status updated to ${newStatus ? "Active" : "Archived"}.`,
      });
    } catch (err: unknown) {
      console.warn("Could not sync job toggle to server", err);
    }
  };

  const handleStageChange = async (appId: string, newStage: ApplicationStatus) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStage } : a))
    );

    try {
      await api.updateApplicationStatus(appId, newStage);
      setBanner({
        type: "success",
        text: `Candidate hiring stage updated to ${newStage.replace(/_/g, " ")}.`,
      });
    } catch (err: unknown) {
      console.warn("Could not sync applicant stage to server", err);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    setCreating(true);
    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    try {
      const res = await api.createJob({
        title: newTitle,
        slug,
        department: newDept,
        location: newLocation,
        experienceRequired: newExp,
        positionsOpen: 1,
        isActive: true,
      });

      const newJob: AdminJob = {
        id: (res.data as { _id?: string })?._id || `job-${Date.now()}`,
        title: newTitle,
        department: newDept,
        location: newLocation,
        experience: newExp,
        positionsOpen: 1,
        isActive: true,
      };

      setJobs([newJob, ...jobs]);
      setBanner({
        type: "success",
        text: `Job opening "${newTitle}" created successfully.`,
      });
      setShowCreateModal(false);
      setNewTitle("");
    } catch (err: unknown) {
      const newJob: AdminJob = {
        id: `job-${Date.now()}`,
        title: newTitle,
        department: newDept,
        location: newLocation,
        experience: newExp,
        positionsOpen: 1,
        isActive: true,
      };
      setJobs([newJob, ...jobs]);
      setShowCreateModal(false);
      setNewTitle("");
      setBanner({
        type: "success",
        text: `Job opening "${newTitle}" created locally.`,
      });
    } finally {
      setCreating(false);
    }
  };

  const activeOpeningCount = jobs.filter((job) => job.isActive).length;
  const activePositionCount = jobs
    .filter((job) => job.isActive)
    .reduce((total, job) => total + job.positionsOpen, 0);
  const applicantsToReview = applicants.filter((applicant) =>
    ["SUBMITTED", "SHORTLISTED"].includes(applicant.status)
  ).length;
  const scheduledInterviews = applicants.filter(
    (applicant) => applicant.status === "INTERVIEW_SCHEDULED"
  ).length;
  const filteredApplicants = applicants.filter((applicant) => {
    const query = applicantSearch.trim().toLowerCase();
    const matchesSearch = !query || `${applicant.fullName} ${applicant.email} ${applicant.phone} ${applicant.jobTitle} ${applicant.currentCompany}`.toLowerCase().includes(query);
    const matchesStage = applicantStageFilter === "ALL" || applicant.status === applicantStageFilter;
    return matchesSearch && matchesStage;
  });
  const filteredJobs = jobs.filter((job) => {
    const query = jobSearch.trim().toLowerCase();
    const matchesSearch = !query || `${job.title} ${job.department} ${job.location}`.toLowerCase().includes(query);
    const matchesStatus = jobStatusFilter === "ALL" || (jobStatusFilter === "ACTIVE" ? job.isActive : !job.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-page mx-auto max-w-7xl space-y-6" aria-busy={loading}>
      {/* Header */}
      <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3.5">
          <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0077B6]">
            <Briefcase className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0077B6]">People operations</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.8rem]">
              Careers & hiring
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
              Review candidates, manage interview stages, and keep open roles up to date.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          {loading && (
            <span role="status" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Syncing hiring data…
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#0077B6] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#005f92]"
          >
            <Plus className="w-4 h-4" />
            <span>Post opening</span>
          </button>
        </div>
      </header>

      <section aria-label="Hiring pipeline summary" className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:grid-cols-4 sm:divide-x sm:divide-slate-200">
        {[
          { label: "Applicants", value: applicants.length, detail: "In the ATS", color: "text-slate-900" },
          { label: "Needs review", value: applicantsToReview, detail: "Submitted or shortlisted", color: "text-[#0077B6]" },
          { label: "Interviews", value: scheduledInterviews, detail: "Scheduled candidates", color: "text-amber-700" },
          { label: "Open positions", value: activePositionCount, detail: `${activeOpeningCount} active listings`, color: "text-emerald-700" },
        ].map((metric) => (
          <div key={metric.label} className={`px-4 py-3.5 sm:px-5 ${metric.label === "Applicants" || metric.label === "Needs review" ? "border-b border-slate-200 sm:border-b-0" : ""}`}>
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${metric.label === "Needs review" ? "bg-[#0077B6]" : metric.label === "Interviews" ? "bg-amber-500" : metric.label === "Open positions" ? "bg-emerald-500" : "bg-slate-400"}`} />
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{metric.label}</p>
            </div>
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <span className={`font-mono text-2xl font-semibold tabular-nums ${metric.color}`}>{metric.value}</span>
              <span className="hidden text-xs text-slate-500 sm:block">{metric.detail}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Action Feedback Banner */}
      {banner && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs animate-in fade-in ${
            banner.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center space-x-2">
            {banner.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{banner.text}</span>
          </div>
          <button
            onClick={() => setBanner(null)}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div
        className="flex gap-2 overflow-x-auto border-b border-slate-200"
        role="tablist"
        aria-label="Careers sections"
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          const nextTab = activeTab === "applicants" ? "openings" : "applicants";
          setActiveTab(nextTab);
          document.getElementById(nextTab === "applicants" ? "ats-applicants-tab" : "ats-openings-tab")?.focus();
        }}
      >
        <button
          type="button"
          id="ats-applicants-tab"
          role="tab"
          aria-selected={activeTab === "applicants"}
          aria-controls="ats-applicants-panel"
          tabIndex={activeTab === "applicants" ? 0 : -1}
          onClick={() => setActiveTab("applicants")}
          className={`inline-flex min-h-12 shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all sm:px-6 ${
            activeTab === "applicants"
              ? "border-[#0077B6] text-[#0077B6]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Applicants <span className="ml-1 opacity-70">{applicants.length}</span></span>
        </button>
        <button
          type="button"
          id="ats-openings-tab"
          role="tab"
          aria-selected={activeTab === "openings"}
          aria-controls="ats-openings-panel"
          tabIndex={activeTab === "openings" ? 0 : -1}
          onClick={() => setActiveTab("openings")}
          className={`inline-flex min-h-12 shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all sm:px-6 ${
            activeTab === "openings"
              ? "border-[#0077B6] text-[#0077B6]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Open positions <span className="ml-1 opacity-70">{jobs.length}</span></span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "applicants" ? (
        <section id="ats-applicants-panel" role="tabpanel" aria-labelledby="ats-applicants-tab" className="space-y-4">
        <div aria-label="Applicant filters" className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="relative w-full sm:max-w-sm sm:flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              aria-label="Search candidates by name, role, company, or contact"
              value={applicantSearch}
              onChange={(event) => setApplicantSearch(event.target.value)}
              placeholder="Search candidates, roles, or companies"
              className="min-h-10 w-full border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#0077B6]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="applicant-stage-filter" className="sr-only">Filter candidates by hiring stage</label>
            <select
              id="applicant-stage-filter"
              value={applicantStageFilter}
              onChange={(event) => setApplicantStageFilter(event.target.value as "ALL" | ApplicationStatus)}
              className="min-h-10 border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700"
            >
              <option value="ALL">All stages</option>
              {STAGE_OPTIONS.map((stage) => <option key={stage} value={stage}>{STAGE_LABELS[stage]}</option>)}
            </select>
            <span className="text-xs text-slate-500" aria-live="polite"><strong className="font-semibold text-slate-800">{filteredApplicants.length}</strong> of {applicants.length}</span>
          </div>
        </div>
        <div className="space-y-3 xl:hidden">
          {filteredApplicants.map((app) => (
            <article key={app.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="font-semibold text-slate-900">{app.fullName}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-700">{app.jobTitle}</p>
                </div>
                <label className="sr-only" htmlFor={`app-stage-${app.id}`}>Hiring stage for {app.fullName}</label>
                <select
                  id={`app-stage-${app.id}`}
                  value={app.status}
                  onChange={(event) => handleStageChange(app.id, event.target.value as ApplicationStatus)}
                  className="min-h-9 shrink-0 border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700"
                >
                  {STAGE_OPTIONS.map((stage) => <option key={stage} value={stage}>{STAGE_LABELS[stage]}</option>)}
                </select>
              </div>
              <div className="mt-3 flex flex-col gap-1 text-xs text-slate-500">
                <a href={`mailto:${app.email}`} className="inline-flex min-w-0 items-center gap-1.5 break-all hover:text-[#0077B6]"><Mail className="h-3.5 w-3.5 shrink-0" />{app.email}</a>
                <a href={`tel:${app.phone}`} className="inline-flex items-center gap-1.5 hover:text-[#0077B6]"><Phone className="h-3.5 w-3.5 shrink-0" />{app.phone}</a>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs">
                <div><p className="text-slate-400">Experience</p><p className="mt-0.5 font-medium text-slate-800">{app.experienceYears}</p></div>
                <div><p className="text-slate-400">Applied</p><p className="mt-0.5 inline-flex items-center gap-1.5 text-slate-700"><CalendarDays className="h-3.5 w-3.5 text-slate-400" />{app.appliedDate}</p></div>
                <div className="col-span-2"><p className="text-slate-400">Current company</p><p className="mt-0.5 font-medium text-slate-800">{app.currentCompany}</p></div>
              </div>
              <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-[#0077B6] hover:bg-blue-50">
                <FileText className="h-3.5 w-3.5" /> Preview CV
              </a>
            </article>
          ))}
          {filteredApplicants.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center"><div className="font-semibold text-slate-800">No applicants match these filters</div><p className="mt-1 text-sm text-slate-500">Try a different candidate search or hiring stage.</p></div>}
        </div>
        <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:block">
          <div className="overflow-x-auto" role="region" aria-label="Candidate applications table" tabIndex={0}>
            <table className="w-full min-w-[1120px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Candidate / Contact</th>
                  <th scope="col" className="px-5 py-3.5">Applied Role</th>
                  <th scope="col" className="px-5 py-3.5">Experience & Company</th>
                  <th scope="col" className="px-5 py-3.5">Applied</th>
                  <th scope="col" className="px-5 py-3.5">Resume CV</th>
                  <th scope="col" className="px-5 py-3.5">Hiring Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900">{app.fullName}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                        <a href={`mailto:${app.email}`} className="inline-flex items-center gap-1.5 hover:text-[#0077B6]">
                          <Mail className="h-3 w-3" />{app.email}
                        </a>
                        <a href={`tel:${app.phone}`} className="inline-flex items-center gap-1.5 hover:text-[#0077B6]">
                          <Phone className="h-3 w-3" />{app.phone}
                        </a>
                      </div>
                    </td>
                    <td className="max-w-xs px-5 py-4 font-medium text-slate-700">
                      <span className="line-clamp-2">{app.jobTitle}</span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="font-semibold text-slate-800">{app.experienceYears}</span>
                      <div className="text-[11px] text-slate-500">{app.currentCompany}</div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-slate-400" />{app.appliedDate}</span>
                    </td>
                    <td className="py-4 px-6">
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex whitespace-nowrap items-center space-x-1 text-[#0077B6] font-semibold hover:underline"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Preview CV</span>
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <select
                        aria-label={`Update hiring stage for ${app.fullName}`}
                        value={app.status}
                        onChange={(e) =>
                          handleStageChange(app.id, e.target.value as ApplicationStatus)
                        }
                        className="min-h-9 cursor-pointer bg-white px-2.5 py-1 text-xs font-semibold outline-none"
                      >
                        {STAGE_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {STAGE_LABELS[st]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredApplicants.length === 0 && <tr><td colSpan={6} className="px-5 py-14 text-center"><div className="font-semibold text-slate-800">No applicants match these filters</div><p className="mt-1 text-sm text-slate-500">Try a different candidate search or hiring stage.</p></td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        </section>
      ) : (
        <section id="ats-openings-panel" role="tabpanel" aria-labelledby="ats-openings-tab" className="space-y-4">
        <div role="group" aria-label="Opening filters" className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="relative w-full sm:max-w-sm sm:flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              aria-label="Search openings by title, department, or location"
              value={jobSearch}
              onChange={(event) => setJobSearch(event.target.value)}
              placeholder="Search roles, departments, or locations"
              className="min-h-10 w-full border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#0077B6]"
            />
          </div>
          <div role="group" aria-label="Filter openings by status" className="flex flex-wrap items-center gap-2">
            {([
              ["ALL", "All listings", jobs.length],
              ["ACTIVE", "Active", activeOpeningCount],
              ["INACTIVE", "Archived", jobs.length - activeOpeningCount],
            ] as const).map(([filter, label, count]) => (
              <button
                key={filter}
                type="button"
                aria-pressed={jobStatusFilter === filter}
                onClick={() => setJobStatusFilter(filter)}
                className={`min-h-9 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${jobStatusFilter === filter ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
              >
                {label} <span className="ml-1 opacity-70">{count}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3 xl:hidden">
          {filteredJobs.map((job) => (
            <article key={job.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-semibold leading-5 text-slate-900">{job.title}</h2>
                  <p className="mt-1 text-xs text-slate-500">{job.department}</p>
                </div>
                <button
                  type="button"
                  aria-pressed={job.isActive}
                  aria-label={`${job.isActive ? "Deactivate" : "Activate"} ${job.title}`}
                  onClick={() => handleToggleJob(job.id)}
                  className={`min-h-8 shrink-0 rounded-full px-3 py-1 text-[10px] font-bold transition-colors ${job.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}
                >
                  {job.isActive ? "ACTIVE" : "ARCHIVED"}
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs">
                <div><p className="text-slate-400">Location</p><p className="mt-1 inline-flex items-start gap-1.5 text-slate-700"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />{job.location}</p></div>
                <div><p className="text-slate-400">Experience</p><p className="mt-1 inline-flex items-center gap-1.5 text-slate-700"><Clock3 className="h-3.5 w-3.5 text-slate-400" />{job.experience}</p></div>
                <div><p className="text-slate-400">Positions</p><p className="mt-1 font-semibold tabular-nums text-slate-800">{job.positionsOpen}</p></div>
              </div>
            </article>
          ))}
          {filteredJobs.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center"><div className="font-semibold text-slate-800">No openings match these filters</div><p className="mt-1 text-sm text-slate-500">Try a different search or listing status.</p></div>}
        </div>
        <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:block">
          <div className="overflow-x-auto" role="region" aria-label="Job openings table" tabIndex={0}>
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Position Title</th>
                  <th scope="col" className="px-5 py-3.5">Department</th>
                  <th scope="col" className="px-5 py-3.5">Location</th>
                  <th scope="col" className="px-5 py-3.5">Required Experience</th>
                  <th scope="col" className="px-5 py-3.5 text-center">Positions</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {job.title}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {job.department}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />{job.location}</span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                      <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-slate-400" />{job.experience}</span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-center font-semibold tabular-nums text-slate-800">{job.positionsOpen}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <button
                        type="button"
                        aria-pressed={job.isActive}
                        aria-label={`${job.isActive ? "Deactivate" : "Activate"} ${job.title}`}
                        onClick={() => handleToggleJob(job.id)}
                        className={`min-h-8 rounded-full px-3 py-1 text-[10px] font-bold transition-colors ${
                          job.isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {job.isActive ? "ACTIVE" : "INACTIVE"}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredJobs.length === 0 && <tr><td colSpan={6} className="px-5 py-14 text-center"><div className="font-semibold text-slate-800">No openings match these filters</div><p className="mt-1 text-sm text-slate-500">Try a different search or listing status.</p></td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        </section>
      )}

      {/* Post Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-2 backdrop-blur-[2px] sm:p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="job-editor-title" className="relative max-h-[calc(100dvh-1rem)] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl sm:max-h-[92dvh]">
            <div className="flex items-center justify-between gap-4 bg-[#0f1d31] p-4 text-white sm:p-5">
              <div>
                <h3 id="job-editor-title" className="text-base font-bold text-white">Create New Career Opening</h3>
                <p className="text-xs text-slate-300">Publish to public website career portal</p>
              </div>
              <button
                type="button"
                aria-label="Close job opening form"
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 p-4 text-sm sm:p-6">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lead Process Sizing Engineer"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#0077B6] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Engineering & Design">Engineering & Design</option>
                    <option value="Operations & Commissioning">Operations & Commissioning</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Experience</label>
                  <input
                    type="text"
                    value={newExp}
                    onChange={(e) => setNewExp(e.target.value)}
                    placeholder="e.g. 3-6 Years"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Noida, UP or Site (Pan-India)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex flex-col-reverse justify-end gap-2 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="min-h-10 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-10 rounded-lg bg-[#0077B6] px-5 py-2 font-semibold text-white transition-colors hover:bg-[#005f92]"
                >
                  Publish Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
