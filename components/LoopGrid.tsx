"use client";
import { useState } from "react";
import Link from "next/link";
import { loops, categories, type LoopCategory } from "@/lib/loops";

export default function LoopGrid({ initial = "all" }: { initial?: string }) {
  const [cat, setCat] = useState<LoopCategory | "all">(initial as LoopCategory | "all");
  const shown = loops.filter((l) => cat === "all" || l.category === cat);
  return (
    <>
      <div className="filters" role="tablist" aria-label="Filter loops by category">
        {categories.map((c) => (
          <button key={c.id} role="tab" aria-selected={cat === c.id}
            className={`chip${cat === c.id ? " on" : ""}`} onClick={() => setCat(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="grid">
        {shown.map((l) => (
          <Link key={l.slug} href={`/loops/${l.slug}`} className="card">
            <div className="card-top">
              <h3>{l.name}</h3>
              <span className="badge running">live</span>
            </div>
            <p className="goal">{l.goal}</p>
            <div className="spec">
              <div><span className="k">Trigger</span><span className="v cron">{l.trigger}</span></div>
              <div><span className="k">Verify</span><span className="v ok">{l.verify.length > 34 ? l.verify.slice(0, 34) + "…" : l.verify}</span></div>
              <div><span className="k">Cost</span><span className="v">{l.tokensPerCycle} tok/cycle</span></div>
            </div>
            <div className="card-foot">
              <span className="sec-link">View loop →</span>
              <span className="runs">{l.runs}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
