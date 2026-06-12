"use client";
import { useEffect, useRef, useState } from "react";

const PHASES = [
  { n: "DISCOVER", log: "pulled 14 pages from gsc, 3 lost rank" },
  { n: "ACT", log: "rewrote /blog/agent-loops-guide (claude-sonnet)" },
  { n: "VERIFY", log: "meta ok · links ok · diff 38% — pass" },
  { n: "PERSIST", log: "state.md updated · pr #214 opened" },
  { n: "DECIDE", log: "2 pages left in queue → continue" },
];
const R = 86, C = 110, GAP = 7;
const polar = (a: number) => {
  const r = ((a - 90) * Math.PI) / 180;
  return [C + R * Math.cos(r), C + R * Math.sin(r)];
};

export default function LoopDial() {
  const [phase, setPhase] = useState(0);
  const [cycle, setCycle] = useState(247);
  const [logs, setLogs] = useState<{ t: string; n: string; log: string }[]>([]);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) return;
    const iv = setInterval(() => {
      setPhase((p) => {
        const next = (p + 1) % 5;
        if (next === 0) setCycle((c) => c + 1);
        return next;
      });
    }, 1900);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const now = new Date();
    const t = [now.getHours(), now.getMinutes(), now.getSeconds()]
      .map((x) => String(x).padStart(2, "0")).join(":");
    setLogs((l) => [...l, { t, n: PHASES[phase].n, log: PHASES[phase].log }].slice(-5));
  }, [phase]);

  return (
    <div className="dial-card">
      <div className="dial-head">
        <span className="name">content-refresh.loop</span>
        <span className="badge running">running</span>
      </div>
      <div className="dial-body">
        <svg className="dial-svg" viewBox="-26 0 272 220" aria-label="Agent loop phases: discover, act, verify, persist, decide">
          {PHASES.map((p, i) => {
            const a0 = i * 72 + GAP / 2, a1 = (i + 1) * 72 - GAP / 2;
            const [x0, y0] = polar(a0), [x1, y1] = polar(a1);
            const mid = (a0 + a1) / 2, lr = R + 16, rad = ((mid - 90) * Math.PI) / 180;
            return (
              <g key={p.n}>
                <path className={`phase-arc${i === phase ? " active" : ""}`} d={`M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}`} />
                <text className={`phase-label${i === phase ? " active" : ""}`} x={C + lr * Math.cos(rad)} y={C + lr * Math.sin(rad) + 3} textAnchor="middle">{p.n}</text>
              </g>
            );
          })}
          <line className="hand" x1="110" y1="110" x2="110" y2="34" style={{ transform: `rotate(${phase * 72 + 36}deg)` }} />
          <circle className="dial-dot" cx="110" cy="110" r="5" />
          <text className="dial-center" x="110" y="100" textAnchor="middle">CYCLE</text>
          <text className="dial-cycle" x="110" y="122" textAnchor="middle">#{String(cycle).padStart(4, "0")}</text>
        </svg>
        <div className="loglines">
          {logs.map((l, i) => (
            <div key={i}>
              <span className="t">{l.t}</span>
              <span className="ph">{l.n.toLowerCase()}</span> {l.log}{" "}
              {l.n === "VERIFY" && <span className="ok">✓</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="dial-foot">
        <span>TRIGGER 0 3 * * * · EXIT rank_delta ≥ 0</span>
        <span>~41k tok/cycle</span>
      </div>
    </div>
  );
}
