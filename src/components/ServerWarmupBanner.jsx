import { useState, useEffect } from "react";

export default function ServerWarmupBanner({ apiBaseUrl = import.meta.env.VITE_API_URL ?? "" }) {
  const [status, setStatus] = useState("idle"); // "idle" | "warming" | "ready" | "hidden"

  useEffect(() => {
    const rawUrl = (apiBaseUrl || "").replace(/\/+$/, "");
    const healthUrl = rawUrl ? `${rawUrl}/health` : "/health";
    let isMounted = true;

    // Only surface the warming indicator if response takes > 1.8s (cold start detection)
    const timerId = setTimeout(() => {
      if (isMounted) {
        setStatus("warming");
      }
    }, 1800);

    const checkHealth = async () => {
      try {
        let res = await fetch(healthUrl);
        if (!res.ok && rawUrl) {
          // Fallback to /api/health if /health returned non-200
          res = await fetch(`${rawUrl}/api/health`);
        }
        if (res.ok && isMounted) {
          clearTimeout(timerId);
          setStatus((current) => {
            if (current === "warming") {
              setTimeout(() => {
                if (isMounted) setStatus("hidden");
              }, 2500);
              return "ready";
            }
            return "hidden";
          });
        }
      } catch {
        // Backend currently booting or unreachable, keep waiting
      }
    };

    checkHealth();

    return () => {
      isMounted = false;
      clearTimeout(timerId);
    };
  }, [apiBaseUrl]);

  if (status === "idle" || status === "hidden") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[9999] flex items-center gap-2.5 border border-line bg-[#080808]/95 px-3.5 py-2 font-inconsolata text-xs tracking-wider text-white shadow-2xl backdrop-blur-sm"
    >
      {status === "warming" ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-white/90">
            WAKING SERVER <span className="text-accent">(RENDER COLD START ~30S)</span>
          </span>
        </>
      ) : (
        <>
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-white/90">SERVER READY</span>
        </>
      )}
    </div>
  );
}
