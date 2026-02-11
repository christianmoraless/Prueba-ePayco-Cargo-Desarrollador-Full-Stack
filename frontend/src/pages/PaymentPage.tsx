import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    HiOutlineCash,
    HiOutlineIdentification,
    HiOutlinePhone,
    HiOutlineCurrencyDollar,
    HiOutlineShieldCheck,
    HiOutlineKey,
} from 'react-icons/hi';
import Card from '@/components/ui/Card';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import { useSolicitarPago, useConfirmarPago } from '@/hooks/useWalletQueries';
import { useAppSelector, useAppDispatch } from '@/store';
import { clearPaymentSession } from '@/store/walletSlice';
import type { PaymentRequestFormData, PaymentConfirmFormData } from '@/types';

const paymentSchema = yup.object().shape({
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
        .min(100, 'Monto mínimo: $100'),
});

const confirmSchema = yup.object().shape({
    sessionId: yup.string().required('El ID de sesión es obligatorio'),
    token: yup
        .string()
        .required('El token es obligatorio')
        .length(6, 'El token debe tener 6 dígitos')
        .matches(/^[0-9]+$/, 'Solo números'),
});

export default function PaymentPage() {
    const [step, setStep] = useState<'request' | 'confirm'>('request');
    const { sessionId, pendingAmount } = useAppSelector((state) => state.wallet);
    const dispatch = useAppDispatch();

    const paymentForm = useForm<PaymentRequestFormData>({
        resolver: yupResolver(paymentSchema),
    });

    const confirmForm = useForm<PaymentConfirmFormData>({
        resolver: yupResolver(confirmSchema),
    });

    const solicitarMutation = useSolicitarPago();
    const confirmarMutation = useConfirmarPago();

    const onRequestPayment = (data: PaymentRequestFormData) => {
        solicitarMutation.mutate(data, {
            onSuccess: (response) => {
                if (response.success && response.data) {
                    setStep('confirm');
                    confirmForm.setValue('sessionId', response.data.sessionId);
                }
            },
        });
    };

    const onConfirmPayment = (data: PaymentConfirmFormData) => {
        confirmarMutation.mutate(data, {
            onSuccess: (response) => {
                if (response.success) {
                    setStep('request');
                    paymentForm.reset();
                    confirmForm.reset();
                }
            },
        });
    };

    const handleCancel = () => {
        setStep('request');
        dispatch(clearPaymentSession());
        confirmForm.reset();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Realizar Pago</h1>
                <p className="text-slate-400 mt-1">
                    Realiza un pago con confirmación mediante token OTP.
                </p>
            </div>

            {/* Steps indicator */}
            <div className="flex items-center gap-3">
                <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${step === 'request'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800/50 text-slate-500 border border-slate-700/50'
                        }`}
                >
                    <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-xs">
                        1
                    </span>
                    Solicitar Pago
                </div>
                <div className="w-8 h-px bg-slate-700" />
                <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${step === 'confirm'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800/50 text-slate-500 border border-slate-700/50'
                        }`}
                >
                    <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-xs">
                        2
                    </span>
                    Confirmar Pago
                </div>
            </div>

            {/* Step 1: Request Payment */}
            {step === 'request' && (
                <Card
                    title="Solicitar Pago"
                    subtitle="Ingresa los datos para generar el token de confirmación"
                    icon={<HiOutlineCash className="w-5 h-5" />}
                >
                    <form
                        onSubmit={paymentForm.handleSubmit(onRequestPayment)}
                        className="space-y-5"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormInput
                                label="Documento de Identidad"
                                register={paymentForm.register('documento')}
                                error={paymentForm.formState.errors.documento}
                                placeholder="Ej: 1234567890"
                                icon={<HiOutlineIdentification className="w-4 h-4" />}
                            />
                            <FormInput
                                label="Número de Celular"
                                register={paymentForm.register('celular')}
                                error={paymentForm.formState.errors.celular}
                                placeholder="Ej: 3001234567"
                                icon={<HiOutlinePhone className="w-4 h-4" />}
                            />
                        </div>

                        <FormInput
                            label="Valor de la Compra ($)"
                            register={paymentForm.register('valor')}
                            error={paymentForm.formState.errors.valor}
                            placeholder="Ej: 25000"
                            type="number"
                            icon={<HiOutlineCurrencyDollar className="w-4 h-4" />}
                        />

                        <div className="flex justify-end pt-2">
                            <Button type="submit" isLoading={solicitarMutation.isPending}>
                                <HiOutlineCash className="w-4 h-4" />
                                Solicitar Pago
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Step 2: Confirm Payment */}
            {step === 'confirm' && (
                <Card
                    title="Confirmar Pago"
                    subtitle="Ingresa el token de 6 dígitos enviado a tu email"
                    icon={<HiOutlineShieldCheck className="w-5 h-5" />}
                >
                    {/* Payment info */}
                    {sessionId && (
                        <div className="mb-6 rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-400">ID de Sesión</p>
                                    <p className="text-sm font-mono text-emerald-400 mt-0.5">
                                        {sessionId}
                                    </p>
                                </div>
                                {pendingAmount && (
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400">Monto</p>
                                        <p className="text-lg font-bold text-white">
                                            ${pendingAmount.toLocaleString('es-CO')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <form
                        onSubmit={confirmForm.handleSubmit(onConfirmPayment)}
                        className="space-y-5"
                    >
                        <input type="hidden" {...confirmForm.register('sessionId')} />

                        <FormInput
                            label="Token de Confirmación (6 dígitos)"
                            register={confirmForm.register('token')}
                            error={confirmForm.formState.errors.token}
                            placeholder="Ej: 123456"
                            maxLength={6}
                            icon={<HiOutlineKey className="w-4 h-4" />}
                        />

                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="secondary" onClick={handleCancel}>
                                Cancelar
                            </Button>
                            <Button type="submit" isLoading={confirmarMutation.isPending}>
                                <HiOutlineShieldCheck className="w-4 h-4" />
                                Confirmar Pago
                            </Button>
                        </div>
                    </form>
                </Card>
            )}
        </div>
    );
}
