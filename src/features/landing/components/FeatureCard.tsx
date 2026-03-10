interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    desc: string;
    delay: string;
}

const FeatureCard:React.FC<FeatureCardProps> = ({ icon: Icon, title, desc, delay }) => {
    return (
        <div
            className="bg-white border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 opacity-0 animate-fade-up"
            style={{ animationDelay: delay, animationFillMode: "forwards" }}
        >
            <div
                className="w-12 h-12 flex items-center justify-center rounded-lg mb-4"
                style={{ background: "rgba(0,0,0,0.05)" }}
            >
                <Icon className="w-6 h-6" style={{ color: "var(--foreground)" }} />
            </div>

            <h3 className="font-bold mb-2" style={{ color: "var(--foreground)" }}>
                {title}
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
        </div>
    );
};

export default FeatureCard;