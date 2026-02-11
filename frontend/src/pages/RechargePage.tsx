import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    HiOutlineCreditCard,
    HiOutlineIdentification,
    HiOutlinePhone,
    HiOutlineCurrencyDollar,
} from 'react-icons/hi';
import Card from '@/components/ui/Card';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import { useRecargarBilletera } from '@/hooks/useWalletQueries';
import type { RechargeFormData } from '@/types';

const schema = yup.object().shape({
    documento: yup
        .string()
        .required('El documento es obligatorio')
        .matches(/^[0-9]+$/, 'Solo números'),
    celular: yup
        .string()
        .required('El celular es obligatorio')
        .matches(/^[0-9]+$/, 'Solo números'),
    valor: yup
        .number()
        .typeError('Debe ser un número')
        .required('El valor es obligatorio')
        .positive('El valor debe ser mayor a 0')
        .min(1000, 'Monto mínimo: $1.000'),
});

export default function RechargePage() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RechargeFormData>({
        resolver: yupResolver(schema),
    });

    const mutation = useRecargarBilletera();

    const onSubmit = (data: RechargeFormData) => {
        mutation.mutate(data, {
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
                <h1 className="text-2xl font-bold text-white">Recargar Billetera</h1>
                <p className="text-slate-400 mt-1">
                    Agrega saldo a la billetera de un cliente registrado.
                </p>
            </div>

            <Card
                title="Nueva Recarga"
                subtitle="Ingresa los datos del cliente y el monto a recargar"
                icon={<HiOutlineCreditCard className="w-5 h-5" />}
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
                            label="Número de Celular"
                            register={register('celular')}
                            error={errors.celular}
                            placeholder="Ej: 3001234567"
                            icon={<HiOutlinePhone className="w-4 h-4" />}
                        />
                    </div>

                    <FormInput
                        label="Valor a Recargar ($)"
                        register={register('valor')}
                        error={errors.valor}
                        placeholder="Ej: 50000"
                        type="number"
                        icon={<HiOutlineCurrencyDollar className="w-4 h-4" />}
                    />

                    <div className="flex justify-end pt-2">
                        <Button type="submit" isLoading={mutation.isPending}>
                            <HiOutlineCreditCard className="w-4 h-4" />
                            Recargar Billetera
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
