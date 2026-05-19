type AdminStatCardProps = {
    icon: React.ReactNode;
    label: string;
    value: string;
    valueClassName?: string;
    iconWrapClassName?: string;
    cardBorderClassName?: string;
};

import { adminTokens } from './designTokens';

export default function AdminStatCard({
    icon,
    label,
    value,
    valueClassName = 'text-[#2A2A2A]',
    iconWrapClassName = 'bg-[#FDF1F0] text-[#FF9A9E]',
    cardBorderClassName = 'border-white',
}: AdminStatCardProps) {
    return (
        <div className={`${adminTokens.cardBg} p-6 ${adminTokens.cardRadius} border flex flex-col gap-4 ${cardBorderClassName}`}>
            <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconWrapClassName}`}>
                    {icon}
                </div>
            </div>
            <div>
                <span className="text-[10px] font-bold tracking-[0.15em] text-[#2A2A2A]/40 uppercase block mb-1">
                    {label}
                </span>
                <span className={`text-2xl font-black not-italic tracking-tighter ${valueClassName}`}>
                    {value}
                </span>
            </div>
        </div>
    );
}