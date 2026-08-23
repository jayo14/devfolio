import { Container } from "./Container.jsx";
import Footer from "./Footer.jsx";
import { originalAssets } from "../lib/siteData.js";

const articles = {
  "/blog/ui-ux-for-developers-the-power-of-simplicity": {
    title: "UI/UX for Developers: The Power of Simplicity",
    image: originalAssets.blogImages[0],
  },
  "/blog/hubfolio-agency-revolutionizes-work-with-the-power-of-ai-driven": {
    title: "Hubfolio agency revolutionizes work with the power of AI-Driven",
    image: originalAssets.blogImages[1],
  },
};

const paragraphs = [
  "Imperdiet faucibus ornare quis mus lorem a amet. Pulvinar diam lacinia diam semper ac dignissim tellus dolor purus in nibh pellentesque. Nisl luctus amet in ut ultricies orci faucibus sed euismod suspendisse cum eu massa.",
  "Lacus sit dui posuere bibendum aliquet tempus. Amet pellentesque augue non lacus. Arcu tempor lectus elit ullamcorper nunc. Proin euismod ac pellentesque nec id convallis pellentesque semper.",
  "Massa dui enim fermentum nunc purus viverra suspendisse risus tincidunt pulvinar a aliquam pharetra habitasse ullamcorper sed et egestas imperdiet nisi ultrices eget id.",
];

export default function BlogDetailPage({ path }) {
  const article = articles[path] || articles[Object.keys(articles)[0]];
  return (
    <main>
      <section className="blog-detail">
        <Container>
          <div className="blog-detail-heading"><p className="eyebrow">JohnSmith</p><time dateTime="2025-04-22">Apr 22, 2025</time><h1>{article.title}</h1></div>
          <img className="blog-detail-image" src={article.image} alt={article.title} />
          <div className="blog-detail-copy"><h2>Evaluate your spending</h2>{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </Container>
      </section>
      <Footer />
    </main>
  );
}
