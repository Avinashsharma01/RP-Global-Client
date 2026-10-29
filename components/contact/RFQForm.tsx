"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Upload, CheckCircle2, AlertCircle, Loader2, Send, FileText } from "lucide-react";
import { api } from "@/lib/api";
import { PLANT_SOLUTIONS } from "@/lib/constants";

export const RFQForm: React.FC = () => {
  const searchParams = useSearchParams();
  const plantParam = searchParams.get("plant");
  const capacityParam = searchParams.get("capacity");

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [plantCategory, setPlantCategory] = useState(
    plantParam || "Sewage Treatment Plant (STP)"
  );
  const [capacity, setCapacity] = useState(
    capacityParam ? `${capacityParam} KLD` : ""
  );
  const [prevPlantParam, setPrevPlantParam] = useState(plantParam);
  const [prevCapacityParam, setPrevCapacityParam] = useState(capacityParam);

  if (plantParam !== prevPlantParam) {
    setPrevPlantParam(plantParam);
    if (plantParam) setPlantCategory(plantParam);
  }
  if (capacityParam !== prevCapacityParam) {
    setPrevCapacityParam(capacityParam);
    if (capacityParam) setCapacity(`${capacityParam} KLD`);
  }

  const [rawWaterSource, setRawWaterSource] = useState("Industrial Effluent");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Optional Inlet Water Parameters
  const [pH, setPH] = useState("");
  const [tds, setTds] = useState("");
  const [cod, setCod] = useState("");
  const [bod, setBod] = useState("");
  const [showInletParams, setShowInletParams] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResetForm = () => {
    setSuccess(false);
    setError(null);
    setFile(null);
    setMessage("");
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
      formData.append("requiredCapacityKLD", capacity);
      formData.append("rawWaterSource", rawWaterSource);
      formData.append("projectLocation", location);
      formData.append("message", message);
      formData.append("source", "Contact Us Page RFQ Portal");

      if (pH || tds || cod || bod) {
        formData.append(
          "inletParameters",
          JSON.stringify({ pH, TDS: tds, COD: cod, BOD: bod })
        );
      }

      if (file) {
        formData.append("waterReport", file);
      }

      const res = await api.submitRFQ(formData);

      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message || "Failed to register RFQ. Please verify details.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error submitting inquiry.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="rfq" className="bg-white rounded-xl border border-slate-200 shadow-[0_12px_36px_rgba(20,45,49,0.08)] overflow-hidden">
      <div className="bg-[#0A192F] text-white p-6 sm:p-8">
        <span className="text-[11px] uppercase font-bold tracking-widest text-[#8ed9e7] border-l-2 border-[#00E5FF] pl-3">
          Official Engineering Desk
        </span>
        <h3 className="text-2xl font-bold text-white mt-3">
          Request for Quotation (RFQ) & Technical Sizing
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-1.5">
          Submit your required treatment capacity and raw water source. Our senior process engineers
          will calculate preliminary mass balance and issue a customized proposal.
        </p>
      </div>

      <div className="p-6 sm:p-8">
        {success ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">RFQ Successfully Submitted!</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{fullName}</strong> from <strong>{companyName}</strong>. Your requirement for <strong>{plantCategory}</strong> has been logged in our CRM pipeline. Our team will contact you via {phone} and {email}.
            </p>
            <button
              type="button"
              onClick={handleResetForm}
              className="mt-4 px-6 py-2.5 rounded-lg bg-[#0077B6] hover:bg-[#005f92] text-white text-xs font-semibold transition-colors shadow-sm"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Row 1: Name & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sanjeev Kumar"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Company / Facility Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Vardhman Textiles Ltd"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] outline-none"
                />
              </div>
            </div>

            {/* Row 2: Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Business Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Direct Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] outline-none"
                />
              </div>
            </div>

            {/* Row 3: Plant Type & Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-800 mb-1">Plant Solution Type *</label>
                <select
                  value={plantCategory}
                  onChange={(e) => setPlantCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] outline-none bg-white font-medium"
                >
                  {PLANT_SOLUTIONS.map((p) => (
                    <option key={p.slug} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Target Capacity (KLD / Flow)</label>
                <input
                  type="text"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="e.g. 500 KLD"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] outline-none"
                />
              </div>
            </div>

            {/* Row 4: Source & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Raw Water Source</label>
                <select
                  value={rawWaterSource}
                  onChange={(e) => setRawWaterSource(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] outline-none bg-white"
                >
                  <option value="Industrial Chemical Effluent">Industrial Chemical Effluent</option>
                  <option value="Domestic Sewage (Grey/Black)">Domestic Sewage (Grey/Black)</option>
                  <option value="Borewell / High TDS Groundwater">Borewell / High TDS Groundwater</option>
                  <option value="River / Canal Surface Water">River / Canal Surface Water</option>
                  <option value="Municipal Corporation Water">Municipal Corporation Water</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Site Location (City & State)</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Noida, UP / Baddi, HP"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] outline-none"
                />
              </div>
            </div>

            {/* Toggle Inlet Parameters */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowInletParams(!showInletParams)}
                className="text-[#0077B6] hover:underline font-semibold flex items-center space-x-1"
              >
                <span>{showInletParams ? "Hide" : "+ Add"} Known Water Chemistry Parameters (pH, TDS, COD, BOD)</span>
              </button>

              {showInletParams && (
                <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in">
                  <div>
                    <label className="block text-slate-600 mb-1">Inlet pH</label>
                    <input
                      type="text"
                      value={pH}
                      onChange={(e) => setPH(e.target.value)}
                      placeholder="e.g. 7.5"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">TDS (mg/L)</label>
                    <input
                      type="text"
                      value={tds}
                      onChange={(e) => setTds(e.target.value)}
                      placeholder="e.g. 2500"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">COD (mg/L)</label>
                    <input
                      type="text"
                      value={cod}
                      onChange={(e) => setCod(e.target.value)}
                      placeholder="e.g. 1800"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">BOD (mg/L)</label>
                    <input
                      type="text"
                      value={bod}
                      onChange={(e) => setBod(e.target.value)}
                      placeholder="e.g. 650"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* File Upload Attachment */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Attach Raw Water Test Report / RFP PDF
              </label>
              <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-center space-x-2 text-slate-600">
                  <Upload className="w-5 h-5 text-[#0077B6]" />
                  <span className="font-medium">
                    {file ? file.name : "Click or drag water test report (.pdf, .doc, max 10MB)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Project Message */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">Additional Project Details</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mention discharge standards, land footprint availability, or target handover date..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] outline-none resize-none"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-gradient-to-r from-[#0077B6] to-[#00B4D8] hover:from-[#005f92] hover:to-[#0077B6] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-transform active:scale-[0.99] disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Technical Proposal Request...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Request for Quotation (RFQ)</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
