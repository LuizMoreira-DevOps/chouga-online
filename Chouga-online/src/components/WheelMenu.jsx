import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    {
        number: "01",
        label: "Home",
        icon: Home,
        route: "/",
    },
    {
        number: "02",
        label: "Camisetas",
        icon: Shirt,
        route: "/camisetas",
    },
    {
        number: "03",
        label: "Shapes",
        icon: Zap,
        route: "/shapes",
    },
    {
        number: "04",
        label: "Acessórios",
        icon: Package,
        route: "/acessorios",
    },
    {
        number: "05",
        label: "Vídeos",
        icon: Video,
        route: "/videos",
    },
    {
        number: "06",
        label: "Sobre",
        icon: Users,
        route: "/sobre",
    },
    {
        number: "07",
        label: "Contato",
        icon: Mail,
        route: "/contato",
    },
];

function WheelMenu() {
    const [activeItem, setActiveItem] = useState("Home");

    const navigate = useNavigate();

    const wheelSize = 420;
    const radius = 300;

    return (
        <section className="relative min-h-screen overflow-hidden bg-[#050505] text-[#d7c5aa]">
            {/* Fundo */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(111,54,18,0.18),transparent_35%),linear-gradient(135deg,#070707,#121212_45%,#050505)]" />

            <div className="absolute inset-0 bg-black/60" />

            {/* Conteúdo */}
            <div className="relative z-10 flex min-h-screen items-center justify-center">
                {/* Roda */}
                <div
                    className="relative flex items-center justify-center"
                    style={{
                        width: "800px",
                        height: "800px",
                    }}
                >
                    {/* Raios */}
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute h-[2px] w-[700px] bg-gradient-to-r from-transparent via-[#c9561d]/70 to-transparent"
                            style={{
                                transform: `rotate(${i * 45}deg)`,
                            }}
                        />
                    ))}

                    {/* Itens do menu */}
                    {menuItems.map((item, index) => {
                        const angle = (index * 360) / menuItems.length - 90;

                        const radian = (angle * Math.PI) / 180;

                        const x = Math.cos(radian) * radius;

                        const y = Math.sin(radian) * radius;

                        const Icon = item.icon;

                        const isActive = activeItem === item.label;

                        return (
                            <button
                                key={item.label}
                                onMouseEnter={() => setActiveItem(item.label)}
                                onClick={() => navigate(item.route)}
                                className="absolute flex items-center gap-3 transition-all duration-300 hover:scale-110"
                                style={{
                                    left: "50%",
                                    top: "50%",
                                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                                }}
                            >
                                <Icon
                                    size={30}
                                    className={
                                        isActive
                                            ? "text-[#c9561d]"
                                            : "text-[#d7c5aa]"
                                    }
                                />

                                <div className="text-left uppercase leading-none">
                                    <p className="text-lg font-black text-[#c9561d]">
                                        {item.number}
                                    </p>

                                    <p className="text-2xl font-black tracking-tight">
                                        {item.label}
                                    </p>
                                </div>
                            </button>
                        );
                    })}

                    {/* Roda central */}
                    <button
                        className="relative flex items-center justify-center rounded-full transition-all duration-700 hover:rotate-6 hover:scale-105"
                        style={{
                            width: wheelSize,
                            height: wheelSize,
                        }}
                    >
                        {/* Corpo da roda */}
                        <div className="absolute inset-0 rounded-full bg-[#d7c5aa] shadow-[0_0_80px_rgba(201,86,29,0.28)]" />

                        {/* Borda */}
                        <div className="absolute inset-4 rounded-full border-[16px] border-[#151515]" />

                        {/* Miolo */}
                        <div className="absolute inset-16 rounded-full border-[18px] border-[#222] bg-black" />

                        {/* Centro */}
                        <div className="absolute h-32 w-32 rounded-full border-[12px] border-[#444] bg-[#050505]" />

                        <div className="absolute h-12 w-12 rounded-full bg-black" />

                        {/* Texto superior */}
                        <div className="absolute top-20 text-4xl font-black uppercase tracking-tight text-[#18120e] rotate-[-8deg]">
                            Chouga Skate
                        </div>

                        {/* Texto inferior */}
                        <div className="absolute bottom-20 text-3xl font-black uppercase tracking-tight text-[#18120e] rotate-[7deg]">
                            Since 2022
                        </div>

                        {/* Pontos decorativos */}
                        {[...Array(18)].map((_, i) => (
                            <span
                                key={i}
                                className="absolute h-2 w-2 rounded-full bg-[#c9561d]/60"
                                style={{
                                    transform: `rotate(${i * 20}deg) translateY(-185px)`,
                                }}
                            />
                        ))}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default WheelMenu;