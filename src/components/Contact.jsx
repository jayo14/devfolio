import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { SiHashnode } from "react-icons/si";
import SectionFrame from "./SectionFrame.jsx";
import PlusCorner from "./PlusCorner.jsx";
import { Container } from "./Container.jsx";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Enter a valid phone number"),
  message: z.string().min(10, "Message must be at least 10 characters").max(500, "Message must be 500 characters or less"),
});

const socials = [
  { label: "GitHub", href: "https://github.com/jayo14/", Icon: FaGithub },
  { label: "LinkedIn", href: "https://linkedin.com/in/john-samuel-cgx", Icon: FaLinkedinIn },
  { label: "Twitter", href: "https://x.com/JohnASamue24013", Icon: FaXTwitter },
  { label: "Hashnode", href: "https://hashnode.com/@codegallantx", Icon: SiHashnode },
];

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="font-inconsolata text-xs uppercase tracking-[0.18em] text-white/60">
        {label}
      </span>
      <div className="mt-3">{children}</div>
      {error ? (
        <span className="mt-2 block font-inconsolata text-xs text-white">
          {error}
        </span>
      ) : null}
    </label>
  );
}

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <section id="contact" className="mt-[324px] bg-black pt-[324px] text-white">
      <Container>
        <SectionFrame className="grid gap-20 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-inconsolata text-base text-white">// Contact</p>
            <h2 className="mt-3 text-[64px] font-medium leading-[76.8px] tracking-[-1.92px]">
              Success is a team play, right? <span className="text-accent">Let&apos;s work</span> together!
            </h2>
            <p className="mt-8 max-w-md font-inconsolata text-white/60">
              Let&apos;s discuss your next project. I&apos;m currently available for
              freelance work or full-time positions.
            </p>

            <div className="mt-12 space-y-4 font-inconsolata text-white/80">
              <a className="block transition-colors hover:text-[rgb(161,170,170)]" href="mailto:LGC.studio@gmail.com">
                LGC.studio@gmail.com
              </a>
              <a className="block transition-colors hover:text-[rgb(161,170,170)]" href="tel:+34123456789">
                +34 123456789
              </a>
            </div>

            <div className="mt-12 flex gap-4">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-12 w-12 items-center justify-center border border-white/20 text-white transition-colors hover:border-accent hover:bg-accent hover:text-black"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative space-y-8"
          >
            {[0, 1, 2, 3].map((cornerIndex) => (
              <PlusCorner
                key={`contact-corner-${cornerIndex}`}
                corner={
                  cornerIndex === 0
                    ? "top-left"
                    : cornerIndex === 1
                      ? "top-right"
                      : cornerIndex === 2
                        ? "bottom-right"
                        : "bottom-left"
                }
                animated
                delay={0.12 + cornerIndex * 0.08}
              />
            ))}

            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Your first name" error={errors.firstName?.message}>
                <input
                  {...register("firstName")}
                  placeholder="John"
                  className="w-full border-b border-white/20 bg-transparent py-3 font-inconsolata text-white outline-none transition-colors placeholder:text-white/30 focus:border-accent"
                />
              </Field>

              <Field label="Your last name" error={errors.lastName?.message}>
                <input
                  {...register("lastName")}
                  placeholder="Doe"
                  className="w-full border-b border-white/20 bg-transparent py-3 font-inconsolata text-white outline-none transition-colors placeholder:text-white/30 focus:border-accent"
                />
              </Field>
            </div>

            <Field label="Your email address" error={errors.email?.message}>
              <input
                type="email"
                {...register("email")}
                placeholder="john@example.com"
                className="w-full border-b border-white/20 bg-transparent py-3 font-inconsolata text-white outline-none transition-colors placeholder:text-white/30 focus:border-accent"
              />
            </Field>

            <Field label="Phone" error={errors.phone?.message}>
              <input
                type="tel"
                {...register("phone")}
                placeholder="+1 234 5678"
                className="w-full border-b border-white/20 bg-transparent py-3 font-inconsolata text-white outline-none transition-colors placeholder:text-white/30 focus:border-accent"
              />
            </Field>

            <Field label="Write your message here..." error={errors.message?.message}>
              <textarea
                {...register("message")}
                rows={5}
                placeholder="Write your message here..."
                className="w-full border-b border-white/20 bg-transparent py-3 font-inconsolata text-white outline-none transition-colors placeholder:text-white/30 focus:border-accent"
              />
            </Field>

            <button
              type="submit"
              className="group relative inline-flex h-[58px] w-[324px] items-center gap-3 overflow-hidden border border-line px-8 font-sans text-base text-white"
            >
              <span className="relative z-10 transition-colors duration-300">
                Submit
              </span>
              <ArrowUpRight
                className="relative z-10 h-4 w-4 transition-opacity duration-300 group-hover:opacity-0"
                aria-hidden="true"
              />
              <span className="absolute inset-2 origin-left scale-0 bg-accent transition-transform duration-300 group-hover:scale-100" />
            </button>
          </motion.form>
        </SectionFrame>
      </Container>
    </section>
  );
};

export default Contact;
