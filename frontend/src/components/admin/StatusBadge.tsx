type StatusBadgeProps = {
    text: string;
    variant: 'blue' | 'emerald' | 'red';
    rounded?: 'full' | 'md';
    bordered?: boolean;
    helperActionText?: string;
};

const variantMap: Record<StatusBadgeProps['variant'], string> = {
    blue: 'bg-[#EBF3FF] text-blue-600',
    emerald: 'bg-[#EAF5EF] text-emerald-600',
    red: 'bg-[#FDF1F0] text-red-600',
};

const borderVariantMap: Record<StatusBadgeProps['variant'], string> = {
    blue: 'border border-blue-100',
    emerald: 'border border-emerald-100',
    red: 'border border-red-100',
};

export default function StatusBadge({ text, variant, rounded = 'full', bordered = false, helperActionText }: StatusBadgeProps) {
    const radiusClass = rounded === 'md' ? 'rounded-md' : 'rounded-full';
    const borderClass = bordered ? borderVariantMap[variant] : '';

    return (
        <div className="flex flex-col items-end">
                <span className={`px-3 py-1.5 text-[9px] font-black tracking-wider uppercase ${radiusClass} ${variantMap[variant]} ${borderClass} ${helperActionText ? 'mb-1' : ''}`}>
                    {text}
                </span>
            {helperActionText ? (
                <button type="button" className="text-[7px] font-bold tracking-widest text-red-400 hover:text-red-600 uppercase transition-colors pr-2">
                    {helperActionText}
                </button>
            ) : null}
        </div>
    );
}
