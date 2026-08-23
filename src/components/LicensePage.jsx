import { Container } from "./Container.jsx";
import Footer from "./Footer.jsx";

const licenseImages = [
  "https://cdn.prod.website-files.com/67fcb048fa0321997d843f04/67ff59a5f5b25800259d4c2e_license-img-02.webp",
  "https://cdn.prod.website-files.com/67fcb048fa0321997d843f04/67ff59abe039ff6009fd7293_license-img-03.webp",
  "https://cdn.prod.website-files.com/67fcb048fa0321997d843f04/67ff59b4127c2396ca8d3bdd_license-img-04.webp",
  "https://cdn.prod.website-files.com/67fcb048fa0321997d843f04/67ff59b8be175eef82d19255_license-img-05.webp",
  "https://cdn.prod.website-files.com/67fcb048fa0321997d843f04/67ff59bdad71e644bef74733_license-img-06.webp",
];

export default function LicensePage() {
  return (
    <main>
      <section className="license-page">
        <Container>
          <div className="section-heading"><p className="eyebrow">// Utility Pages</p><h1>License</h1></div>
          <div className="license-copy">
            <h2>Images</h2>
            <p>All graphical assets in this template are licensed for personal and commercial use. If you&apos;d like to use a specific asset, please check the license below. You can get the license <a href="https://unsplash.com/" target="_blank" rel="noreferrer">here</a>.</p>
            <div className="license-images">{licenseImages.map((image) => <img key={image} src={image} alt="Unsplash" loading="lazy" />)}</div>
            <h2>Typography</h2>
            <p>The font family used are Poppins and Inconsolata - open-source fonts from <a href="https://fonts.google.com/" target="_blank" rel="noreferrer">Google fonts</a>. You can download and view the font licenses for <a href="https://fonts.google.com/specimen/Poppins" target="_blank" rel="noreferrer">Poppins</a> and <a href="https://fonts.google.com/specimen/Inconsolata" target="_blank" rel="noreferrer">Inconsolata</a>.</p>
          </div>
        </Container>
      </section>
      <Footer />
    </main>
  );
}
