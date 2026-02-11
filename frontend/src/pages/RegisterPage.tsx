import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { HiOutlineUserAdd, HiOutlineIdentification, HiOutlineMail, HiOutlinePhone, HiOutlineUser } from 'react-icons/hi';
import Card from '@/components/ui/Card';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import { useRegistrarCliente } from '@/hooks/useWalletQueries';

// Tipo local sin password (para registro interno de clientes)
interface WalletRegisterFormData {
    documento: string;
    nombres: string;
    email: string;
    celular: string;
}

const schema = yup.object().shape({
    documento: yup
        .string()
        .required('El documento es obligatorio')
        .min(5, 'Mínimo 5 caracteres')
        .max(20, 'Máximo 20 caracteres')
        .matches(/^[0-9]+$/, 'Solo números'),
    nombres: yup
        .string()
        .required('El nombre es obligatorio')
        .min(3, 'Mínimo 3 caracteres')
        .max(100, 'Máximo 100 caracteres'),
    email: yup
        .string()
        .required('El email es obligatorio')
        .email('Email no válido'),
    celular: yup
        .string()
        .required('El celular es obligatorio')
        .min(7, 'Mínimo 7 dígitos')
        .max(15, 'Máximo 15 dígitos')
        .matches(/^[0-9]+$/, 'Solo números'),
});

export default function RegisterPage() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<WalletRegisterFormData>({
        resolver: yupResolver(schema),
    });

    const mutation = useRegistrarCliente();

    const onSubmit = (data: WalletRegisterFormData) => {
        mutation.mutate(data as any, {
            onSuccess: (response) => {
                if (response.success) {
                    reset();
                }
            },
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Registro de Clientes</h1>
                <p className="text-slate-400 mt-1">
                    Registra un nuevo cliente en el sistema de billetera digital.
                </p>
            </div>

            <Card
                title="Nuevo Cliente"
                subtitle="Todos los campos son obligatorios"
                icon={<HiOutlineUserAdd className="w-5 h-5" />}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormInput
                            label="Documento de Identidad"
                            register={register('documento')}
                            error={errors.documento}
                            placeholder="Ej: 1234567890"
                            icon={<HiOutlineIdentification className="w-4 h-4" />}
                        />
                        <FormInput
                            label="Nombres Completos"
                            register={register('nombres')}
                            error={errors.nombres}
                            placeholder="Ej: Juan Pérez"
                            icon={<HiOutlineUser className="w-4 h-4" />}
                        />
                        <FormInput
                            label="Correo Electrónico"
                            register={register('email')}
                            error={errors.email}
                            placeholder="Ej: juan@correo.com"
                            type="email"
                            icon={<HiOutlineMail className="w-4 h-4" />}
                        />
                        <FormInput
                            label="Número de Celular"
                            register={register('celular')}
                            error={errors.celular}
                            placeholder="Ej: 3001234567"
                            icon={<HiOutlinePhone className="w-4 h-4" />}
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" isLoading={mutation.isPending}>
                            <HiOutlineUserAdd className="w-4 h-4" />
                            Registrar Cliente
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
