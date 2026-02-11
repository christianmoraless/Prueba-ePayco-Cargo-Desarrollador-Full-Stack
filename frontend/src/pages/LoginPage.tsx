import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import { authLogin } from '@/api/walletApi';
import { useAppDispatch } from '@/store';
import { setAuth } from '@/store/authSlice';
import type { LoginFormData, ApiResponse } from '@/types';

const schema = yup.object().shape({
    email: yup
        .string()
        .required('El email es obligatorio')
        .email('Email no válido'),
    password: yup
        .string()
        .required('La contraseña es obligatoria')
        .min(6, 'Mínimo 6 caracteres'),
});

export default function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: yupResolver(schema),
    });

    const loginMutation = useMutation({
        mutationFn: authLogin,
        onSuccess: (response) => {
            if (response.success && response.data) {
                dispatch(setAuth(response.data));
                toast.success('¡Bienvenido!');
                navigate('/');
            }
        },
        onError: (error: ApiResponse) => {
            toast.error(error.message || 'Credenciales incorrectas');
        },
    });

    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutate(data);
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
                    <p className="text-slate-400">Inicia sesión en tu cuenta</p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <FormInput
                            label="Email"
                            register={register('email')}
                            error={errors.email}
                            placeholder="tu@email.com"
                            type="email"
                            icon={<HiOutlineMail className="w-4 h-4" />}
                        />

                        <FormInput
                            label="Contraseña"
                            register={register('password')}
                            error={errors.password}
                            placeholder="••••••"
                            type="password"
                            icon={<HiOutlineLockClosed className="w-4 h-4" />}
                        />

                        <div className="text-right">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <Button type="submit" isLoading={loginMutation.isPending} fullWidth>
                            Iniciar Sesión
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-400">
                            ¿No tienes cuenta?{' '}
                            <Link
                                to="/auth/register"
                                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                            >
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
