"use client";

import React, { useState } from "react";
import { Upload, CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";
import { api } from "@/lib/api";

interface InlineRFQProps {
  plantName: string;
}

export const InlineRFQ: React.FC<InlineRFQProps> = ({ plantName }) => {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [capacity, setCapacity] = useState("");
  const [rawWaterSource, setRawWaterSource] = useState("Industrial Effluent");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      formData.append("plantCategory", plantName);
      formData.append("requiredCapacityKLD", capacity);
      formData.append("rawWaterSource", rawWaterSource);
      formData.append("projectLocation", location);
      formData.append("message", message);
      formData.append("source", `Solution Page: ${plantName}`);

      if (file) {
        formData.append("waterReport", file);
      }

      const res = await api.submitRFQ(formData);

      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message || "Failed to submit request.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error submitting inquiry.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="rfq-section" className="bg-[#0A192F] text-white rounded-2xl p-6 sm:p-10 border border-slate-800 shadow-2xl">
      <div className="max-w-3xl mb-8">
        <span className="text-xs uppercase font-bold tracking-widest text-[#00E5FF] bg-[#00E5FF]/10 px-3 py-1 rounded-full border border-[#00E5FF]/20">
          Direct Engineering Inquiry
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
          Request Technical Quotation for {plantName}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-2">
          Submit your required treatment capacity and inlet parameters. Our process engineering desk will
          conduct preliminary sizing and issue a comprehensive techno-commercial proposal.
        </p>
      </div>

      {success ? (
        <div className="p-8 rounded-xl bg-white/5 border border-[#10B981]/40 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-white">Quotation Request Received!</h4>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Thank you, {fullName}. Our engineering desk has received your request for {plantName} ({capacity}).
            We will contact you via email ({email}) and phone ({phone}) shortly.
          </p>
          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setError(null);
              setFile(null);
              setMessage("");
            }}
            className="mt-3 px-5 py-2 rounded-lg bg-[#0077B6] hover:bg-[#005f92] text-white text-xs font-semibold transition-colors"
          >
            Submit Another Inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-[#00E5FF] outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Company / Organization *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company Name"
                className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-[#00E5FF] outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@company.com"
                className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-[#00E5FF] outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-[#00E5FF] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Capacity (KLD / Flow Rate)</label>
              <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g. 500 KLD or 25 m³/hr"
                className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-[#00E5FF] outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Raw Water Feed Source</label>
              <select
                value={rawWaterSource}
                onChange={(e) => setRawWaterSource(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#00E5FF] outline-none"
              >
                <option value="Industrial Chemical Effluent" className="bg-[#0A192F]">Industrial Chemical Effluent</option>
                <option value="Domestic Sewage (Grey/Black)" className="bg-[#0A192F]">Domestic Sewage (Grey/Black)</option>
                <option value="Borewell / Ground High TDS" className="bg-[#0A192F]">Borewell / Ground High TDS</option>
                <option value="River / Canal Surface Water" className="bg-[#0A192F]">River / Canal Surface Water</option>
                <option value="Municipal Water Supply" className="bg-[#0A192F]">Municipal Water Supply</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Installation Site City / State</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Greater Noida, UP"
                className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-[#00E5FF] outline-none"
              />
            </div>
          </div>

          {/* File Attachment & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Attach Water Test Report / RFP Document (PDF / DOC)
              </label>
              <div className="relative border border-dashed border-white/20 rounded-lg p-3 text-center hover:bg-white/5 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-center space-x-2 text-slate-300">
                  <Upload className="w-4 h-4 text-[#00E5FF]" />
                  <span className="line-clamp-1">
                    {file ? file.name : "Click or drag water analysis report (Max 10MB)"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Specific Technical Notes / Parameters
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Inlet TDS, COD, BOD, space limit, or commissioning timeline..."
                className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-[#00E5FF] outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#0077B6] to-[#00E5FF] hover:from-[#005f92] hover:to-[#00B4D8] text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg transition-transform active:scale-[0.99] disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Sizing Request...</span>
                </>
              ) : (
                <>
                  <span>Submit Technical RFQ</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
