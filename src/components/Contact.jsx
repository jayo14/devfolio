import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PlusCorner from "./PlusCorner.jsx";
import { Container } from "./Container.jsx";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Enter a valid phone number"),
  message: z.string().optional(),
});

function FormField({ label, name, required = false, placeholder, type = "text", textarea = false, register, error }) {
  const fieldId = `contact-${name || label.toLowerCase().replace(/\s+/g, "-")}`;
  const errorId = `${fieldId}-error`;

  return (
    <label htmlFor={fieldId} className="contact-field">
      <span>{label}{required && <b aria-hidden="true">*</b>}</span>
      {textarea ? (
        <textarea
          id={fieldId}
          {...register}
          placeholder={placeholder}
          rows={5}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
      ) : (
        <input
          id={fieldId}
          {...register}
          type={type}
          placeholder={placeholder}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
      )}
      {error && <small id={errorId} role="alert">{error}</small>}
    </label>
  );
}

function ContactForm() {
  const [status, setStatus] = useState(null); // null | "submitting" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setStatus("submitting");
    setErrorMessage("");

    const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
    const endpoint = apiBase ? `${apiBase}/api/contact/` : "/api/contact/";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Submission failed (${res.status})`);
      }

      setStatus("success");
      reset();
    } catch (err) {
      console.error("Contact submission error:", err);
      setStatus("error");
      setErrorMessage(err.message || "Oops! Something went wrong while submitting the form.");
    }
  };

  return (
    <div className="contact-card">
      <PlusCorner corner="top-left" color="white" /><PlusCorner corner="top-right" color="white" /><PlusCorner corner="bottom-right" color="white" /><PlusCorner corner="bottom-left" color="white" />
      {status === "success" ? (
        <div className="form-status success" role="status">
          <p className="font-medium text-white mb-2 text-xl">Thank you! Your message has been received.</p>
          <p className="text-sm text-white/70 max-w-md mx-auto">
            Your inquiry has been forwarded directly to John Ayobami (johnayobami77@proton.me). I will respond to your email as soon as possible.
          </p>
          <button
            type="button"
            onClick={() => setStatus(null)}
            className="mt-6 inline-block text-xs font-mono text-accent hover:underline uppercase tracking-wider"
          >
            ← Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="contact-fields-grid">
            <FormField label="First Name" name="firstName" required placeholder="Your first name" register={register("firstName")} error={errors.firstName?.message} />
            <FormField label="Last Name" name="lastName" required placeholder="Your last name" register={register("lastName")} error={errors.lastName?.message} />
          </div>
          <FormField label="Email Address" name="email" required placeholder="Your email address" type="email" register={register("email")} error={errors.email?.message} />
          <FormField label="Phone Number" name="phone" required placeholder="+1 234 5678" type="tel" register={register("phone")} error={errors.phone?.message} />
          <FormField label="Message" name="message" placeholder="Write your message here..." textarea register={register("message")} error={errors.message?.message} />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="contact-submit disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "submitting" ? "Sending Your Message..." : "Send Your Message"}
          </button>
          {status === "error" && (
            <div className="form-status error" role="alert">
              {errorMessage || "Oops! Something went wrong while submitting the form."}
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export function Contact({ standalone = false }) {
  return (
    <>
      {standalone && <section className="inner-banner"><Container><div className="section-heading"><p className="eyebrow">// Contact</p><h1>Get in Touch</h1></div></Container></section>}
      <section id="contact" className={standalone ? "original-contact-page" : "original-contact-section"}>
        <Container>
          {!standalone && <div className="section-heading centered contact-heading"><p className="eyebrow">// Services</p><h2>Success is a team <br className="desktop-break" />play, right? <span>Let’s work together!</span></h2></div>}
          <ContactForm />
        </Container>
      </section>
    </>
  );
}

export default Contact;
