import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    icon?: ReactNode;
    className?: string;
}

export default function Card({
    children,
    title,
    subtitle,
    icon,
    className = '',
}: CardProps) {
    return (
        <div
            className={`
        rounded-2xl border border-slate-700/50 bg-slate-800/30 
        backdrop-blur-xl p-6 shadow-xl shadow-black/10
        ${className}
      `}
        >
            {(title || icon) && (
                <div className="flex items-center gap-3 mb-6">
                    {icon && (
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400">
                            {icon}
                        </div>
                    )}
                    <div>
                        {title && (
                            <h2 className="text-lg font-semibold text-white">{title}</h2>
                        )}
                        {subtitle && (
                            <p className="text-sm text-slate-400">{subtitle}</p>
                        )}
                    </div>
                </div>
            )}
            {children}
        </div>
    );
}
