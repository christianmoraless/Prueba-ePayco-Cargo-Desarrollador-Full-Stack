import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
    registrarCliente,
    recargarBilletera,
    solicitarPago,
    confirmarPago,
    consultarSaldo,
} from '@/api/walletApi';
import { useAppDispatch } from '@/store';
import { setCliente, updateSaldo } from '@/store/authSlice';
import { setPaymentSession, clearPaymentSession } from '@/store/walletSlice';
import type {
    ApiResponse,
    PaymentRequestFormData,
    BalanceQueryFormData,
    BalanceResponse,
} from '@/types';

// ── Registro de cliente ──
export const useRegistrarCliente = () => {
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: registrarCliente,
        onSuccess: (response) => {
            if (response.success && response.data) {
                dispatch(setCliente(response.data));
                toast.success(response.message || 'Cliente registrado exitosamente');
            }
        },
        onError: (error: ApiResponse) => {
            toast.error(error.message || 'Error al registrar cliente');
        },
    });
};

// ── Recarga de billetera ──
export const useRecargarBilletera = () => {
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: recargarBilletera,
        onSuccess: (response) => {
            if (response.success && response.data) {
                dispatch(updateSaldo(response.data.saldo));
                toast.success(response.message || 'Recarga exitosa');
            }
        },
        onError: (error: ApiResponse) => {
            toast.error(error.message || 'Error al recargar billetera');
        },
    });
};

// ── Solicitar pago ──
export const useSolicitarPago = () => {
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: (data: PaymentRequestFormData) => solicitarPago(data),
        onSuccess: (response, variables) => {
            if (response.success && response.data) {
                dispatch(
                    setPaymentSession({
                        sessionId: response.data.sessionId,
                        amount: variables.valor,
                    })
                );
                toast.success(
                    response.message || 'Token enviado a su correo electrónico'
                );
            }
        },
        onError: (error: ApiResponse) => {
            toast.error(error.message || 'Error al solicitar pago');
        },
    });
};

// ── Confirmar pago ──
export const useConfirmarPago = () => {
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: confirmarPago,
        onSuccess: (response) => {
            if (response.success) {
                dispatch(clearPaymentSession());
                toast.success(response.message || 'Pago confirmado exitosamente');
            }
        },
        onError: (error: ApiResponse) => {
            toast.error(error.message || 'Error al confirmar pago');
        },
    });
};

// ── Consultar saldo ──
export const useConsultarSaldo = (data: BalanceQueryFormData | null) => {
    return useQuery<ApiResponse<BalanceResponse>>({
        queryKey: ['saldo', data?.documento, data?.celular],
        queryFn: () => consultarSaldo(data!),
        enabled: !!data?.documento && !!data?.celular,
        retry: false,
        staleTime: 30000,
    });
};

// ── Consultar saldo como mutation (para usar con botón) ──
export const useConsultarSaldoMutation = () => {
    return useMutation({
        mutationFn: consultarSaldo,
        onError: (error: ApiResponse) => {
            toast.error(error.message || 'Error al consultar saldo');
        },
    });
};
