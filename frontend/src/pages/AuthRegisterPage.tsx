import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
    HiOutlineMail,
    HiOutlineLockClosed,
    HiOutlineIdentification,
    HiOutlineUser,
    HiOutlinePhone,
} from 'react-icons/hi';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import { authRegister } from '@/api/walletApi';
import { useAppDispatch } from '@/store';
import { setAuth } from '@/store/authSlice';
import type { RegisterFormData, ApiResponse } from '@/types';

const schema = yup.object().shape({
    documento: yup
        .string()
        .required('El documento es obligatorio')
        .matches(/^[0-9]+$/, 'Solo números')
        .min(5, 'Mínimo 5 caracteres'),
    nombres: yup
        .string()
        .required('El nombre es obligatorio')
        .min(3, 'Mínimo 3 caracteres'),
    email: yup
        .string()
        .required('El email es obligatorio')
        .email('Email no válido'),
    celular: yup
        .string()
        .required('El celular es obligatorio')
        .matches(/^[0-9]+$/, 'Solo números')
        .min(7, 'Mínimo 7 dígitos'),
    password: yup
        .string()
        .required('La contraseña es obligatoria')
        .min(6, 'Mínimo 6 caracteres'),
});

export default function AuthRegisterPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: yupResolver(schema),
    });

    const registerMutation = useMutation({
        mutationFn: authRegister,
        onSuccess: (response) => {
            if (response.success && response.data) {
                dispatch(setAuth(response.data));
                toast.success('¡Cuenta creada exitosamente!');
                navigate('/');
            }
        },
        onError: (error: ApiResponse) => {
            toast.error(error.message || 'Error al registrar');
        },
    });

    const onSubmit = (data: RegisterFormData) => {
        registerMutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
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
                    <p className="text-slate-400">Crea tu cuenta</p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormInput
                            label="Documento de Identidad"
                            register={register('documento')}
                            error={errors.documento}
                            placeholder="Ej: 1234567890"
                            icon={<HiOutlineIdentification className="w-4 h-4" />}
                        />

                        <FormInput
                            label="Nombre Completo"
                            register={register('nombres')}
                            error={errors.nombres}
                            placeholder="Ej: Juan Pérez"
                            icon={<HiOutlineUser className="w-4 h-4" />}
                        />

                        <FormInput
                            label="Email"
                            register={register('email')}
                            error={errors.email}
                            placeholder="tu@email.com"
                            type="email"
                            icon={<HiOutlineMail className="w-4 h-4" />}
                        />

                        <FormInput
                            label="Celular"
                            register={register('celular')}
                            error={errors.celular}
                            placeholder="Ej: 3001234567"
                            icon={<HiOutlinePhone className="w-4 h-4" />}
                        />

                        <FormInput
                            label="Contraseña"
                            register={register('password')}
                            error={errors.password}
                            placeholder="Mínimo 6 caracteres"
                            type="password"
                            icon={<HiOutlineLockClosed className="w-4 h-4" />}
                        />

                        <Button type="submit" isLoading={registerMutation.isPending} fullWidth>
                            Crear Cuenta
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-400">
                            ¿Ya tienes cuenta?{' '}
                            <Link
                                to="/login"
                                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                            >
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
