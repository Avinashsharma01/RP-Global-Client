"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { PLANT_SOLUTIONS } from "@/lib/constants";

interface QuickRFQModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlant?: string;
  defaultCapacityKLD?: number;
}

export const QuickRFQModal: React.FC<QuickRFQModalProps> = ({
  isOpen,
  onClose,
  defaultPlant,
  defaultCapacityKLD,
}) => {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [plantCategory, setPlantCategory] = useState(defaultPlant || "Sewage Treatment Plant (STP)");
  const [requiredCapacityKLD, setRequiredCapacityKLD] = useState(
    defaultCapacityKLD ? String(defaultCapacityKLD) : "100"
  );
  const [prevDefaultPlant, setPrevDefaultPlant] = useState(defaultPlant);
  const [prevDefaultCapacity, setPrevDefaultCapacity] = useState(defaultCapacityKLD);

  if (defaultPlant !== prevDefaultPlant) {
    setPrevDefaultPlant(defaultPlant);
    setPlantCategory(defaultPlant || "Sewage Treatment Plant (STP)");
  }
  if (defaultCapacityKLD !== prevDefaultCapacity) {
    setPrevDefaultCapacity(defaultCapacityKLD);
    setRequiredCapacityKLD(defaultCapacityKLD ? String(defaultCapacityKLD) : "100");
  }

  const [rawWaterSource, setRawWaterSource] = useState("Industrial Effluent");
  const [projectLocation, setProjectLocation] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setSuccess(false);
    setError(null);
    setFile(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("companyName", companyName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("plantCategory", plantCategory);
      formData.append("requiredCapacityKLD", requiredCapacityKLD);
      formData.append("rawWaterSource", rawWaterSource);
      formData.append("projectLocation", projectLocation);
      formData.append("message", message);
      formData.append("source", "Homepage RFQ Modal");

      if (file) {
        formData.append("waterReport", file);
      }

      const res = await api.submitRFQ(formData);

      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message || "Failed to submit RFQ. Please check fields and retry.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred while submitting inquiry.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur & fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 18 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col z-10"
          >
            {/* Modal Header */}
            <div className="bg-[#0A192F] text-white p-5 flex items-center justify-between border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Request Technical Proposal & Sizing</span>
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Preliminary engineering proposal delivered within 24 hours
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={handleClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto">
              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="text-center py-8 space-y-4"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
                    className="w-14 h-14 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center mx-auto"
                  >
                    <CheckCircle2 className="w-8 h-8" />
                  </motion.div>
                  <h4 className="text-lg font-bold text-slate-900">
                    Technical RFQ Successfully Registered!
                  </h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Thank you, <strong>{fullName}</strong>. Our senior process engineering team has
                    received your specifications for <strong>{plantCategory}</strong> ({requiredCapacityKLD} KLD). We will review your water parameters and contact you shortly.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-lg bg-[#0077B6] text-white text-xs font-semibold hover:bg-[#005f92] transition-colors shadow-md"
                  >
                    Done
                  </motion.button>
                </motion.div>
              ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Vardhman Industries"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Plant Solution *
                  </label>
                  <select
                    value={plantCategory}
                    onChange={(e) => setPlantCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] outline-none bg-white"
                  >
                    {PLANT_SOLUTIONS.map((p) => (
                      <option key={p.slug} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Capacity (KLD / Flow Rate)
                  </label>
                  <input
                    type="text"
                    value={requiredCapacityKLD}
                    onChange={(e) => setRequiredCapacityKLD(e.target.value)}
                    placeholder="e.g. 250 KLD or 25 m³/hr"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Raw Water Source
                  </label>
                  <select
                    value={rawWaterSource}
                    onChange={(e) => setRawWaterSource(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] outline-none bg-white"
                  >
                    <option value="Industrial Chemical Effluent">Industrial Chemical Effluent</option>
                    <option value="Domestic Sewage">Domestic Sewage (Grey/Black)</option>
                    <option value="Borewell / High TDS Groundwater">Borewell / High TDS Groundwater</option>
                    <option value="River / Canal Surface Water">River / Canal Surface Water</option>
                    <option value="Municipal Corporation Supply">Municipal Corporation Supply</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Project Location (City / State)
                  </label>
                  <input
                    type="text"
                    value={projectLocation}
                    onChange={(e) => setProjectLocation(e.target.value)}
                    placeholder="e.g. Noida, UP / Baddi, HP"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Water Test Report (Optional PDF / DOC)
                </label>
                <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-3 text-center hover:bg-slate-50 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center justify-center space-x-2 text-slate-600">
                    <Upload className="w-4 h-4 text-[#0077B6]" />
                    <span className="font-medium">
                      {file ? file.name : "Attach Lab Water Test Report (Max 10MB)"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Specific Project Requirements
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Inlet parameters (pH, TDS, COD/BOD), space availability, or target completion deadline..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] outline-none resize-none"
                ></textarea>
              </div>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#0077B6] to-[#00B4D8] hover:from-[#005f92] hover:to-[#0077B6] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-transform disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Inquiry...</span>
                    </>
                  ) : (
                    <span>Submit for Engineering Sizing</span>
                  )}
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
);
};
