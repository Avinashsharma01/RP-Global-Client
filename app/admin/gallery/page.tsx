"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Camera,
  Plus,
  Trash2,
  Search,
  MapPin,
  X,
  Activity,
  CheckCircle2,
  Edit3,
  ShieldCheck,
  Building2,
  Check,
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  Star,
  Link2,
} from "lucide-react";
import { api } from "@/lib/api";
import { ProjectGallery } from "@/lib/types";

function resolvePlantImage(imageUrl?: string, category?: string): string {
  if (
    imageUrl &&
    !imageUrl.includes("/plants/") &&
    !imageUrl.includes("plant-dm") &&
    !imageUrl.includes("plant-wtp") &&
    !imageUrl.includes("plant-softener")
  ) {
    return imageUrl;
  }
  switch (category) {
    case "ETP Plants":
      return "/images/plant-etp.jpg";
    case "STP Plants":
      return "/images/plant-stp.jpg";
    case "RO Systems":
    case "DM Plants":
    case "Water Softeners":
      return "/images/plant-ro.jpg";
    case "WTP Plants":
      return "/images/plant-etp.jpg";
    default:
      return "/images/plant-etp.jpg";
  }
}

const INITIAL_PROJECTS: ProjectGallery[] = [
  {
    _id: "proj-1",
    title: "1,200 KLD Industrial Zero Liquid Discharge (ZLD) Plant with MEE",
    category: "ETP Plants",
    capacityKLD: "1,200 KLD",
    location: "Dahej PCPIR, Gujarat",
    clientSector: "Petrochemicals & Specialty Chemicals",
    imageUrl: "/images/plant-etp.jpg",
    images: [
      "/images/plant-etp.jpg",
      "/images/plant-etp.jpeg",
      "/images/hero-bg.jpg",
    ],
    status: "RUNNING",
    progressPercentage: 78,
    currentStage: "Multi-Effect Evaporator Skid & Titanium Heat Exchanger Assembly",
    expectedCompletion: "December 2026",
    keyHighlights: ["Zero Liquid Discharge Assured", "Condensate Recovery 96%", "SCADA Controlled Automation"],
    completionYear: 2026,
    isFeatured: true,
    order: 1,
  },
  {
    _id: "proj-2",
    title: "800 KLD Submerged Aerobic Fixed Film (SAFF) STP Plant",
    category: "STP Plants",
    capacityKLD: "800 KLD",
    location: "Manesar, Haryana",
    clientSector: "Automotive Manufacturing Campus",
    imageUrl: "/images/plant-stp.jpg",
    images: [
      "/images/plant-stp.jpg",
      "/images/plant-stp.jpeg",
      "/images/hero-plant-2.jpeg",
    ],
    status: "RUNNING",
    progressPercentage: 55,
    currentStage: "Civil Reactor Tank Casting & Fine Bubble Diffuser Grid Installation",
    expectedCompletion: "November 2026",
    keyHighlights: ["Cooling Tower Reuse Spec", "BOD < 5 mg/L", "Dual Media Pressure Sand Filtration"],
    completionYear: 2026,
    isFeatured: true,
    order: 2,
  },
  {
    _id: "proj-3",
    title: "40 m³/hr High-Recovery Industrial RO & EDI Skid",
    category: "RO Systems",
    capacityKLD: "960 KLD",
    location: "Baddi, Himachal Pradesh",
    clientSector: "Pharmaceutical Sterile API",
    imageUrl: "/images/plant-ro.jpg",
    images: [
      "/images/plant-ro.jpg",
      "/images/hero-plant-2.jpeg",
      "/images/hero-bg.jpg",
    ],
    status: "RUNNING",
    progressPercentage: 88,
    currentStage: "Membrane Loading, Hydrostatic Pressure Test & Calibration",
    expectedCompletion: "October 2026",
    keyHighlights: ["Conductivity < 0.1 µS/cm", "Dow Filmtec Membranes", "SS 316L Sanitary Piping"],
    completionYear: 2026,
    isFeatured: true,
    order: 3,
  },
  {
    _id: "proj-4",
    title: "500 KLD MBBR Sewage Treatment Plant",
    category: "STP Plants",
    capacityKLD: "500 KLD",
    location: "Greater Noida, UP",
    clientSector: "Residential High-Rise Society",
    imageUrl: "/images/plant-stp.jpg",
    images: [
      "/images/plant-stp.jpg",
      "/images/plant-stp.jpeg",
      "/images/hero-plant-2.jpeg",
    ],
    status: "COMPLETED",
    progressPercentage: 100,
    currentStage: "Commissioned & Handed Over (Operational)",
    expectedCompletion: "Commissioned 2024",
    keyHighlights: ["CPCB Norms Certified", "BOD < 10 mg/L", "Automated Bio-Carrier Fluidization"],
    completionYear: 2024,
    isFeatured: true,
    order: 4,
  },
  {
    _id: "proj-5",
    title: "250 KLD Industrial Effluent Treatment & Sludge Dewatering Plant",
    category: "ETP Plants",
    capacityKLD: "250 KLD",
    location: "Bhiwadi, Rajasthan",
    clientSector: "Textile Dyeing & Processing",
    imageUrl: "/images/plant-etp.jpg",
    images: [
      "/images/plant-etp.jpg",
      "/images/plant-etp.jpeg",
      "/images/hero-bg.jpg",
    ],
    status: "COMPLETED",
    progressPercentage: 100,
    currentStage: "Commissioned & Handed Over (Operational)",
    expectedCompletion: "Commissioned 2023",
    keyHighlights: ["Recessed Chamber Filter Press", "Color & Heavy Metal Removal 99%"],
    completionYear: 2023,
    isFeatured: true,
    order: 5,
  },
  {
    _id: "proj-6",
    title: "50 m³/hr Two-Bed Demineralization (DM) Plant with Mixed Bed",
    category: "DM Plants",
    capacityKLD: "1,200 KLD",
    location: "Panipat, Haryana",
    clientSector: "Thermal Power & Boiler Feed",
    imageUrl: "/images/plant-ro.jpg",
    images: [
      "/images/plant-ro.jpg",
      "/images/hero-plant-2.jpeg",
      "/images/plant-etp.jpg",
    ],
    status: "COMPLETED",
    progressPercentage: 100,
    currentStage: "Commissioned & Handed Over (Operational)",
    expectedCompletion: "Commissioned 2023",
    keyHighlights: ["Silica < 0.02 ppm", "Conductivity < 0.2 µS/cm", "Degasser Tower Integration"],
    completionYear: 2023,
    isFeatured: true,
    order: 6,
  },
  {
    _id: "proj-7",
    title: "5 MLD Municipal River Intake Water Treatment Plant (WTP)",
    category: "WTP Plants",
    capacityKLD: "5,000 KLD",
    location: "Gopalganj, Bihar",
    clientSector: "Municipal Potable Water Supply",
    imageUrl: "/images/plant-etp.jpg",
    images: [
      "/images/plant-wtp.jpg",
      "/images/plant-etp.jpg",
      "/images/hero-plant-1.webp",
    ],
    status: "COMPLETED",
    progressPercentage: 100,
    currentStage: "Commissioned & Handed Over (Operational)",
    expectedCompletion: "Commissioned 2022",
    keyHighlights: ["Rapid Gravity Sand Filters", "Pulsator Clarifier", "IS 10500 Drinking Water Norms"],
    completionYear: 2022,
    isFeatured: true,
    order: 7,
  },
];

