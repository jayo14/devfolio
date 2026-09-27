import { useEffect, useState } from "react";

const SplineScene = () => {
  const [ready, setReady] = useState(
    () => typeof window !== "undefined" && Boolean(customElements.get("spline-viewer"))
  );

  useEffect(() => {
    if (customElements.get("spline-viewer")) {
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer/build/spline-viewer.js";
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);

  if (!ready) {
    return <div className="h-full w-full bg-black" aria-hidden="true" />;
  }

  return (
    <spline-viewer
      url="https://prod.spline.design/JDBsFG7y3mx4vrRg/scene.splinecode"
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        background: "transparent",
        pointerEvents: "none",
      }}
    />
  );
};

export default SplineScene;
