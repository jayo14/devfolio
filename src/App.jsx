import { lazy, Suspense } from "react";
import Hero from "./components/Hero.jsx";
import Tools from "./components/Tools.jsx";
import Services from "./components/Services.jsx";
import SelectedWork from "./components/SelectedWork.jsx";
import Testimonial from "./components/Testimonial.jsx";
import Partner from "./components/Partner.jsx";
import Award from "./components/Award.jsx";
import HomeBlog from "./components/HomeBlog.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import CursorArrowEffect from "./components/CursorArrowEffect.jsx";
import ServerWarmupBanner from "./components/ServerWarmupBanner.jsx";

// Code split secondary pages so the initial landing bundle is lightweight
const WorkPage = lazy(() => import("./components/WorkPage.jsx"));
const BlogPage = lazy(() => import("./components/BlogPage.jsx"));
const BlogDetailPage = lazy(() => import("./components/BlogDetailPage.jsx"));
const ProjectPage = lazy(() => import("./components/ProjectPage.jsx"));
const LicensePage = lazy(() => import("./components/LicensePage.jsx"));
const AdminPage = lazy(() => import("./components/AdminPage.jsx"));
const NotFound = lazy(() => import("./components/NotFound.jsx"));

function HomePage({ about = false }) {
  return (
    <>
      <main id="main-content" tabIndex="-1" className="outline-none">
        <Hero showCounters={!about} />
        <Tools />
        <Services />
        {!about && <SelectedWork />}
        <Testimonial />
        <Partner />
        <Award />
        <HomeBlog />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const path = typeof window !== "undefined" ? window.location.pathname.replace(/\/+$/, "") || "/" : "/";
  let content;

  if (path === "/") {
    content = <HomePage />;
  } else if (path === "/about-us") {
    content = <HomePage about />;
  } else if (path === "/work") {
    content = (
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <Navbar />
        <WorkPage />
      </Suspense>
    );
  } else if (path.startsWith("/work/")) {
    content = (
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <ProjectPage slug={path.replace("/work/", "")} />
      </Suspense>
    );
  } else if (path === "/blog") {
    content = (
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <Navbar />
        <BlogPage />
      </Suspense>
    );
  } else if (path.startsWith("/blog/")) {
    content = (
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <Navbar />
        <BlogDetailPage path={path} />
      </Suspense>
    );
  } else if (path === "/contact") {
    content = (
      <>
        <Navbar />
        <Contact standalone />
      </>
    );
  } else if (path === "/ultility-pages/license") {
    content = (
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <Navbar />
        <LicensePage />
      </Suspense>
    );
  } else if (path === "/admin") {
    content = (
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <AdminPage />
      </Suspense>
    );
  } else {
    content = (
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <NotFound />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>
      <CursorArrowEffect />
      <ServerWarmupBanner />
      {content}
    </div>
  );
}
