import { useState } from "react";
import {
  Home,
  Shirt,
  Mail,
  Users,
  Video,
  Zap,
  Package,
} from "lucide-react";

const menuItems = [
  { number: "01", label: "Home", icon: Home },
  { number: "02", label: "Camisetas", icon: Shirt },
  { number: "03", label: "Shapes", icon: Zap },
  { number: "04", label: "Acessórios", icon: Package },
  { number: "05", label: "Vídeos", icon: Video },
  { number: "06", label: "Sobre", icon: Users },
  { number: "07", label: "Contato", icon: Mail },
];

function WheelMenu() {
  const [isOpen, setIsOpen] = useState(true);

  const wheelSize = 380;
  const radius = 300;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#d7c5aa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "900px",
          height: "760px",
        }}
      >
        {menuItems.map((item, index) => {
          const angle = (index * 360) / menuItems.length - 90;
          const radian = (angle * Math.PI) / 180;
          const x = Math.cos(radian) * radius;
          const y = Math.sin(radian) * radius;
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: isOpen
                  ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`
                  : "translate(-50%, -50%) scale(0)",
                opacity: isOpen ? 1 : 0,
                transition: "0.4s ease",
                transitionDelay: isOpen ? `${index * 60}ms` : "0ms",
                background: "transparent",
                border: "none",
                color: "#d7c5aa",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  textTransform: "uppercase",
                  fontWeight: "900",
                }}
              >
                <Icon size={30} color="#c9561d" />

                <div style={{ textAlign: "left" }}>
                  <div style={{ color: "#c9561d", fontSize: "16px" }}>
                    {item.number}
                  </div>

                  <div style={{ fontSize: "24px" }}>{item.label}</div>
                </div>
              </div>
            </button>
          );
        })}

        {/* Raios externos */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: "720px",
              height: "2px",
              background:
                "linear-gradient(to right, transparent, rgba(201,86,29,.8), transparent)",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
              opacity: 0.6,
            }}
          />
        ))}

        {/* Roda */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: wheelSize,
            height: wheelSize,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            background: "transparent",
            transition: "0.7s ease",
          }}
        >
          <svg
            width={wheelSize}
            height={wheelSize}
            viewBox="0 0 200 200"
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.7s ease",
              filter: "drop-shadow(0 0 50px rgba(201,86,29,.35))",
            }}
          >
            <defs>
              <radialGradient id="wheelGradient">
                <stop offset="0%" stopColor="#d7c5aa" />
                <stop offset="65%" stopColor="#b99d76" />
                <stop offset="100%" stopColor="#151515" />
              </radialGradient>

              <radialGradient id="centerGradient">
                <stop offset="0%" stopColor="#444" />
                <stop offset="100%" stopColor="#050505" />
              </radialGradient>
            </defs>

            <circle cx="100" cy="100" r="95" fill="url(#wheelGradient)" />
            <circle cx="100" cy="100" r="82" fill="none" stroke="#111" strokeWidth="10" />
            <circle cx="100" cy="100" r="55" fill="#050505" />
            <circle cx="100" cy="100" r="35" fill="url(#centerGradient)" />
            <circle cx="100" cy="100" r="18" fill="#050505" stroke="#666" strokeWidth="6" />

            {[...Array(8)].map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const x1 = 100 + Math.cos(angle) * 38;
              const y1 = 100 + Math.sin(angle) * 38;
              const x2 = 100 + Math.cos(angle) * 78;
              const y2 = 100 + Math.sin(angle) * 78;

              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#c9561d"
                  strokeWidth="2"
                  opacity="0.6"
                />
              );
            })}

            <text
              x="100"
              y="75"
              textAnchor="middle"
              fill="#d7c5aa"
              fontSize="13"
              fontWeight="900"
            >
              CHOUGA
            </text>

            <text
              x="100"
              y="130"
              textAnchor="middle"
              fill="#d7c5aa"
              fontSize="10"
              fontWeight="900"
            >
              SKATEBOARD
            </text>
          </svg>
        </button>
      </div>
    </main>
  );
}

export default WheelMenu;