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

function HomePage({ about = false }) {
  return <>
    <Hero showCounters={!about} />
    <Tools />
    <Services />
    {!about && <SelectedWork />}
    <Testimonial />
    <Partner />
    <Award />
    <HomeBlog />
    <Contact />
    <Footer />
  </>;
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  let content;
  if (path === "/") content = <HomePage />;
  else if (path === "/about-us") content = <HomePage about />;
  else if (path === "/work") content = <><Navbar /><WorkPage /></>;
  else if (path === "/blog") content = <><Navbar /><BlogPage /></>;
  else if (path.startsWith("/blog/")) content = <><Navbar /><BlogDetailPage path={path} /></>;
  else if (path === "/contact") content = <><Navbar /><Contact standalone /></>;
  else if (path === "/ultility-pages/license") content = <><Navbar /><LicensePage /></>;
  else content = <NotFound />;
  return <div className="min-h-screen bg-black text-white"><CursorArrowEffect />{content}</div>;
}
