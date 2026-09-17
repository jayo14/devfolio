import { Loader2, RefreshCw, Server } from "lucide-react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Container } from "./Container.jsx";

export default function SelectedWorkLoading({
  elapsedSeconds,
  projectsError,
  isRetrying,
  onRetry,
}) {
  return (
    <section
      id="selected-work"
      className="original-slider-work bg-black text-white"
      aria-label="Selected Projects"
    >
      <Container>
        <div
          className="original-work-slider"
          role="region"
          aria-busy="true"
          aria-live="polite"
          aria-label="Featured projects showcase loading"
        >
          {/* Top Slide Frame with loading status */}
          <div className="original-work-slide-top relative flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px] md:min-h-[520px] lg:min-h-[580px] p-6 sm:p-12 overflow-hidden select-none">
            {/* Dark overlay on top of slider background */}
            <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] pointer-events-none" />

            {/* Glowing radial accent & subtle grid pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,79,34,0.12)_0%,transparent_75%)] pointer-events-none" />
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="absolute inset-x-0 h-28 bg-gradient-to-b from-transparent via-accent/15 to-transparent animate-slider-scanline pointer-events-none" />

            {/* Central Status Card */}
            <div className="relative z-10 w-full max-w-lg border border-[#2e2c2b] bg-[#080808]/95 p-6 sm:p-8 backdrop-blur-md shadow-2xl text-center">
              {/* Live pulsing badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-accent/40 bg-accent/10 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-accent mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                <span>{projectsError ? "Reconnecting to Server" : "Booting Server // Cold Start"}</span>
              </div>

              {/* Title */}
              <h3 className="font-mono text-xl sm:text-2xl font-medium tracking-tight text-white mb-2.5">
                Loading Featured Projects
              </h3>

              {/* Explanation */}
              <p className="font-mono text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-md mx-auto mb-6">
                {projectsError
                  ? "Cloud instance is still waking up. Reconnection attempt in progress..."
                  : "Render backend is spinning up from idle mode (~30s cold start). Showcase will load automatically once ready."}
              </p>

              {/* Indeterminate loader bar */}
              <div className="relative w-full h-1.5 bg-neutral-900 border border-neutral-800 overflow-hidden mb-5">
                <div className="absolute inset-y-0 bg-accent w-1/3 animate-slider-indeterminate" />
              </div>

              {/* Status metadata */}
              <div className="flex items-center justify-between font-mono text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-3">
                <span className="flex items-center gap-2 text-neutral-300">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                  <span>{projectsError ? "Retrying connection..." : "Querying API..."}</span>
                </span>
                <span className="flex items-center gap-2 text-neutral-400">
                  <Server className="w-3 h-3 text-neutral-500" />
                  <span>{elapsedSeconds}s elapsed</span>
                </span>
              </div>

              {/* Retry action if taking long or errored */}
              {(elapsedSeconds >= 10 || projectsError) && (
                <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={onRetry}
                    disabled={isRetrying}
                    className="inline-flex items-center gap-2 px-4 py-1.5 border border-neutral-700 hover:border-accent bg-neutral-900/80 hover:bg-accent/10 font-mono text-xs text-neutral-300 hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRetrying ? "animate-spin text-accent" : ""}`} />
                    <span>{isRetrying ? "Checking Server..." : "Retry Connection"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Slide Bar Skeleton */}
          <div className="original-work-slide-bottom relative">
            <div className="font-inconsolata text-sm sm:text-lg md:text-xl text-neutral-500 animate-pulse uppercase tracking-wider flex items-center gap-2">
              <span className="text-accent">//</span> Initializing Portfolio Showcase...
            </div>
          </div>

          {/* Inactive Controls Skeleton */}
          <div
            className="original-work-arrow-control original-work-arrow-left opacity-20 cursor-not-allowed pointer-events-none"
            aria-hidden="true"
          >
            <HiChevronLeft aria-hidden="true" />
          </div>
          <div
            className="original-work-arrow-control original-work-arrow-right opacity-20 cursor-not-allowed pointer-events-none"
            aria-hidden="true"
          >
            <HiChevronRight aria-hidden="true" />
          </div>
          <div className="original-work-counter opacity-40 font-mono text-xs" aria-hidden="true">
            -- / --
          </div>
        </div>
      </Container>
    </section>
  );
}
