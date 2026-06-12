const FIELDS = [
  { n: "F1", t: "Goal", d: 'One sentence. What "done" means, stated so a model can judge it.' },
  { n: "F2", t: "Trigger", d: "Cron expression or event. When the loop wakes up." },
  { n: "F3", t: "Discover", d: "Where tasks come from — a queue, a diff, an API, a board." },
  { n: "F4", t: "Act", d: "The agent call. Model, tools, and the prompt the loop writes for it." },
  { n: "F5", t: "Verify", d: "The automated check that gates every cycle. Tests, lint, rank data.", hot: true },
  { n: "F6", t: "Persist", d: "State that survives the run — markdown file, board, or table." },
  { n: "F7", t: "Exit", d: "The condition that stops the loop. No exit, no loop — just a bill." },
];

export default function FormatSpec() {
  return (
    <section className="format" id="format">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <div className="eyebrow">The loop format</div>
            <h2>The loop engineering format — seven fields, one standard</h2>
            <p>Every loop on this site is written in the same seven-field format, so you can audit any loop in under a minute.</p>
          </div>
        </div>
        <div className="format-grid">
          {FIELDS.map((f) => (
            <div key={f.n} className={`fcell${f.hot ? " hot" : ""}`}>
              <span className="num">{f.n}</span>
              <h4>{f.t}</h4>
              <p>{f.d}</p>
            </div>
          ))}
        </div>
        <div className="format-note">→ Every template also declares <b>est. tokens per cycle</b>, because the loop is the new cost center.</div>
      </div>
    </section>
  );
}
