import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    isLoading?: boolean;
    fullWidth?: boolean;
}

const variants = {
    primary:
        'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25',
    secondary:
        'bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 border border-slate-600/50',
    danger:
        'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg shadow-red-500/25',
};

export default function Button({
    children,
    variant = 'primary',
    isLoading = false,
    fullWidth = false,
    className = '',
    disabled,
    ...rest
}: ButtonProps) {
    return (
        <button
            disabled={disabled || isLoading}
            className={`
        relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3
        text-sm font-semibold transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98] cursor-pointer
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            {...rest}
        >
            {isLoading && (
                <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
}
