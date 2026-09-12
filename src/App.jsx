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
import WorkPage from "./components/WorkPage.jsx";
import BlogPage from "./components/BlogPage.jsx";
import NotFound from "./components/NotFound.jsx";
import BlogDetailPage from "./components/BlogDetailPage.jsx";
import LicensePage from "./components/LicensePage.jsx";
import CursorArrowEffect from "./components/CursorArrowEffect.jsx";
import AdminPage from "./components/AdminPage.jsx";
import ProjectPage from "./components/ProjectPage.jsx";

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
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  let content;
  if (path === "/") content = <HomePage />;
  else if (path === "/about-us") content = <HomePage about />;
  else if (path === "/work") content = <><Navbar /><WorkPage /></>;
  else if (path.startsWith("/work/")) content = <ProjectPage slug={path.replace("/work/", "")} />;
  else if (path === "/blog") content = <><Navbar /><BlogPage /></>;
  else if (path.startsWith("/blog/")) content = <><Navbar /><BlogDetailPage path={path} /></>;
  else if (path === "/contact") content = <><Navbar /><Contact standalone /></>;
  else if (path === "/ultility-pages/license") content = <><Navbar /><LicensePage /></>;
  else if (path === "/admin") content = <AdminPage />;
  else content = <NotFound />;
  return (
    <div className="min-h-screen bg-black text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>
      <CursorArrowEffect />
      {content}
    </div>
  );
}

