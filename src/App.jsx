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

const App = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
      <Tools />
      <Services />
      <SelectedWork />
      <Testimonial />
      <Partner />
      <Award />
      <HomeBlog />
      <Contact />
      <Footer />
    </div >
  )
};

export default App;
