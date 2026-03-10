interface StepCardProps {
    number: string;
    title: string;
    desc: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, desc }) => {
    return (
        <div className="flex gap-6 items-start py-6 border-b border-gray-200 first:pt-0 last:border-b-0 last:pb-0 group cursor-default">

            <div
                className="font-bold text-sm border border-gray-200 rounded-lg px-3 py-2"
                style={{ color: "var(--foreground)" }}
            >
                {number}
            </div>

            <div>
                <h4 className="font-bold mb-1" style={{ color: "var(--foreground)" }}>
                    {title}
                </h4>

                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
};

export default StepCard;