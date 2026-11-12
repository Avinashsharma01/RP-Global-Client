import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Download, ShieldCheck } from "lucide-react";
import { Product } from "@/lib/types";
import { WaterBackgroundEffect } from "@/components/ui/WaterBackgroundEffect";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
export const instant = false;

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { data?: Product };
    return payload.data || null;
  } catch {
    return null;
  }
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product || !product.isPublished) notFound();

  return (
    <div className="min-h-screen bg-[#f7f7f3]">
      <WaterBackgroundEffect variant="hydraulic" className="border-b border-[#bce1f1]/60 px-6 py-14 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Link href="/solutions" className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-[#26717a]">
            <ArrowLeft className="h-3.5 w-3.5" /> All solutions
          </Link>
          <div className="inline-flex items-center gap-2 border border-[#cbd9d3] bg-white px-3 py-1 text-xs font-semibold text-[#26717a]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" /> Turnkey EPC solution
          </div>
          <h1 className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight text-[#0f2d38] sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#53666a]">
            {product.tagline || product.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/contact-us?plant=${encodeURIComponent(product.name)}#rfq`} className="bg-[#1a5962] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white">
              Request technical quotation
            </Link>
            {product.brochureUrl && (
              <a href={product.brochureUrl} download className="inline-flex items-center gap-2 border border-[#b6d8cf] bg-white px-5 py-3 text-xs font-semibold text-[#1a5962]">
                <Download className="h-3.5 w-3.5" /> Download specification
              </a>
            )}
          </div>
        </div>
      </WaterBackgroundEffect>

      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.4fr_1fr] lg:px-10">
        <section className="space-y-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-900">Overview</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{product.description || product.summary}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-900">Key features</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {(product.keyFeatures || []).map((feature) => (
                <li key={feature} className="flex gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {feature}
                </li>
              ))}
            </ul>
          </div>
          {product.processSteps?.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-bold text-slate-900">Process steps</h2>
              <ol className="mt-4 space-y-4">
                {product.processSteps.map((step) => (
                  <li key={step.stepNumber} className="flex gap-3 text-sm text-slate-600">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0077B6]/10 text-xs font-bold text-[#0077B6]">{step.stepNumber}</span>
                    <span><strong className="text-slate-900">{step.title}</strong><br />{step.description}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">Technical specifications</h2>
          <dl className="mt-4 divide-y divide-slate-100">
            <div className="flex justify-between gap-4 py-3 text-sm">
              <dt className="text-slate-500">Capacity</dt><dd className="text-right font-semibold text-slate-900">{product.capacityRange}</dd>
            </div>
            {(product.technicalSpecs || []).map((spec) => (
              <div key={`${spec.label}-${spec.value}`} className="flex justify-between gap-4 py-3 text-sm">
                <dt className="text-slate-500">{spec.label}</dt><dd className="text-right font-semibold text-slate-900">{spec.value}{spec.unit ? ` ${spec.unit}` : ""}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </main>
    </div>
  );
}
