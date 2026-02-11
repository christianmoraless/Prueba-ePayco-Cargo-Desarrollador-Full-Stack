import type { InputHTMLAttributes } from 'react';
import type { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    register: UseFormRegisterReturn;
    error?: FieldError;
    icon?: React.ReactNode;
}

export default function FormInput({
    label,
    register,
    error,
    icon,
    ...rest
}: FormInputProps) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300">
                {label}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        {icon}
                    </div>
                )}
                <input
                    {...register}
                    {...rest}
                    className={`
            w-full rounded-xl border bg-slate-800/50 px-4 py-3 text-sm text-white
            placeholder-slate-500 backdrop-blur-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
            ${icon ? 'pl-10' : ''}
            ${error
                            ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500'
                            : 'border-slate-700/50 hover:border-slate-600'
                        }
          `}
                />
            </div>
            {error && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {error.message}
                </p>
            )}
        </div>
    );
}
