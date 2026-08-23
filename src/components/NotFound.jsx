import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { Container } from "./Container.jsx";

export default function NotFound() {
  return (
    <main>
      <Navbar />
      <section className="not-found">
        <Container>
          <div className="not-found-code" aria-hidden="true"><span>4</span><span>0</span><span>4</span></div>
          <p>Opps! Page not found</p>
          <a href="/contact" className="outline-button">Send Your Message</a>
        </Container>
      </section>
      <Footer />
    </main>
  );
}
