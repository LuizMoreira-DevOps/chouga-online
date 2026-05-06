import { Home, Shirt, Mail, Users } from "lucide-react";

const menuItems = [
    {
        number: "01",
        label: "Home",
        icon: Home,
    },
    {
        number: "02",
        label: "Camisetas",
        icon: Shirt,
    },
    {
        number: "03",
        label: "Sobre",
        icon: Users,
    },
    {
        number: "04",
        label: "Contato",
        icon: Mail,
    },
];

function WheelMenu() {
    const radius = 300;

    return (
        <main
            style={{
                background: "#050505",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: "relative",
                    width: "700px",
                    height: "700px",
                }}
            >
                {/* Raios */}
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            width: "600px",
                            height: "2px",
                            background:
                                "radial-gradient(circle, #d7c5aa 0%, #c4ae8f 40%, #111 41%, #050505 70%)",
                            top: "50%",
                            left: "50%",
                            transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                            opacity: 0.9,
                        }}
                    />
                ))}

                {/* Menu */}
                {menuItems.map((item, index) => {
                    const angle = (index * 360) / menuItems.length - 90;

                    const radian = (angle * Math.PI) / 180;

                    const x = Math.cos(radian) * radius;

                    const y = Math.sin(radian) * radius;

                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                color: "#d7c5aa",
                                textTransform: "uppercase",
                                fontWeight: "900",
                            }}
                        >
                            <Icon color="#c9561d" />

                            <div>
                                <div
                                    style={{
                                        color: "#c9561d",
                                        fontSize: "14px",
                                    }}
                                >
                                    {item.number}
                                </div>

                                <div
                                    style={{
                                        fontSize: "24px",
                                    }}
                                >
                                    {item.label}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Roda */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "380px",
                        height: "380px",
                        borderRadius: "50%",
                        background: "#d7c5aa",
                        boxShadow: "0 0 80px rgba(201,86,29,0.35)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        trasition: "all 0.6s ease",
                        cursor: "pointer",
                        hover: {
                            transform: "translate(-50%, -50%) rotate(8deg)",
                        }
                    }}
                        >
                        {/* aro */ }
                        < div
            style={{
                        width: "320px",
                        height: "320px",
                        borderRadius: "50%",
                        border: "16px solid #111",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {/* miolo */}
                    <div
                        style={{
                            width: "180px",
                            height: "180px",
                            borderRadius: "50%",
                            border: "18px solid #222",
                            background: "#000",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {/* centro */}
                        <div
                            style={{
                                width: "70px",
                                height: "70px",
                                borderRadius: "50%",
                                background: "#111",
                                border: "10px solid #555",
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    </main >
  );
}

export default WheelMenu;