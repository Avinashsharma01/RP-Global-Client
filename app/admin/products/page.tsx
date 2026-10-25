"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  CheckCircle2,
  X,
  Plus,
  Save,
  Trash2,
  Loader2,
  AlertCircle,
  Search,
} from "lucide-react";
import { PLANT_SOLUTIONS } from "@/lib/constants";
import { api } from "@/lib/api";

interface EditableProduct {
  _id?: string;
  slug: string;
  name: string;
  capacity: string;
  tagline: string;
  isPublished: boolean;
  specs: Array<{ label: string; value: string; unit?: string }>;
}

const INITIAL_FALLBACK_PRODUCTS: EditableProduct[] = PLANT_SOLUTIONS.map((p) => ({
  slug: p.slug,
  name: p.name,
  capacity: p.capacity,
  tagline: p.tagline,
  isPublished: true,
  specs: [
    { label: "Operating Standard", value: "CPCB / SPCB Norms" },
    { label: "Automation Level", value: "PLC / SCADA Automated" },
    { label: "Fabrication MOC", value: "FRP / Mild Steel Rubber Lined" },
  ],
}));

export default function ProductsCMSPage() {
  const [products, setProducts] = useState<EditableProduct[]>(INITIAL_FALLBACK_PRODUCTS);
  const [editingProduct, setEditingProduct] = useState<EditableProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [search, setSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");

  useEffect(() => {
    let isMounted = true;
    const fallbackTimer = window.setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 8000);
    api
      .getProducts()
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data && res.data.length > 0) {
          const liveProducts: EditableProduct[] = res.data.map((p) => ({
            _id: p._id,
            slug: p.slug,
            name: p.name,
            capacity: p.capacityRange || "10 - 2,000 KLD",
            tagline: p.tagline || p.summary || "",
            isPublished: p.isPublished ?? true,
            specs:
              p.technicalSpecs && p.technicalSpecs.length > 0
                ? p.technicalSpecs.map((s) => ({
                    label: s.label,
                    value: s.value,
                    unit: s.unit,
                  }))
                : [
                    { label: "Operating Standard", value: "CPCB / SPCB Norms" },
                    { label: "Automation Level", value: "PLC / SCADA Automated" },
                    { label: "Fabrication MOC", value: "FRP / Mild Steel Rubber Lined" },
                  ],
          }));
          setProducts(liveProducts);
        }
      })
      .catch((err) => {
        console.warn("Could not load products from API, using fallback data:", err);
      })
      .finally(() => {
        window.clearTimeout(fallbackTimer);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  const handleTogglePublish = async (slug: string) => {
    const target = products.find((p) => p.slug === slug);
    if (!target) return;

    const newStatus = !target.isPublished;
    setProducts((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, isPublished: newStatus } : p))
    );

    if (target._id) {
      try {
        await api.updateProduct(target._id, { isPublished: newStatus });
        setBanner({
          type: "success",
          text: `Status for ${target.name} updated to ${newStatus ? "Published" : "Draft"}.`,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to update catalog status on server.";
        setBanner({ type: "error", text: msg });
      }
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSaving(true);
    setBanner(null);

    try {
      if (editingProduct._id) {
        const res = await api.updateProduct(editingProduct._id, {
          name: editingProduct.name,
          capacityRange: editingProduct.capacity,
          tagline: editingProduct.tagline,
          technicalSpecs: editingProduct.specs,
        });

        if (!res.success) {
          throw new Error(res.message || "Failed to update product specifications on server.");
        }
      }

      setProducts((prev) =>
        prev.map((p) => (p.slug === editingProduct.slug ? editingProduct : p))
      );
      setBanner({
        type: "success",
        text: `Specifications for ${editingProduct.name} saved successfully.`,
      });
      setEditingProduct(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save product specifications.";
      setBanner({ type: "error", text: msg });
      // Still update local view
      setProducts((prev) =>
        prev.map((p) => (p.slug === editingProduct.slug ? editingProduct : p))
      );
      setEditingProduct(null);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSpecRow = () => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      specs: [...editingProduct.specs, { label: "New Parameter", value: "Value" }],
    });
  };

  const handleRemoveSpecRow = (idx: number) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      specs: editingProduct.specs.filter((_, i) => i !== idx),
    });
  };

  const publishedCount = products.filter((product) => product.isPublished).length;
  const draftCount = products.length - publishedCount;
  const specificationCount = products.reduce((total, product) => total + product.specs.length, 0);
  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${product.name} ${product.tagline} ${product.capacity}`.toLowerCase().includes(query);
    const matchesStatus = visibilityFilter === "ALL" || (visibilityFilter === "PUBLISHED" ? product.isPublished : !product.isPublished);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-page mx-auto max-w-7xl space-y-6" aria-busy={loading}>
      {/* Page Header */}
      <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3.5">
          <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0077B6]">
            <Layers className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0077B6]">Website content</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.8rem]">
              Product catalog
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
              Keep plant capacities and technical specifications accurate across the public site.
            </p>
          </div>
        </div>
        {loading && (
          <span role="status" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Syncing catalog…
          </span>
        )}
      </header>

      <section aria-label="Product catalog summary" className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:grid-cols-4 sm:divide-x sm:divide-slate-200">
        {[
          { label: "Plant solutions", value: products.length, detail: "Across the catalog", color: "text-slate-900" },
          { label: "Published", value: publishedCount, detail: "Visible on the website", color: "text-emerald-700" },
          { label: "Drafts", value: draftCount, detail: "Not published", color: "text-amber-700" },
          { label: "Technical parameters", value: specificationCount, detail: "Across all solutions", color: "text-[#0077B6]" },
        ].map((metric) => (
          <div key={metric.label} className={`px-4 py-3.5 sm:px-5 ${metric.label === "Plant solutions" || metric.label === "Published" ? "border-b border-slate-200 sm:border-b-0" : ""}`}>
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${metric.label === "Published" ? "bg-emerald-500" : metric.label === "Drafts" ? "bg-amber-500" : metric.label === "Technical parameters" ? "bg-[#0077B6]" : "bg-slate-400"}`} />
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{metric.label}</p>
            </div>
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <span className={`font-mono text-2xl font-semibold tabular-nums ${metric.color}`}>{metric.value}</span>
              <span className="text-xs text-slate-500">{metric.detail}</span>
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

      <section aria-label="Catalog filters" className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm sm:flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              aria-label="Search plant solutions by name, capacity, or description"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search solutions or capacity"
              className="min-h-10 w-full border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#0077B6]"
            />
          </div>
          <span className="text-xs text-slate-500" aria-live="polite">
            <strong className="font-semibold text-slate-800">{filteredProducts.length}</strong> of {products.length} solutions
          </span>
        </div>
        <div role="group" aria-label="Filter solutions by publication status" className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
          {([
            ["ALL", "All solutions", products.length],
            ["PUBLISHED", "Published", publishedCount],
            ["DRAFT", "Drafts", draftCount],
          ] as const).map(([filter, label, count]) => (
            <button
              key={filter}
              type="button"
              aria-pressed={visibilityFilter === filter}
              onClick={() => setVisibilityFilter(filter)}
              className={`min-h-9 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                visibilityFilter === filter
                  ? filter === "DRAFT" ? "border-amber-300 bg-amber-50 text-amber-900" : filter === "PUBLISHED" ? "border-emerald-300 bg-emerald-50 text-emerald-900" : "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {label} <span className="ml-1 opacity-70">{count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Catalog Table */}
      <div className="space-y-3 xl:hidden">
        {filteredProducts.map((plant) => (
          <article key={plant.slug} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-semibold text-slate-900">{plant.name}</h2>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{plant.tagline}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${plant.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                {plant.isPublished ? "PUBLISHED" : "DRAFT"}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs">
              <div><p className="text-slate-400">Capacity range</p><p className="mt-1 font-mono font-semibold text-[#0077B6]">{plant.capacity}</p></div>
              <div><p className="text-slate-400">Technical parameters</p><p className="mt-1 font-semibold tabular-nums text-slate-800">{plant.specs.length}</p></div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
              <button
                type="button"
                aria-pressed={plant.isPublished}
                aria-label={`${plant.isPublished ? "Unpublish" : "Publish"} ${plant.name}`}
                onClick={() => handleTogglePublish(plant.slug)}
                className={`min-h-9 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${plant.isPublished ? "border-amber-200 text-amber-800 hover:bg-amber-50" : "border-emerald-200 text-emerald-800 hover:bg-emerald-50"}`}
              >
                {plant.isPublished ? "Unpublish" : "Publish"}
              </button>
              <button type="button" onClick={() => setEditingProduct({ ...plant })} className="min-h-9 rounded-lg bg-[#0077B6] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#005f92]">
                Edit specs
              </button>
            </div>
          </article>
        ))}
        {!loading && filteredProducts.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center"><div className="font-semibold text-slate-800">No solutions match these filters</div><p className="mt-1 text-sm text-slate-500">Try another search or publication status.</p></div>}
      </div>
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:block">
        <div className="overflow-x-auto" role="region" aria-label="Product catalog table" tabIndex={0}>
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th scope="col" className="px-5 py-3.5">Plant Solution</th>
                <th scope="col" className="px-5 py-3.5">Capacity Range</th>
                <th scope="col" className="px-5 py-3.5">Catalog Status</th>
                <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((plant) => (
                <tr key={plant.slug} className="transition-colors hover:bg-slate-50/80">
                  <td className="px-5 py-4 font-semibold text-slate-900">
                    <div>{plant.name}</div>
                    <div className="text-[11px] text-slate-400 font-normal line-clamp-1">
                      {plant.tagline}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-mono font-semibold text-[#0077B6]">
                    {plant.capacity}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      aria-pressed={plant.isPublished}
                      aria-label={`${plant.isPublished ? "Unpublish" : "Publish"} ${plant.name}`}
                      onClick={() => handleTogglePublish(plant.slug)}
                      className={`min-h-8 rounded-full px-3 py-1 text-[10px] font-bold transition-colors focus-visible:outline ${
                        plant.isPublished
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {plant.isPublished ? "PUBLISHED" : "DRAFT"}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setEditingProduct({ ...plant })}
                      className="min-h-9 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-[#0077B6] hover:bg-[#0077B6] hover:text-white"
                    >
                      Edit Specs
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && filteredProducts.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-14 text-center">
                  <div className="font-semibold text-slate-800">No solutions match these filters</div>
                  <p className="mt-1 text-sm text-slate-500">Try another search or publication status.</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Spec Editor Drawer / Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-2 backdrop-blur-[2px] sm:p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="product-editor-title" className="relative flex max-h-[calc(100dvh-1rem)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl sm:max-h-[92dvh]">
            <div className="flex items-center justify-between gap-4 bg-[#0f1d31] p-4 text-white sm:p-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-300">
                  Product catalog
                </span>
                <h3 id="product-editor-title" className="mt-0.5 text-base font-bold text-white">
                  {editingProduct.name}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close product editor"
                onClick={() => setEditingProduct(null)}
                className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 overflow-y-auto p-4 text-sm sm:p-6">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Plant Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#0077B6] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Standard Capacity Range</label>
                <input
                  type="text"
                  required
                  value={editingProduct.capacity}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, capacity: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#0077B6] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Technical Tagline / Summary</label>
                <textarea
                  rows={2}
                  value={editingProduct.tagline}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, tagline: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#0077B6] outline-none resize-none"
                ></textarea>
              </div>

              {/* Dynamic Technical Specifications Table */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider">
                    Engineering Parameters
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddSpecRow}
                    className="inline-flex min-h-9 items-center gap-1 rounded-lg bg-[#0077B6] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#005f92]"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Parameter</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {editingProduct.specs.map((spec, idx) => (
                    <div key={idx} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <input
                        type="text"
                        value={spec.label}
                        onChange={(e) => {
                          const updated = [...editingProduct.specs];
                          updated[idx].label = e.target.value;
                          setEditingProduct({ ...editingProduct, specs: updated });
                        }}
                        placeholder="Parameter Name"
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => {
                          const updated = [...editingProduct.specs];
                          updated[idx].value = e.target.value;
                          setEditingProduct({ ...editingProduct, specs: updated });
                        }}
                        placeholder="Engineering Value"
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-[#0077B6]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecRow(idx)}
                        aria-label={`Remove ${spec.label || "parameter"}`}
                        className="self-end rounded-lg p-2 text-rose-600 transition-colors hover:bg-rose-50 sm:self-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col-reverse justify-end gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="min-h-10 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#0077B6] px-5 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-[#005f92] disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{saving ? "Saving..." : "Save Specifications"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
