import { useQuery } from '@tanstack/react-query';
import { getTransactions, getRecentTransactions } from '@/api/walletApi';
import type { ApiResponse, Transaction } from '@/types';

// Hook para obtener el historial completo
export const useTransactions = () => {
    return useQuery<ApiResponse<Transaction[]>>({
        queryKey: ['transactions'],
        queryFn: getTransactions,
        staleTime: 1000 * 60, // 1 minuto de cache
    });
};

// Hook para obtener las transacciones recientes (widget)
export const useRecentTransactions = () => {
    return useQuery<ApiResponse<Transaction[]>>({
        queryKey: ['transactions', 'recent'],
        queryFn: getRecentTransactions,
        staleTime: 1000 * 30, // 30 segundos de cache
        refetchInterval: 10000, // Refrescar cada 10s para ver cambios en tiempo real
    });
};
