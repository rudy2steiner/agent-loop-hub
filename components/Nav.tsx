import Link from "next/link";
import Logo from "@/components/Logo";
import NavLinks, { MobileMenu } from "@/components/NavLinks";
import ThemeToggle from "@/components/ThemeToggle";
import Wordmark from "@/components/Wordmark";

export default function Nav() {
  return (
    <>
      <div className="statusbar">
        <div className="wrap">
          <span><span className="dot" />6 LOOPS IN LIBRARY · GROWN BY ITS OWN LOOPS</span>
          <span className="net">NETWORK:
            <a href="https://www.open-prompts.com" target="_blank" rel="noopener">GPT Image 2 Prompts</a>
            <a href="https://www.3dtextgenerator.com" target="_blank" rel="noopener">3D Text Generator</a>
          </span>
        </div>
      </div>
      <nav className="site">
        <div className="wrap">
          <Link className="logo" href="/" aria-label="agentLoopHub home">
            <Logo size={28} idPrefix="nav-logo" variant="compact" />
            <Wordmark />
          </Link>
          <NavLinks />
          <div className="nav-right">
            <ThemeToggle />
            <a className="btn nav-desktop-only" href="https://github.com/rudy2steiner/awesome-agent-loops" target="_blank" rel="noopener">★ Awesome list</a>
            <Link className="btn primary nav-desktop-only" href="/loops">Browse loops</Link>
            <MobileMenu />
          </div>
        </div>
      </nav>
    </>
  );
}
