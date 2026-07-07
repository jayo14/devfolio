import { motion } from "framer-motion";

function SlotDigit({ target, delay = 0 }) {
  return (
    <div className="h-[100px] w-[60px] overflow-hidden">
      <motion.div
        className="flex flex-col"
        initial={{ y: 0 }}
        whileInView={{ y: -target * 100 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div
            key={n}
            className="flex h-[100px] items-center font-sans text-[100px] font-normal leading-[100px] text-white"
          >
            {n}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function CounterCard({ label, targetNumber, suffix = "", hasBottomBorder }) {
  return (
    <div
      className="w-[324px] border-t border-line py-8"
      style={{ borderBottom: hasBottomBorder ? "1px solid #262626" : "none" }}
    >
      <p className="mb-6 font-inconsolata text-[12px] leading-relaxed text-white">
        {label}
      </p>

      <div className="flex items-end overflow-hidden">
        {targetNumber.split("").map((digit, index) => (
          <SlotDigit key={`${digit}-${index}`} target={Number(digit)} delay={index * 0.2} />
        ))}
        {suffix ? (
          <span className="font-sans text-[100px] font-normal leading-[100px] text-white">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default CounterCard;
