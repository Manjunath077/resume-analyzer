interface StatItemProps {
    value: string;
    label: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label }) => {
    return (
        <div className="flex-1 min-w-40 text-center py-8 px-4 border-r border-gray-200 last:border-r-0">
            <span
                className="block font-bold text-4xl leading-tight"
                style={{ color: "var(--foreground)" }}
            >
                {value}
            </span>

            <span className="block text-sm text-gray-500 mt-2 tracking-wide">
                {label}
            </span>
        </div>
    );
};

export default StatItem;