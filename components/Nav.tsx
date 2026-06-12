import Link from "next/link";
import Logo from "@/components/Logo";
import NavLinks from "@/components/NavLinks";
import ThemeToggle from "@/components/ThemeToggle";

export default function Nav() {
  return (
    <>
      <div className="statusbar">
        <div className="wrap">
          <span><span className="dot" />6 LOOPS IN LIBRARY · GROWN BY ITS OWN LOOPS</span>
          <span className="net">NETWORK:
            <a href="https://open-prompts.com" target="_blank" rel="noopener">open-prompts</a>
            <a href="https://3dtextgenerator.com" target="_blank" rel="noopener">3dtextgenerator</a>
          </span>
        </div>
      </div>
      <nav className="site">
        <div className="wrap">
          <Link className="logo" href="/" aria-label="Agent Loop Hub home">
            <Logo size={28} idPrefix="nav-logo" variant="compact" />
            agentloop<span className="hub">hub</span>
          </Link>
          <NavLinks />
          <div className="nav-right">
            <ThemeToggle />
            <a className="btn" href="https://github.com/rudy2steiner/awesome-agent-loops" target="_blank" rel="noopener">★ Awesome list</a>
            <Link className="btn primary" href="/loops">Browse loops</Link>
          </div>
        </div>
      </nav>
    </>
  );
}
