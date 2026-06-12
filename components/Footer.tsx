import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div>
          <div className="flogo">
            <Logo size={24} idPrefix="footer-logo" variant="compact" />
            agentloophub
          </div>
          <p className="fnote">
            The reference library for loop engineering. This site is grown by its own loops —
            sourcing, drafting and monitoring run unattended, humans approve.
          </p>
        </div>
        <div>
          <h5>Library</h5>
          <Link href="/loops">All loops</Link>
          <Link href="/loops?cat=coding">Coding loops</Link>
          <Link href="/loops?cat=content">Content loops</Link>
          <Link href="/#format">Format spec</Link>
        </div>
        <div>
          <h5>Learn</h5>
          <Link href="/what-is-loop-engineering">What is loop engineering?</Link>
          <a href="https://github.com/rudy2steiner/awesome-agent-loops" target="_blank" rel="noopener">Awesome Agent Loops</a>
        </div>
        <div>
          <h5>Network</h5>
          <a href="https://open-prompts.com" target="_blank" rel="noopener">open-prompts.com</a>
          <a href="https://3dtextgenerator.com" target="_blank" rel="noopener">3dtextgenerator.com</a>
        </div>
      </div>
      <div className="wrap fbottom">
        <span>© 2026 AGENTLOOPHUB · MIT-LICENSED TEMPLATES</span>
        <span>BUILT BY LOOPS, APPROVED BY HUMANS</span>
      </div>
    </footer>
  );
}
