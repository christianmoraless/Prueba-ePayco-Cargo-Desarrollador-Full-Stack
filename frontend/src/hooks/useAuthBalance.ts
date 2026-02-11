import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateSaldo } from '@/store/authSlice';
import { consultarSaldo } from '@/api/walletApi';

/**
 * Hook to automatically keep the authenticated user's balance in sync.
 * It fetches the balance periodically and updates the Redux store.
 */
export const useAuthBalance = () => {
    const dispatch = useAppDispatch();
    const { cliente, isAuthenticated } = useAppSelector((state) => state.auth);

    const { data: balanceResponse } = useQuery({
        queryKey: ['authBalance', cliente?.documento],
        queryFn: async () => {
            if (!cliente?.documento || !cliente?.celular) return null;
            return consultarSaldo({
                documento: cliente.documento,
                celular: cliente.celular,
            });
        },
        enabled: isAuthenticated && !!cliente?.documento && !!cliente?.celular,
        refetchInterval: 5000, // Poll every 5 seconds for real-time-ish updates
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        if (balanceResponse?.success && balanceResponse?.data) {
            const currentBalance = cliente?.saldo;
            const newBalance = balanceResponse.data.saldo;

            // Only dispatch if balance actually changed to avoid unnecessary re-renders
            if (currentBalance !== newBalance) {
                dispatch(updateSaldo(newBalance));
            }
        }
    }, [balanceResponse, dispatch, cliente?.saldo]);
};
