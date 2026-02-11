import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    HiOutlineSearch,
    HiOutlineIdentification,
    HiOutlinePhone,
} from 'react-icons/hi';
import Card from '@/components/ui/Card';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import { useConsultarSaldoMutation } from '@/hooks/useWalletQueries';
import type { BalanceQueryFormData, BalanceResponse } from '@/types';
import { useState } from 'react';

const schema = yup.object().shape({
    documento: yup
        .string()
        .required('El documento es obligatorio')
        .matches(/^[0-9]+$/, 'Solo números'),
    celular: yup
        .string()
        .required('El celular es obligatorio')
        .matches(/^[0-9]+$/, 'Solo números'),
});

export default function BalancePage() {
    const [balanceData, setBalanceData] = useState<BalanceResponse | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<BalanceQueryFormData>({
        resolver: yupResolver(schema),
    });

    const mutation = useConsultarSaldoMutation();

    const onSubmit = (data: BalanceQueryFormData) => {
        mutation.mutate(data, {
            onSuccess: (response) => {
                if (response.success && response.data) {
                    setBalanceData(response.data);
                }
            },
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Consultar Saldo</h1>
                <p className="text-slate-400 mt-1">
                    Verifica el saldo disponible en la billetera de un cliente.
                </p>
            </div>

            <Card
                title="Consulta de Saldo"
                subtitle="Ingresa documento y celular del cliente"
                icon={<HiOutlineSearch className="w-5 h-5" />}
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

                    <div className="flex justify-end pt-2">
                        <Button type="submit" isLoading={mutation.isPending}>
                            <HiOutlineSearch className="w-4 h-4" />
                            Consultar Saldo
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Balance Result */}
            {balanceData && (
                <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl p-8 text-center">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
                        <span className="text-2xl font-bold text-white">
                            {balanceData.nombres?.charAt(0)?.toUpperCase() || '$'}
                        </span>
                    </div>
                    <p className="text-slate-400 text-sm">{balanceData.nombres}</p>
                    <p className="text-slate-500 text-xs mt-1">Doc: {balanceData.documento}</p>
                    <div className="mt-4">
                        <p className="text-xs text-emerald-400 font-medium uppercase tracking-wider">
                            Saldo Disponible
                        </p>
                        <p className="text-5xl font-bold text-white mt-2">
                            ${balanceData.saldo?.toLocaleString('es-CO') || '0'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
