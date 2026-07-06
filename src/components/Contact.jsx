import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FaDribbble, FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import SectionHeader from "./SectionHeader.jsx";

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
  { label: "Dribbble", href: "https://dribbble.com", Icon: FaDribbble },
];

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="font-inconsolata text-xs uppercase tracking-[0.18em] text-white/60">
        {label}
      </span>
      <div className="mt-3">{children}</div>
      {error ? (
        <span className="mt-2 block font-inconsolata text-xs text-accent">
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
    <section id="contact" className="bg-black px-6 py-40 text-white lg:px-20">
      <div className="mx-auto grid max-w-[1440px] gap-20 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader tag="// Contact" title="Get In" highlight="Touch" />
          <p className="mt-8 max-w-md font-inconsolata text-white/60">
            Let&apos;s discuss your next project. I&apos;m currently available for
            freelance work or full-time positions.
          </p>

          <div className="mt-12 space-y-4 font-inconsolata text-white/80">
            <a className="block transition-colors hover:text-accent" href="mailto:LGC.studio@gmail.com">
              LGC.studio@gmail.com
            </a>
            <a className="block transition-colors hover:text-accent" href="tel:+34123456789">
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
          className="space-y-8"
        >
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
            className="group relative inline-flex overflow-hidden bg-accent px-8 py-4 font-semibold text-black transition-colors hover:text-black"
          >
            <span className="relative z-10 inline-flex items-center gap-3">
              Submit
              <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </span>
            <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100" />
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
