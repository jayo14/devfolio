import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { SiHashnode } from "react-icons/si";
import SectionFrame from "./SectionFrame.jsx";
import PlusCorner from "./PlusCorner.jsx";
import { Container } from "./Container.jsx";

const footerCols = [
  {
    title: "ABOUT",
    links: ["About Us", "Our Work", "Blog", "Contact"],
  },
  {
    title: "WORK",
    links: ["Newz Magazine", "Roller-Coat", "Fintech App", "Eco Store"],
  },
  {
    title: "BLOG",
    links: ["UI/UX for Devs", "AI-Driven Hub", "Performance 2024", "Open Source"],
  },
];

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="mb-6 font-inconsolata text-xs uppercase tracking-[0.24em] text-white/60">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="font-inconsolata text-sm text-white transition-colors hover:text-[rgb(161,170,170)]">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Footer = () => {
  return (
    <footer className="mt-[324px] bg-black pb-12 pt-32 text-white">
      <Container>
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.05 },
            },
          }}
          className="mb-20 text-[clamp(6rem,14vw,11rem)] font-bold leading-none tracking-[-0.06em]"
        >
          {"John Lennon".split(" ").map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              variants={{
                hidden: { opacity: 0, y: 60 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                },
              }}
              className={index === 1 ? "ml-6 inline-block text-accent" : "inline-block"}
            >
              {word}
            </motion.span>
          ))}
        </motion.h2>

        <SectionFrame className="mt-20 pt-20">
          <div className="grid gap-10 lg:grid-cols-4">
            {footerCols.map((column) => (
              <FooterCol key={column.title} title={column.title} links={column.links} />
            ))}

            <div>
              <h4 className="mb-6 font-inconsolata text-xs uppercase tracking-[0.24em] text-white/60">
                CONTACT
              </h4>
              <a
                href="mailto:LGC.studio@gmail.com"
                className="block py-2 font-inconsolata text-sm text-white transition-colors hover:text-[rgb(161,170,170)]"
              >
                LGC.studio@gmail.com
              </a>
              <a
                href="tel:+34123456789"
                className="block py-2 font-inconsolata text-sm text-white transition-colors hover:text-[rgb(161,170,170)]"
              >
                +34 123456789
              </a>

              <div className="mt-6 flex gap-4">
                {[
                  { label: "GitHub", href: "https://github.com/jayo14/", Icon: FaGithub },
                  { label: "LinkedIn", href: "https://linkedin.com/in/john-samuel-cgx", Icon: FaLinkedinIn },
                  { label: "Twitter", href: "https://x.com/JohnASamue24013", Icon: FaXTwitter },
                  { label: "Hashnode", href: "https://hashnode.com/@codegallantx", Icon: SiHashnode },
                ].map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="group relative flex h-10 w-10 items-center justify-center overflow-hidden border border-white/20 transition-colors hover:border-accent"
                  >
                    <PlusCorner animated corner="top-left" />
                    <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
                    <Icon className="relative z-10 h-4 w-4 transition-colors group-hover:text-black" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-20 flex flex-col gap-6 border-t border-white/10 pt-8 font-inconsolata text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-6">
              <a href="#" className="transition-colors hover:text-[rgb(161,170,170)]">
                License
              </a>
              <a href="#" className="transition-colors hover:text-[rgb(161,170,170)]">
                Webflow
              </a>
            </div>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group inline-flex items-center gap-2 transition-colors hover:text-[rgb(161,170,170)]"
            >
              BACK TO TOP
              <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-1" aria-hidden="true" />
            </button>
          </div>
        </SectionFrame>
      </Container>
    </footer>
  );
};

export default Footer;
