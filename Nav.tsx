import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconArrow, IconMenu, IconX, LogoMark } from "./icons";

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

const ANCHOR_LINKS: { label: string; id: string }[] = [
  { label: "How it works", id: "how" },
  { label: "Document types", id: "types" },
  { label: "FAQ", id: "faq" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const goAnchor = (id: string) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      window.setTimeout(() => scrollToId(id), 60);
    } else {
      scrollToId(id);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-shadow duration-300 ${
        scrolled ? "border-paperline bg-paper/95 shadow-[0_2px_16px_-8px_rgba(27,36,51,0.18)] backdrop-blur" : "border-transparent bg-paper"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5" aria-label="ClearTerms home">
          <LogoMark width={30} height={30} className="text-ink transition-transform duration-300 group-hover:-rotate-3" />
          <span className="font-display text-xl font-black tracking-tight text-ink">
            Clear<span className="hl-static">Terms</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {ANCHOR_LINKS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => goAnchor(l.id)}
              className="link-sweep text-sm font-semibold text-ink-soft hover:text-ink"
            >
              {l.label}
            </button>
          ))}
          <Link
            to="/privacy"
            className={`link-sweep text-sm font-semibold ${location.pathname === "/privacy" ? "text-ink" : "text-ink-soft hover:text-ink"}`}
          >
            Privacy
          </Link>
          <Link
            to="/analyze"
            className="group inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-bold text-paper transition-all duration-200 hover:bg-ink/90 hover:shadow-[0_6px_20px_-8px_rgba(27,36,51,0.5)] active:scale-95"
          >
            Analyze a document
            <IconArrow width={15} height={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-md border border-paperline p-2 text-ink md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <IconX /> : <IconMenu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-paperline bg-paper px-4 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            {ANCHOR_LINKS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => goAnchor(l.id)}
                className="rounded-md px-3 py-2.5 text-left text-sm font-semibold text-ink-soft hover:bg-slatesoft"
              >
                {l.label}
              </button>
            ))}
            <Link to="/privacy" className="rounded-md px-3 py-2.5 text-sm font-semibold text-ink-soft hover:bg-slatesoft">
              Privacy
            </Link>
            <Link
              to="/analyze"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-bold text-paper"
            >
              Analyze a document <IconArrow width={15} height={15} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
