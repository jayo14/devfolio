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

function FormField({ label, required = false, placeholder, type = "text", textarea = false, register, error }) {
  return (
    <label className="contact-field">
      <span>{label}{required && <b>*</b>}</span>
      {textarea ? <textarea {...register} placeholder={placeholder} rows={5} /> : <input {...register} type={type} placeholder={placeholder} />}
      {error && <small>{error}</small>}
    </label>
  );
}

function ContactForm() {
  const [status, setStatus] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const onSubmit = () => setStatus("success");

  return (
    <div className="contact-card">
      <PlusCorner corner="top-left" color="white" /><PlusCorner corner="top-right" color="white" /><PlusCorner corner="bottom-right" color="white" /><PlusCorner corner="bottom-left" color="white" />
      {status === "success" ? (
        <div className="form-status success" role="status">Thank you! Your submission has been received!</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="contact-fields-grid">
            <FormField label="First Name" required placeholder="Your first name" register={register("firstName")} error={errors.firstName?.message} />
            <FormField label="Last Name" required placeholder="Your last name" register={register("lastName")} error={errors.lastName?.message} />
          </div>
          <FormField label="Email Address" required placeholder="Your email address" type="email" register={register("email")} error={errors.email?.message} />
          <FormField label="Phone Number" required placeholder="+1 234 5678" type="tel" register={register("phone")} error={errors.phone?.message} />
          <FormField label="Message" placeholder="Write your message here..." textarea register={register("message")} error={errors.message?.message} />
          <button type="submit" className="contact-submit">Send Your Message</button>
          {status === "error" && <div className="form-status error" role="alert">Oops! Something went wrong while submitting the form.</div>}
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
