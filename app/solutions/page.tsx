import React from "react";
import Link from "next/link";
import { Droplets, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { WaterBackgroundEffect } from "@/components/ui/WaterBackgroundEffect";
import { Product } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const payload = (await response.json()) as { data?: Product[] };
    return payload.data || [];
  } catch {
    return [];
  }
}

export default async function SolutionsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-[#f7f7f3]">
      <div className="relative overflow-hidden border-b border-[#bce1f1]/60">
        <WaterBackgroundEffect variant="aquamarine" className="px-6 py-14 sm:px-10 sm:py-16 lg:px-12">
          <div className="mx-auto max-w-[1320px]">
            <div className="mb-4 inline-flex items-center gap-2 border-l-2 border-[#0077b6] bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-[#0077b6]">
              <ShieldCheck className="h-4 w-4 text-[#10B981]" />
              <span>Turnkey EPC Engineering</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#0f2d38] sm:text-4xl lg:text-5xl">
              Industrial Water & Wastewater Plant Solutions
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#45616b] sm:text-base">
              Treatment systems selected around source-water quality, process demand, site constraints, and reuse targets.
            </p>
          </div>
        </WaterBackgroundEffect>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
            No published solutions are currently available.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article key={product._id} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0077B6]/10 text-[#0077B6]">
                      <Droplets className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-[#0077B6]/10 px-2.5 py-1 font-mono text-xs font-bold text-[#0077B6]">
                      {product.capacityRange}
                    </span>
                  </div>
                  <h2 className="mb-2 text-xl font-bold text-[#0A192F]">{product.name}</h2>
                  <p className="mb-6 text-xs leading-relaxed text-slate-600">{product.tagline || product.summary}</p>
                  <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                    {(product.keyFeatures || []).slice(0, 3).map((feature) => (
                      <div key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#10B981]" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-8 border-t border-slate-100 pt-4">
                  <Link href={`/solutions/${product.slug}`} className="inline-flex items-center text-xs font-bold text-[#0077B6]">
                    Detailed Specifications <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
