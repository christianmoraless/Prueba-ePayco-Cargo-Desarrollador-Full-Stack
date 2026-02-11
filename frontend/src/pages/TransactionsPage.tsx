import { useTransactions } from '@/hooks/useTransactions';
import { HiOutlineArrowDown, HiOutlineArrowUp, HiOutlineRefresh } from 'react-icons/hi';
import Card from '@/components/ui/Card';
import { Transaction, TransactionType } from '@/types';

export default function TransactionsPage() {
    const { data: response, isLoading, isError, refetch } = useTransactions();
    const transactions = response?.data || [];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-CO', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    const getIcon = (type: TransactionType) => {
        switch (type) {
            case TransactionType.RECARGA:
            case TransactionType.PAGO_RECIBIDO:
                return <HiOutlineArrowDown className="w-5 h-5 text-emerald-400" />;
            case TransactionType.PAGO_ENVIADO:
                return <HiOutlineArrowUp className="w-5 h-5 text-red-400" />;
            default:
                return <HiOutlineRefresh className="w-5 h-5 text-slate-400" />;
        }
    };

    const getLabel = (transaction: Transaction) => {
        switch (transaction.type) {
            case TransactionType.RECARGA:
                return 'Recarga de Billetera';
            case TransactionType.PAGO_RECIBIDO:
                return `Pago Recibido de ${transaction.relatedUser || 'Desconocido'}`;
            case TransactionType.PAGO_ENVIADO:
                return `Pago Enviado a ${transaction.relatedUser || 'Desconocido'}`;
            default:
                return 'Transacción';
        }
    };

    const getAmountColor = (type: TransactionType) => {
        if (type === TransactionType.PAGO_ENVIADO) return 'text-red-400';
        return 'text-emerald-400';
    };

    const getAmountPrefix = (type: TransactionType) => {
        if (type === TransactionType.PAGO_ENVIADO) return '-';
        return '+';
    };

    if (isError) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-400 mb-4">Error al cargar el historial.</p>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Historial de Transacciones</h1>
                    <p className="text-slate-400 mt-1">
                        Consulta todos tus movimientos detallados
                    </p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                    <HiOutlineRefresh className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <Card className="overflow-hidden p-0 sm:p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-700/50 bg-slate-800/30 text-xs uppercase text-slate-400">
                                <th className="px-6 py-4 font-semibold">Tipo</th>
                                <th className="px-6 py-4 font-semibold">Referencia</th>
                                <th className="px-6 py-4 font-semibold">Fecha</th>
                                <th className="px-6 py-4 font-semibold text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                        Cargando movimientos...
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                        No se encontraron transacciones.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-slate-800/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg bg-slate-800 ${getAmountColor(tx.type).replace('text-', 'bg-').replace('400', '500/10')}`}>
                                                    {getIcon(tx.type)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{getLabel(tx)}</p>
                                                    <p className="text-xs text-slate-500">{tx.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                                            {tx.referenceId.substring(0, 8)}...
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400">
                                            {formatDate(tx.createdAt)}
                                        </td>
                                        <td className={`px-6 py-4 text-right font-bold ${getAmountColor(tx.type)}`}>
                                            {getAmountPrefix(tx.type)}${tx.amount.toLocaleString('es-CO')}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
