import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineCheckCircle } from 'react-icons/hi';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import { authForgotPassword } from '@/api/walletApi';
import type { ForgotPasswordFormData, ApiResponse } from '@/types';

const schema = yup.object().shape({
    email: yup
        .string()
        .required('El email es obligatorio')
        .email('Email no válido'),
});

export default function ForgotPasswordPage() {
    const [sent, setSent] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
        resolver: yupResolver(schema),
    });

    const forgotMutation = useMutation({
        mutationFn: authForgotPassword,
        onSuccess: () => {
            setSent(true);
            toast.success('Instrucciones enviadas');
        },
        onError: (error: ApiResponse) => {
            toast.error(error.message || 'Error al procesar solicitud');
        },
    });

    const onSubmit = (data: ForgotPasswordFormData) => {
        forgotMutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">e</span>
                        </div>
                        <span className="text-xl font-bold text-white">
                            ePayco <span className="text-emerald-400">Wallet</span>
                        </span>
                    </div>
                    <p className="text-slate-400">Recuperar contraseña</p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {sent ? (
                        <div className="text-center space-y-4">
                            <HiOutlineCheckCircle className="w-16 h-16 text-emerald-400 mx-auto" />
                            <h3 className="text-lg font-semibold text-white">
                                ¡Revisa tu correo!
                            </h3>
                            <p className="text-sm text-slate-400">
                                Si el email está registrado, recibirás instrucciones para
                                restablecer tu contraseña.
                            </p>
                            <p className="text-xs text-slate-500">
                                💡 En modo desarrollo, revisa la consola del backend para ver el token de reset.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <p className="text-sm text-slate-400 mb-2">
                                Ingresa tu email y te enviaremos instrucciones para restablecer
                                tu contraseña.
                            </p>

                            <FormInput
                                label="Email"
                                register={register('email')}
                                error={errors.email}
                                placeholder="tu@email.com"
                                type="email"
                                icon={<HiOutlineMail className="w-4 h-4" />}
                            />

                            <Button type="submit" isLoading={forgotMutation.isPending} fullWidth>
                                Enviar Instrucciones
                            </Button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                        >
                            ← Volver al login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
