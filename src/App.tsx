import { useState, useEffect, useRef, useCallback } from "react";

export default function App() {
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [initialized, setInitialized] = useState(false);
  const [isScared, setIsScared] = useState(false);
  const [isTeleporting, setIsTeleporting] = useState(false);
  const [yesMessage, setYesMessage] = useState("");

  const noPosRef = useRef({ x: 0, y: 0 });
  const noRef = useRef<HTMLButtonElement>(null);
  const yesRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize No button next to Yes
  useEffect(() => {
    if (!noRef.current || !yesRef.current || !containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const yes = yesRef.current.getBoundingClientRect();
    const no = noRef.current.getBoundingClientRect();

    const yesLeft = yes.left - container.left;
    const yesTop = yes.top - container.top;
    const gap = 24;
    const startX = yesLeft + yes.width + gap;
    const startY = yesTop + (yes.height - no.height) / 2;

    noPosRef.current = { x: startX, y: startY };
    setNoPos({ x: startX, y: startY });
    setInitialized(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!noRef.current || !containerRef.current || !initialized) return;

      const container = containerRef.current.getBoundingClientRect();
      const btn = noRef.current.getBoundingClientRect();
      const btnW = btn.width;
      const btnH = btn.height;

      const btnCenterX = noPosRef.current.x + btnW / 2;
      const btnCenterY = noPosRef.current.y + btnH / 2;
      const mouseX = e.clientX - container.left;
      const mouseY = e.clientY - container.top;

      const dx = mouseX - btnCenterX;
      const dy = mouseY - btnCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const FLEE_RADIUS = 160;

      if (dist < FLEE_RADIUS) {
        setIsScared(true);
        const force = Math.pow((FLEE_RADIUS - dist) / FLEE_RADIUS, 0.5) * 280;
        const angle = Math.atan2(dy, dx);
        const juke = (Math.random() - 0.5) * 0.5;
        const fleeAngle = angle + Math.PI + juke;

        let newX = noPosRef.current.x + Math.cos(fleeAngle) * force;
        let newY = noPosRef.current.y + Math.sin(fleeAngle) * force;

        const padding = 12;
        newX = Math.max(padding, Math.min(container.width - btnW - padding, newX));
        newY = Math.max(padding, Math.min(container.height - btnH - padding, newY));

        noPosRef.current = { x: newX, y: newY };
        setNoPos({ x: newX, y: newY });
      } else {
        setIsScared(false);
      }
    },
    [initialized]
  );

  return (
    <div
      className="w-screen h-screen flex items-center justify-center overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, #fdf4f0 0%, #fde8e0 50%, #f9d4c8 100%)",
        fontFamily: "'Georgia', serif",
      }}
    >
      {/* Glows */}
      <div
        className="absolute rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{
          width: 400,
          height: 400,
          background: "#f4a582",
          top: "0",
          left: "0",
          transform: "translate(-20%, -20%)",
        }}
      />
      <div
        className="absolute rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{
          width: 300,
          height: 300,
          background: "#e86c5d",
          bottom: "0",
          right: "0",
          transform: "translate(20%, 20%)",
        }}
      />

      {/* Card Container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-2xl mx-auto h-[480px] overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        <div
          className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-10"
          style={{
            background: "rgba(255,255,255,0.65)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 8px 60px rgba(200,80,60,0.12), 0 2px 12px rgba(0,0,0,0.06)",
            border: "1px solid rgba(255,255,255,0.8)",
          }}
        >
          {/* Title */}
          <div className="text-center px-8">
            <p
              className="text-sm uppercase tracking-[0.3em] text-rose-400 mb-3"
              style={{ fontFamily: "sans-serif", fontWeight: 500 }}
            >
              dear mari,
            </p>
            <h1
              className="text-5xl text-rose-900 leading-tight"
              style={{ fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              Will you go to prom
              <br />
              <span className="text-rose-500">with me?</span> 🌹
            </h1>
          </div>

          {/* Yes button */}
          <button
            ref={yesRef}
            className="px-10 py-3 rounded-2xl text-white text-lg font-semibold transition-all duration-150 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #e8453c, #f87171)",
              boxShadow: "0 4px 20px rgba(232,69,60,0.4)",
              fontFamily: "sans-serif",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.07)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 6px 28px rgba(232,69,60,0.55)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 4px 20px rgba(232,69,60,0.4)";
            }}
            onClick={() => {
              setYesMessage("look behind you <3");
              setTimeout(() => setYesMessage(""), 3000);
            }}
          >
            Yes!
          </button>

          {/* Animated Yes message */}
          {yesMessage && (
            <div
              className="absolute top-4 left-1/2 transform -translate-x-1/2 rounded-2xl px-6 py-3 pointer-events-none select-none animate-fade"
              style={{
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(12px)",
                color: "#e8453c",
                fontFamily: "'Georgia', serif",
                fontWeight: 700,
                fontSize: "1.5rem",
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(232,69,60,0.2)",
              }}
            >
              {yesMessage}
            </div>
          )}

          {isScared && (
            <p
              className="absolute bottom-6 text-s text-rose-300 italic pointer-events-none select-none"
              style={{ fontFamily: "sans-serif" }}
            >
              I mean, if you can catch me ig
            </p>
          )}
        </div>

        {/* Invisible No button */}
        {!initialized && (
          <button
            ref={noRef}
            className="invisible absolute px-8 py-3 rounded-2xl text-lg font-semibold"
            style={{ fontFamily: "sans-serif" }}
          >
            No !
          </button>
        )}

        {/* No button — flees cursor */}
        {initialized && (
          <button
            ref={noRef}
            className="absolute px-8 py-3 rounded-2xl text-lg font-semibold select-none"
            style={{
              left: noPos.x,
              top: noPos.y,
              transition: isTeleporting
                ? "none"
                : "left 0.06s cubic-bezier(0.15,0,0,1), top 0.06s cubic-bezier(0.15,0,0,1), transform 0.15s ease",
              background: "rgba(255,255,255,0.75)",
              border: "1.5px solid #fca5a5",
              color: "#e8453c",
              fontFamily: "sans-serif",
              letterSpacing: "0.02em",
              boxShadow: isScared
                ? "0 8px 30px rgba(232,69,60,0.2)"
                : "0 2px 10px rgba(232,69,60,0.08)",
              transform: isScared ? "rotate(-10deg) scale(0.92)" : "rotate(0deg) scale(1)",
              cursor: "default",
              backdropFilter: "blur(8px)",
            }}
            onClick={() => {
              if (!containerRef.current || !noRef.current) return;
              const container = containerRef.current.getBoundingClientRect();
              const btn = noRef.current.getBoundingClientRect();
              const padding = 12;
              const maxX = container.width - btn.width - padding;
              const maxY = container.height - btn.height - padding;
              let newX: number, newY: number;
              let attempts = 0;
              do {
                newX = padding + Math.random() * (maxX - padding);
                newY = padding + Math.random() * (maxY - padding);
                attempts++;
              } while (
                Math.hypot(newX - noPosRef.current.x, newY - noPosRef.current.y) < 200 &&
                attempts < 20
              );
              noPosRef.current = { x: newX, y: newY };
              setIsTeleporting(true);
              setNoPos({ x: newX, y: newY });
              setTimeout(() => setIsTeleporting(false), 50);
            }}
          >
            No !
          </button>
        )}
      </div>

      {/* Add fade animation CSS */}
      <style>
        {`
          @keyframes fade {
            0% { opacity: 0; transform: translateY(-10px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
          }
          .animate-fade {
            animation: fade 3s ease forwards;
          }
        `}
      </style>
    </div>
  );
}