const CATEGORIES = [
  "ALL",
  "STP Plants",
  "ETP Plants",
  "RO Systems",
  "DM Plants",
  "Water Softeners",
  "WTP Plants",
];

export default function GalleryAdminPage() {
  const [items, setItems] = useState<ProjectGallery[]>(INITIAL_PROJECTS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "RUNNING" | "COMPLETED">("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectGallery | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("STP Plants");
  const [capacityKLD, setCapacityKLD] = useState("");
  const [location, setLocation] = useState("");
  const [clientSector, setClientSector] = useState("");
  const [status, setStatus] = useState<"RUNNING" | "COMPLETED">("COMPLETED");
  const [progressPercentage, setProgressPercentage] = useState<number>(100);
  const [currentStage, setCurrentStage] = useState("Commissioned & Handed Over");
  const [expectedCompletion, setExpectedCompletion] = useState("");
  const [keyHighlightsStr, setKeyHighlightsStr] = useState("");
  const [completionYear, setCompletionYear] = useState("2024");
  const [isFeatured, setIsFeatured] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Specific Project Photo Gallery Management State
  const [managingPhotosItem, setManagingPhotosItem] = useState<ProjectGallery | null>(null);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoSuccess, setPhotoSuccess] = useState<string | null>(null);

  // Fetch live items from backend if available
  useEffect(() => {
    async function loadGallery() {
      setLoading(true);
      try {
        const res = await api.getGallery();
        if (res.success && res.data && res.data.length > 0) {
          setItems(res.data);
        }
      } catch {
        // Keep the seeded project list available if the gallery service is offline.
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingItem(null);
    setTitle("");
    setCategory("STP Plants");
    setCapacityKLD("");
    setLocation("");
    setClientSector("");
    setStatus("RUNNING");
    setProgressPercentage(65);
    setCurrentStage("Civil Works & Skid Assembly");
    setExpectedCompletion("Q4 2026");
    setKeyHighlightsStr("Zero Liquid Discharge Assured, CPCB Norms, Automated SCADA");
    setCompletionYear(new Date().getFullYear().toString());
    setIsFeatured(true);
    setImageUrl("/images/plants/stp-plant.jpg");
    setImageFile(null);
    setStatusMsg(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (item: ProjectGallery) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setCapacityKLD(item.capacityKLD);
    setLocation(item.location);
    setClientSector(item.clientSector);
    setStatus(item.status || "COMPLETED");
    setProgressPercentage(item.progressPercentage || (item.status === "RUNNING" ? 65 : 100));
    setCurrentStage(item.currentStage || "Commissioned & Handed Over");
    setExpectedCompletion(item.expectedCompletion || "");
    setKeyHighlightsStr((item.keyHighlights || []).join(", "));
    setCompletionYear((item.completionYear || 2024).toString());
    setIsFeatured(item.isFeatured || false);
    setImageUrl(item.imageUrl);
    setImageFile(null);
    setStatusMsg(null);
    setIsModalOpen(true);
  };

  // Quick 1-click status toggle directly from card
  const handleToggleStatus = async (item: ProjectGallery) => {
    const isCurrentlyRunning = (item.status || "COMPLETED") === "RUNNING";
    const nextStatus: "RUNNING" | "COMPLETED" = isCurrentlyRunning ? "COMPLETED" : "RUNNING";
    const nextProgress = nextStatus === "COMPLETED" ? 100 : 70;
    const nextStage =
      nextStatus === "COMPLETED"
        ? "Commissioned & Handed Over (Operational)"
        : "Civil Works & Equipment Erection in Progress";

    // Optimistic update
    setItems((prev) =>
      prev.map((p) =>
        (p._id || p.id) === (item._id || item.id)
          ? {
              ...p,
              status: nextStatus,
              progressPercentage: nextProgress,
              currentStage: nextStage,
            }
          : p
      )
    );

    try {
      if (item._id) {
        await api.updateGalleryItem(item._id, {
          status: nextStatus,
          progressPercentage: nextProgress,
          currentStage: nextStage,
        });
      }
    } catch {
      // Local update was already performed
    }
  };

  // Save (Create or Update)
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !capacityKLD || !location || !clientSector) {
      setStatusMsg({ text: "Please fill in all required fields.", type: "error" });
      return;
    }

    setSubmitting(true);
    setStatusMsg(null);

    const highlightsArray = keyHighlightsStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("capacityKLD", capacityKLD);
    formData.append("location", location);
    formData.append("clientSector", clientSector);
    formData.append("status", status);
    formData.append("progressPercentage", progressPercentage.toString());
    formData.append("currentStage", currentStage);
    formData.append("expectedCompletion", expectedCompletion);
    formData.append("keyHighlights", JSON.stringify(highlightsArray));
    formData.append("completionYear", completionYear);
    formData.append("isFeatured", isFeatured ? "true" : "false");

    if (imageFile) {
      formData.append("image", imageFile);
    } else if (imageUrl) {
      formData.append("imageUrl", imageUrl);
    } else {
      formData.append("imageUrl", "/images/plants/dm-plant.jpg");
    }

    try {
      if (editingItem && editingItem._id) {
        // UPDATE existing
        const res = await api.updateGalleryItem(editingItem._id, formData);
        if (res.success && res.data) {
          setItems((prev) =>
            prev.map((p) => (p._id === editingItem._id ? (res.data as ProjectGallery) : p))
          );
        } else {
          // Local update
          setItems((prev) =>
            prev.map((p) =>
              (p._id || p.id) === (editingItem._id || editingItem.id)
                ? {
                    ...p,
                    title,
                    category,
                    capacityKLD,
                    location,
                    clientSector,
                    status,
                    progressPercentage,
                    currentStage,
                    expectedCompletion,
                    keyHighlights: highlightsArray,
                    completionYear: parseInt(completionYear, 10) || 2024,
                    isFeatured,
                    imageUrl: imageUrl || p.imageUrl,
                  }
                : p
            )
          );
        }
        setStatusMsg({ text: "Project updated successfully!", type: "success" });
      } else {
        // CREATE new
        const res = await api.createGalleryItem(formData);
        if (res.success && res.data) {
          setItems((prev) => [res.data as ProjectGallery, ...prev]);
        } else {
          const newItem: ProjectGallery = {
            _id: `proj-${Date.now()}`,
            title,
            category,
            capacityKLD,
            location,
            clientSector,
            status,
            progressPercentage,
            currentStage,
            expectedCompletion,
            keyHighlights: highlightsArray,
            completionYear: parseInt(completionYear, 10) || 2024,
            isFeatured,
            order: items.length + 1,
            imageUrl: imageUrl || "/images/plants/dm-plant.jpg",
          };
          setItems((prev) => [newItem, ...prev]);
        }
        setStatusMsg({ text: "Project published successfully to directory!", type: "success" });
      }

      setTimeout(() => {
        setIsModalOpen(false);
        setStatusMsg(null);
      }, 900);
    } catch {
      setStatusMsg({ text: "Error saving project.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteGalleryItem(id);
    } catch {
      // Proceed with local deletion
    }
    setItems((prev) => prev.filter((item) => (item._id || item.id) !== id));
    setDeleteId(null);
  };

  // Photo Gallery Management Handlers for specific projects
  const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!managingPhotosItem || !e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    setUploadingPhotos(true);
    setPhotoError(null);
    setPhotoSuccess(null);

    const targetId = managingPhotosItem._id || managingPhotosItem.id || "";
    try {
      if (targetId) {
        const res = await api.uploadProjectGalleryImages(targetId, files);
        if (res.success && res.data) {
          const updated = res.data as ProjectGallery;
          setManagingPhotosItem(updated);
          setItems((prev) =>
            prev.map((item) => ((item._id || item.id) === targetId ? updated : item))
          );
          setPhotoSuccess(`${files.length} photo(s) uploaded successfully!`);
          return;
        }
      }
      const newLocalUrls = files.map((file) => URL.createObjectURL(file));
      const currentImgs =
        managingPhotosItem.images && managingPhotosItem.images.length > 0
          ? managingPhotosItem.images
          : [managingPhotosItem.imageUrl || "/images/plant-etp.jpg"];
      const updatedImages = Array.from(new Set([...currentImgs, ...newLocalUrls]));
      const updatedItem: ProjectGallery = { ...managingPhotosItem, images: updatedImages };
      setManagingPhotosItem(updatedItem);
      setItems((prev) =>
        prev.map((item) => ((item._id || item.id) === targetId ? updatedItem : item))
      );
      setPhotoSuccess(`${files.length} photo(s) added to project!`);
    } catch {
      const newLocalUrls = files.map((file) => URL.createObjectURL(file));
      const currentImgs =
        managingPhotosItem.images && managingPhotosItem.images.length > 0
          ? managingPhotosItem.images
          : [managingPhotosItem.imageUrl || "/images/plant-etp.jpg"];
      const updatedImages = Array.from(new Set([...currentImgs, ...newLocalUrls]));
      const updatedItem: ProjectGallery = { ...managingPhotosItem, images: updatedImages };
      setManagingPhotosItem(updatedItem);
      setItems((prev) =>
        prev.map((item) => ((item._id || item.id) === targetId ? updatedItem : item))
      );
      setPhotoSuccess(`${files.length} photo(s) added to project!`);
    } finally {
      setUploadingPhotos(false);
      e.target.value = "";
    }
  };

  const handleAddUrlPhoto = async () => {
    if (!managingPhotosItem || !newPhotoUrl.trim()) return;
    const url = newPhotoUrl.trim();
    setUploadingPhotos(true);
    setPhotoError(null);
    setPhotoSuccess(null);
    const targetId = managingPhotosItem._id || managingPhotosItem.id || "";

    try {
      if (targetId) {
        const res = await api.addProjectGalleryImageUrl(targetId, url);
        if (res.success && res.data) {
          const updated = res.data as ProjectGallery;
          setManagingPhotosItem(updated);
          setItems((prev) =>
            prev.map((item) => ((item._id || item.id) === targetId ? updated : item))
          );
          setPhotoSuccess("Photo URL added to project gallery!");
          setNewPhotoUrl("");
          return;
        }
      }
      const currentImgs =
        managingPhotosItem.images && managingPhotosItem.images.length > 0
          ? managingPhotosItem.images
          : [managingPhotosItem.imageUrl || "/images/plant-etp.jpg"];
      const updatedImages = Array.from(new Set([...currentImgs, url]));
      const updatedItem: ProjectGallery = { ...managingPhotosItem, images: updatedImages };
      setManagingPhotosItem(updatedItem);
      setItems((prev) =>
        prev.map((item) => ((item._id || item.id) === targetId ? updatedItem : item))
      );
      setPhotoSuccess("Photo URL added to project gallery!");
      setNewPhotoUrl("");
    } catch {
      const currentImgs =
        managingPhotosItem.images && managingPhotosItem.images.length > 0
          ? managingPhotosItem.images
          : [managingPhotosItem.imageUrl || "/images/plant-etp.jpg"];
      const updatedImages = Array.from(new Set([...currentImgs, url]));
      const updatedItem: ProjectGallery = { ...managingPhotosItem, images: updatedImages };
      setManagingPhotosItem(updatedItem);
      setItems((prev) =>
        prev.map((item) => ((item._id || item.id) === targetId ? updatedItem : item))
      );
      setPhotoSuccess("Photo URL added to project gallery!");
      setNewPhotoUrl("");
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handleDeletePhoto = async (photoUrl: string) => {
    if (!managingPhotosItem) return;
    const targetId = managingPhotosItem._id || managingPhotosItem.id || "";
    setPhotoError(null);
    setPhotoSuccess(null);

    try {
      if (targetId) {
        const res = await api.deleteProjectGalleryImage(targetId, photoUrl);
        if (res.success && res.data) {
          const updated = res.data as ProjectGallery;
          setManagingPhotosItem(updated);
          setItems((prev) =>
            prev.map((item) => ((item._id || item.id) === targetId ? updated : item))
          );
          setPhotoSuccess("Photo removed from project gallery.");
          return;
        }
      }
      const filtered = (managingPhotosItem.images || []).filter((img) => img !== photoUrl);
      const nextCover =
        managingPhotosItem.imageUrl === photoUrl
          ? filtered[0] || "/images/plant-etp.jpg"
          : managingPhotosItem.imageUrl;
      const updatedItem: ProjectGallery = {
        ...managingPhotosItem,
        images: filtered,
        imageUrl: nextCover,
      };
      setManagingPhotosItem(updatedItem);
      setItems((prev) =>
        prev.map((item) => ((item._id || item.id) === targetId ? updatedItem : item))
      );
      setPhotoSuccess("Photo removed from project gallery.");
    } catch {
      const filtered = (managingPhotosItem.images || []).filter((img) => img !== photoUrl);
      const nextCover =
        managingPhotosItem.imageUrl === photoUrl
          ? filtered[0] || "/images/plant-etp.jpg"
          : managingPhotosItem.imageUrl;
      const updatedItem: ProjectGallery = {
        ...managingPhotosItem,
        images: filtered,
        imageUrl: nextCover,
      };
      setManagingPhotosItem(updatedItem);
      setItems((prev) =>
        prev.map((item) => ((item._id || item.id) === targetId ? updatedItem : item))
      );
      setPhotoSuccess("Photo removed from project gallery.");
    }
  };

  const handleSetCoverPhoto = async (photoUrl: string) => {
    if (!managingPhotosItem) return;
    const targetId = managingPhotosItem._id || managingPhotosItem.id || "";
    setPhotoError(null);
    setPhotoSuccess(null);

    try {
      if (targetId) {
        const res = await api.updateGalleryItem(targetId, { imageUrl: photoUrl });
        if (res.success && res.data) {
          const updated = res.data as ProjectGallery;
          setManagingPhotosItem(updated);
          setItems((prev) =>
            prev.map((item) => ((item._id || item.id) === targetId ? updated : item))
          );
          setPhotoSuccess("Cover photo updated!");
          return;
        }
      }
      const updatedItem: ProjectGallery = { ...managingPhotosItem, imageUrl: photoUrl };
      setManagingPhotosItem(updatedItem);
      setItems((prev) =>
        prev.map((item) => ((item._id || item.id) === targetId ? updatedItem : item))
      );
      setPhotoSuccess("Cover photo updated!");
    } catch {
      const updatedItem: ProjectGallery = { ...managingPhotosItem, imageUrl: photoUrl };
      setManagingPhotosItem(updatedItem);
      setItems((prev) =>
        prev.map((item) => ((item._id || item.id) === targetId ? updatedItem : item))
      );
      setPhotoSuccess("Cover photo updated!");
    }
  };

  const filteredItems = items.filter((item) => {
    const itemStatus = item.status || "COMPLETED";
    const matchesStatus = statusFilter === "ALL" || itemStatus === statusFilter;
    const matchesCategory =
      selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.clientSector.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const runningCount = items.filter((p) => (p.status || "COMPLETED") === "RUNNING").length;
  const completedCount = items.filter((p) => (p.status || "COMPLETED") === "COMPLETED").length;

  return (
    <div className="admin-page mx-auto max-w-7xl space-y-6" aria-busy={loading}>
      <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3.5">
          <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0077B6]">
            <Camera className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0077B6]">Project portfolio</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.8rem]">
              Projects & installations
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
              Track active EPC work, commissioned plants, and the projects featured on your website.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:pb-0.5">
          {loading && <span role="status" className="text-xs font-medium text-slate-500">Syncing projects…</span>}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#0077B6] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#005f92] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077B6]"
          >
            <Plus className="h-4 w-4" />
            Add project
          </button>
        </div>
      </header>

      <section aria-label="Project summary" className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:grid-cols-4 sm:divide-x sm:divide-slate-200">
        {[
          { label: "Projects", value: items.length, note: "In portfolio", tone: "bg-slate-400" },
          { label: "In progress", value: runningCount, note: "Active EPC", tone: "bg-amber-500" },
          { label: "Commissioned", value: completedCount, note: "Handed over", tone: "bg-emerald-500" },
          { label: "Featured", value: items.filter((item) => item.isFeatured).length, note: "On website", tone: "bg-[#0077B6]" },
        ].map((metric, index) => (
          <div key={metric.label} className={`px-4 py-3.5 sm:px-5 ${index < 2 ? "border-b border-slate-200 sm:border-b-0" : ""}`}>
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${metric.tone}`} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">{metric.label}</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <span className="font-mono text-2xl font-semibold tabular-nums text-slate-900">{metric.value}</span>
              <span className="text-xs text-slate-500">{metric.note}</span>
            </div>
          </div>
        ))}
      </section>

      <section aria-label="Project filters" className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter projects by status">
            <button
              type="button"
              aria-pressed={statusFilter === "ALL"}
              onClick={() => setStatusFilter("ALL")}
              className={`min-h-9 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === "ALL"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              All <span className="ml-1 opacity-70">{items.length}</span>
            </button>
            <button
              type="button"
              aria-pressed={statusFilter === "RUNNING"}
              onClick={() => setStatusFilter("RUNNING")}
              className={`inline-flex min-h-9 items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === "RUNNING"
                  ? "border-amber-500 bg-amber-50 text-amber-900"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              In progress <span className="opacity-70">{runningCount}</span>
            </button>
            <button
              type="button"
              aria-pressed={statusFilter === "COMPLETED"}
              onClick={() => setStatusFilter("COMPLETED")}
              className={`inline-flex min-h-9 items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === "COMPLETED"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              Commissioned <span className="opacity-70">{completedCount}</span>
            </button>
          </div>

          <div className="relative w-full sm:max-w-xs sm:flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              aria-label="Search projects by title, location, or client"
              placeholder="Search title, location, or client"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-h-10 w-full border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#0077B6]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2" role="group" aria-label="Filter projects by plant category">
            <span className="shrink-0 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Plant type</span>
            <div className="flex min-w-0 flex-wrap items-center gap-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={selectedCategory === cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-8 shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium transition-colors sm:px-2 sm:text-[11px] ${
                    selectedCategory === cat
                      ? "bg-blue-50 text-[#005f92] ring-1 ring-inset ring-blue-200"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="shrink-0 text-xs text-slate-500" aria-live="polite">
            <span className="font-semibold text-slate-700">{filteredItems.length}</span> of {items.length} projects
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item, idx) => {
          const isRunning = (item.status || "COMPLETED") === "RUNNING";
          const progress = item.progressPercentage || (isRunning ? 65 : 100);
          const itemId = item._id || item.id || `proj-${idx}`;

          return (
            <div
              key={itemId}
              className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-1 flex-col">
                {/* Image & Status Tag */}
                <div className="relative h-44 w-full bg-slate-900 sm:h-48">
                  <Image
                    src={resolvePlantImage(item.imageUrl, item.category)}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Top Status Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    {isRunning ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-semibold text-amber-950 shadow-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-950" />
                        In progress
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm">
                        <Check className="h-3 w-3" />
                        Commissioned
                      </span>
                    )}

                    <span className="rounded-md bg-slate-950/75 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                      {item.capacityKLD}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <span className="rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-slate-800 shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setManagingPhotosItem(item);
                      setPhotoError(null);
                      setPhotoSuccess(null);
                      setNewPhotoUrl("");
                    }}
                    className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold text-white shadow-xs backdrop-blur-md transition-colors hover:bg-[#0077B6] cursor-pointer"
                    title="Manage & upload project photos"
                  >
                    <Camera className="h-3 w-3" />
                    <span>{item.images?.length || (item.imageUrl ? 1 : 0)} Photos</span>
                  </button>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                  <h3 className="line-clamp-2 text-[15px] font-semibold leading-5 text-slate-900">
                    {item.title}
                  </h3>

                  <div className="grid grid-cols-1 gap-2 text-xs text-slate-600">
                    <div className="flex min-w-0 items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{item.clientSector}</span>
                    </div>
                  </div>

                  {isRunning ? (
                    <div className="mt-auto space-y-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-slate-700">Execution progress</span>
                        <span className="font-mono text-sm font-semibold tabular-nums text-slate-900">{progress}%</span>
                      </div>
                      <div
                        className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200"
                        role="progressbar"
                        aria-label={`Execution progress for ${item.title}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={progress}
                      >
                        <div
                          className="h-full rounded-full bg-[#0077B6]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Current stage</p>
                        <p title={item.currentStage || "Civil Works & Skid Assembly"} className="mt-0.5 line-clamp-2 text-xs leading-4 text-slate-600">
                          {item.currentStage || "Civil Works & Skid Assembly"}
                        </p>
                      </div>
                      {item.expectedCompletion && (
                        <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-2 text-xs">
                          <span className="text-slate-500">Target handover</span>
                          <span className="font-medium text-slate-800">{item.expectedCompletion}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-auto rounded-lg border border-emerald-200 bg-emerald-50/70 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-900">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                          Commissioned
                        </span>
                        <span className="text-xs font-medium text-emerald-800">{item.completionYear || 2024}</span>
                      </div>
                      <div className="mt-1.5 line-clamp-2 text-xs leading-4 text-emerald-900">
                        {item.currentStage || "Commissioned & Handed Over"}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-auto flex items-center gap-2 border-t border-slate-100 bg-white p-3">
                <button
                  type="button"
                  aria-label={isRunning ? `Mark ${item.title} completed` : `Mark ${item.title} running`}
                  onClick={() => handleToggleStatus(item)}
                  className={`inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                    isRunning
                      ? "border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                  title={isRunning ? "Mark project as completely commissioned" : "Switch project back to running execution"}
                >
                  {isRunning ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark complete</span>
                    </>
                  ) : (
                    <>
                      <Activity className="w-3.5 h-3.5" />
                      <span>Reopen project</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  aria-label={`Manage photos for ${item.title}`}
                  onClick={() => {
                    setManagingPhotosItem(item);
                    setPhotoError(null);
                    setPhotoSuccess(null);
                    setNewPhotoUrl("");
                  }}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-2.5 text-xs font-semibold text-[#0077B6] transition-colors hover:bg-sky-100 hover:border-[#0077B6]"
                  title="Manage & upload project photos"
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>Photos ({item.images?.length || (item.imageUrl ? 1 : 0)})</span>
                </button>

                <button
                  type="button"
                  aria-label={`Edit ${item.title}`}
                  onClick={() => handleOpenEdit(item)}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-slate-600 transition-colors hover:bg-blue-50 hover:text-[#0077B6]"
                  title="Edit project parameters"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${item.title}`}
                  onClick={() => setDeleteId(itemId)}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-700"
                  title="Delete project"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
        {filteredItems.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="font-semibold text-slate-800">No projects match these filters</div>
            <p className="mt-1 text-sm text-slate-500">Try a different category or search term.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-2 backdrop-blur-[2px] sm:p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="gallery-editor-title" className="max-h-[calc(100dvh-1rem)] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl sm:max-h-[92dvh]">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 font-bold text-[#0077B6]">
                  {editingItem ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h2 id="gallery-editor-title" className="text-base font-bold text-slate-900 sm:text-lg">
                    {editingItem ? "Edit Plant Project" : "Add New Project Installation"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Configure running execution telemetry or completed commissioning specs.
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close project form"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProject} className="space-y-5 p-4 sm:p-6">
              {statusMsg && (
                <div
                  className={`p-3 rounded-lg text-xs font-semibold ${
                    statusMsg.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {statusMsg.text}
                </div>
              )}

              {/* Status Selector Switch (Running vs Completed) */}
              <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="text-xs font-bold text-slate-900 block font-mono uppercase">
                  Project Execution Status *
                </label>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    aria-pressed={status === "RUNNING"}
                    onClick={() => {
                      setStatus("RUNNING");
                      if (progressPercentage >= 100) setProgressPercentage(70);
                      if (currentStage === "Commissioned & Handed Over")
                        setCurrentStage("Civil Works & Skid Assembly");
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      status === "RUNNING"
                        ? "bg-amber-50 border-amber-400 text-amber-950 font-bold ring-2 ring-amber-300"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      <span className="text-xs font-bold font-mono">⚡ RUNNING / IN EXECUTION</span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Under fabrication, civil casting, or wet commissioning
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-pressed={status === "COMPLETED"}
                    onClick={() => {
                      setStatus("COMPLETED");
                      setProgressPercentage(100);
                      setCurrentStage("Commissioned & Handed Over (Operational)");
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      status === "COMPLETED"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-300"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-xs font-bold font-mono">✓ COMPLETED & COMMISSIONED</span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Fully operational, handed over, meeting CPCB norms
                    </span>
                  </button>
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1,200 KLD Zero Liquid Discharge (ZLD) Multi-Effect Evaporator"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Plant Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
                  >
                    <option value="STP Plants">STP Plants</option>
                    <option value="ETP Plants">ETP Plants</option>
                    <option value="RO Systems">RO Systems</option>
                    <option value="DM Plants">DM Plants</option>
                    <option value="Water Softeners">Water Softeners</option>
                    <option value="WTP Plants">WTP Plants</option>
                  </select>
                </div>
              </div>

              {/* Capacity, Location, Client Sector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Capacity (KLD / m³/hr) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500 KLD or 40 m³/hr"
                    value={capacityKLD}
                    onChange={(e) => setCapacityKLD(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Location (City, State) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dahej PCPIR, Gujarat"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Client Industry Sector *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Petrochemical Complex"
                    value={clientSector}
                    onChange={(e) => setClientSector(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
                  />
                </div>
              </div>

              {/* Conditional Running Telemetry vs Completed Telemetry */}
              {status === "RUNNING" ? (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 font-mono">
                      LIVE EXECUTION TELEMETRY
                    </span>
                    <span className="text-sm font-black text-amber-900 font-mono">
                      {progressPercentage}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Progress Slider</span>
                      <span className="font-mono font-bold">{progressPercentage}%</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={95}
                      step={5}
                      value={progressPercentage}
                      onChange={(e) => setProgressPercentage(parseInt(e.target.value, 10))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-amber-900">Current Engineering Stage</label>
                      <input
                        type="text"
                        placeholder="e.g. Skid Assembly & Titanium Heat Exchanger"
                        value={currentStage}
                        onChange={(e) => setCurrentStage(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-amber-900">Target Handover Date / Quarter</label>
                      <input
                        type="text"
                        placeholder="e.g. December 2026 or Q4 2026"
                        value={expectedCompletion}
                        onChange={(e) => setExpectedCompletion(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-emerald-900 font-mono block">
                    COMMISSIONED PLANT CREDENTIALS
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-emerald-900">Commissioning / Handover Year</label>
                      <input
                        type="number"
                        placeholder="e.g. 2024"
                        value={completionYear}
                        onChange={(e) => setCompletionYear(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-emerald-900">Operational Stage Notes</label>
                      <input
                        type="text"
                        placeholder="e.g. Commissioned & Handed Over (Operational)"
                        value={currentStage}
                        onChange={(e) => setCurrentStage(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Technical Highlights */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Key Technical Highlights (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Zero Liquid Discharge, BOD < 10 mg/L, Dow Filmtec, SCADA Automation"
                  value={keyHighlightsStr}
                  onChange={(e) => setKeyHighlightsStr(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
                />
              </div>

              {/* Image Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Project Photograph</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Image URL Path</label>
                    <input
                      type="text"
                      placeholder="/images/plants/zld-plant.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Or Upload Local Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#0077B6] hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex flex-col-reverse items-stretch justify-end gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="min-h-10 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="min-h-10 rounded-lg bg-[#0077B6] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#005f92] disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingItem ? "Update Project" : "Publish Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]">
          <div role="alertdialog" aria-modal="true" aria-labelledby="delete-project-title" className="w-full max-w-sm space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 id="delete-project-title" className="text-base font-bold text-slate-900">Delete Project?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to remove this project installation? It will no longer display on the website or landing page.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="min-h-9 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteId)}
                className="min-h-9 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-rose-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Photos Manager Modal */}
      {managingPhotosItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-2 sm:p-4 backdrop-blur-xs">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="photo-manager-title"
            className="flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3 truncate pr-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#0077B6]">
                  <Camera className="h-5 w-5" />
                </span>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0077B6]">
                      {managingPhotosItem.category}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-700">
                      {managingPhotosItem.capacityKLD}
                    </span>
                  </div>
                  <h2 id="photo-manager-title" className="truncate text-base font-bold text-slate-900 sm:text-lg">
                    Project Gallery: {managingPhotosItem.title}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setManagingPhotosItem(null)}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                aria-label="Close photo manager"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Alert Feedback */}
              {photoError && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-800">
                  <X className="h-4 w-4 shrink-0 text-rose-500" />
                  <span>{photoError}</span>
                </div>
              )}
              {photoSuccess && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{photoSuccess}</span>
                </div>
              )}

              {/* Upload & Add Section */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* File Upload Zone */}
                <div className="flex flex-col justify-between rounded-xl border-2 border-dashed border-[#0077B6]/30 bg-sky-50/40 p-4 transition-colors hover:border-[#0077B6] hover:bg-sky-50/70">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <UploadCloud className="h-5 w-5 text-[#0077B6]" />
                      <span>Upload Project Photos</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Select one or multiple images from your computer to attach directly to this plant project.
                    </p>
                  </div>

                  <div className="mt-4">
                    <input
                      type="file"
                      id="project-photo-input"
                      multiple
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingPhotos}
                      onChange={handleUploadFiles}
                    />
                    <label
                      htmlFor="project-photo-input"
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0077B6] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#005f92] cursor-pointer ${
                        uploadingPhotos ? "opacity-60 pointer-events-none" : ""
                      }`}
                    >
                      {uploadingPhotos ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Uploading Photos...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="h-4 w-4" />
                          <span>Choose Photos to Upload</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Direct Image URL input */}
                <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <Link2 className="h-5 w-5 text-[#0077B6]" />
                      <span>Add Photo via Image URL</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Paste a direct image path (e.g. <code className="rounded bg-slate-200/60 px-1 py-0.5">/images/plant-ro.jpg</code>) or hosted HTTPS CDN URL.
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      placeholder="https://example.com/plant.jpg or /images/..."
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      disabled={uploadingPhotos}
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0077B6] focus:outline-none focus:ring-1 focus:ring-[#0077B6]"
                    />
                    <button
                      type="button"
                      disabled={!newPhotoUrl.trim() || uploadingPhotos}
                      onClick={handleAddUrlPhoto}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-900 disabled:opacity-50 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Photos Gallery Grid */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Project Photos (
                      {(managingPhotosItem.images && managingPhotosItem.images.length > 0
                        ? managingPhotosItem.images
                        : managingPhotosItem.imageUrl
                        ? [managingPhotosItem.imageUrl]
                        : []
                      ).length}
                      )
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      The cover photo is featured on tracker cards. Click "Set Cover" on any photo to make it primary.
                    </p>
                  </div>
                </div>

                {(() => {
                  const currentPhotos =
                    managingPhotosItem.images && managingPhotosItem.images.length > 0
                      ? managingPhotosItem.images
                      : managingPhotosItem.imageUrl
                      ? [managingPhotosItem.imageUrl]
                      : [];

                  if (currentPhotos.length === 0) {
                    return (
                      <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-10 text-center text-xs text-slate-500">
                        No photos uploaded for this project yet. Use the upload box above to add photos.
                      </div>
                    );
                  }

                  return (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {currentPhotos.map((photoUrl, index) => {
                        const isCover =
                          managingPhotosItem.imageUrl === photoUrl ||
                          (index === 0 && !managingPhotosItem.imageUrl);
                        return (
                          <div
                            key={`${photoUrl}-${index}`}
                            className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition-all hover:border-[#0077B6]/50 hover:shadow-md"
                          >
                            {/* Thumbnail */}
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                              <Image
                                src={resolvePlantImage(photoUrl, managingPhotosItem.category)}
                                alt={`Photo ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                unoptimized={/^https?:\/\//i.test(photoUrl)}
                              />

                              {/* Cover Badge */}
                              {isCover && (
                                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs backdrop-blur-xs">
                                  <Star className="h-3 w-3 fill-white" />
                                  <span>Cover Photo</span>
                                </span>
                              )}
                            </div>

                            {/* Action Row */}
                            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-2.5 py-1.5 text-[11px]">
                              {!isCover ? (
                                <button
                                  type="button"
                                  onClick={() => handleSetCoverPhoto(photoUrl)}
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0077B6] hover:underline cursor-pointer"
                                  title="Set as primary project card photo"
                                >
                                  <Star className="h-3 w-3" />
                                  <span>Set Cover</span>
                                </button>
                              ) : (
                                <span className="text-[10px] font-semibold text-slate-500">Primary Card</span>
                              )}

                              <button
                                type="button"
                                onClick={() => handleDeletePhoto(photoUrl)}
                                className="rounded p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                                title="Remove photo from gallery"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3 sm:px-6">
              <span className="text-xs text-slate-500">
                Changes update in real-time on public project gallery views.
              </span>
              <button
                type="button"
                onClick={() => setManagingPhotosItem(null)}
                className="inline-flex min-h-9 items-center justify-center rounded-lg bg-[#0077B6] px-4 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#005f92] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
