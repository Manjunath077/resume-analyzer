interface FloatingOrbProps {
    style: React.CSSProperties;
}

const FloatingOrb: React.FC<FloatingOrbProps> = ({ style }) => {
    return (
        <div
            className="absolute rounded-full pointer-events-none animate-float"
            style={style}
        />
    );
};

export default FloatingOrb;