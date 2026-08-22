import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Landing } from "./pages/Landing";
import { Analyze } from "./pages/Analyze";
import { Privacy } from "./pages/Privacy";
import { TermsOfUse } from "./pages/Terms";

/**
 * HashRouter keeps deep links working on any static host (no server rewrite
 * rules required). All routing is client-side; there is no sensitive server
 * state behind these routes.
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <ScrollToTop />
        <div className="flex min-h-screen flex-col bg-paper text-ink">
          <Nav />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/analyze" element={<Analyze />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<TermsOfUse />} />
              {/* SECURITY: unknown routes fall back to the public landing page — no internals exposed. */}
              <Route path="*" element={<Landing />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </ErrorBoundary>
  );
}
