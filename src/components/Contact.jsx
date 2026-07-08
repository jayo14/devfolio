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
  message: z.string().min(10, "Message must be at least 10 characters").max(500, "500 characters max"),
});

/**
 * FormField — bottom-border-only input/textarea
 *
 *  label      : visible label text
 *  required   : shows accent asterisk
 *  placeholder
 *  type       : input type (default "text")
 *  textarea   : renders <textarea rows={5} />
 *  error      : validation error string
 *  register   : react-hook-form register ref
 */
function FormField({ label, required, placeholder, type = "text", textarea = false, error, register }) {
  const baseStyle = {
    width: "100%",
    marginTop: 8,
    background: "transparent",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderBottom: "1px solid rgb(102, 102, 102)",
    outline: "none",
    paddingTop: 12,
    paddingBottom: 12,
    fontFamily: "Inconsolata, monospace",
    fontSize: textarea ? 16 : 18,
    color: "#ffffff",
    transition: "border-color 0.2s ease",
    resize: "none",
  };

  return (
    <label className="block">
      <span
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: 14,
          color: "#ffffff",
        }}
      >
        {label}
        {required && (
          <span style={{ color: "#FF4F22", marginLeft: 2 }}>*</span>
        )}
      </span>

      {textarea ? (
        <textarea
          {...register}
          placeholder={placeholder}
          rows={5}
          style={baseStyle}
          onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#FF4F22")}
          onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgb(102, 102, 102)")}
        />
      ) : (
        <input
          {...register}
          type={type}
          placeholder={placeholder}
          style={baseStyle}
          onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#FF4F22")}
          onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgb(102, 102, 102)")}
        />
      )}

      {error && (
        <span
          style={{
            display: "block",
            marginTop: 4,
            fontFamily: "Inconsolata, monospace",
            fontSize: 12,
            color: "#FF4F22",
          }}
        >
          {error}
        </span>
      )}
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
        {/* ── Centered title block with TOP border ── */}
        <div
          className="text-center"
          style={{
            borderTop: "1px solid #262626",
            paddingTop: 48,
            paddingBottom: 48,
          }}
        >
          <p
            style={{
              fontFamily: "Inconsolata, monospace",
              fontSize: 16,
              color: "#ffffff",
              marginBottom: 12,
            }}
          >
            // Contact
          </p>
          <h2
            className="font-medium"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 40,
              lineHeight: "48px",
              letterSpacing: "-1.2px",
              color: "#ffffff",
            }}
          >
            Success is a team play, right?{" "}
            <span style={{ color: "#FF4F22" }}>Let&apos;s work</span>{" "}
            together!
          </h2>
        </div>

        {/* ── Contact card: border frame + 4 PlusCorners ── */}
        <div className="relative border border-line">
          <PlusCorner corner="top-left" color="white" />
          <PlusCorner corner="top-right" color="white" />
          <PlusCorner corner="bottom-right" color="white" />
          <PlusCorner corner="bottom-left" color="white" />

          {/* Form — max-w-520px, centered, p-12 */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ maxWidth: 520, margin: "0 auto", padding: 48 }}
          >
            <div
              className="grid gap-6"
              style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 32 }}
            >
              <FormField
                label="First Name"
                required
                placeholder="Your first name"
                register={register("firstName")}
                error={errors.firstName?.message}
              />
              <FormField
                label="Last Name"
                required
                placeholder="Your last name"
                register={register("lastName")}
                error={errors.lastName?.message}
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <FormField
                label="Email"
                required
                placeholder="Your email address"
                type="email"
                register={register("email")}
                error={errors.email?.message}
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <FormField
                label="Phone"
                required
                placeholder="+1 234 5678"
                type="tel"
                register={register("phone")}
                error={errors.phone?.message}
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <FormField
                label="Message"
                placeholder="Write your message here..."
                textarea
                register={register("message")}
                error={errors.message?.message}
              />
            </div>

            {/* Submit button — full width, 48px tall, accent border at rest → solid accent fill on hover */}
            <button
              type="submit"
              style={{
                width: "100%",
                height: 48,
                background: "transparent",
                color: "#ffffff",
                fontFamily: "Poppins, sans-serif",
                fontSize: 16,
                fontWeight: 400,
                border: "1px solid #FF4F22",
                cursor: "pointer",
                transition: "background-color 0.3s ease, color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FF4F22";
                e.currentTarget.style.color = "#000000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#ffffff";
              }}
            >
              Submit
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
};

export default Contact;
