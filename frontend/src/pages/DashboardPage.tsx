import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { useRecentTransactions } from '@/hooks/useTransactions';
import { TransactionType } from '@/types';
import {
    HiOutlineUserAdd,
    HiOutlineCreditCard,
    HiOutlineCash,
    HiOutlineSearch,
} from 'react-icons/hi';

const features = [
    {
        to: '/registro',
        title: 'Registro de Clientes',
        description: 'Registra nuevos clientes con documento, nombre, email y celular.',
        icon: HiOutlineUserAdd,
        gradient: 'from-blue-500 to-indigo-600',
        shadow: 'shadow-blue-500/20',
    },
    {
        to: '/recarga',
        title: 'Recargar Billetera',
        description: 'Incrementa el saldo de la billetera con el monto deseado.',
        icon: HiOutlineCreditCard,
        gradient: 'from-emerald-500 to-teal-600',
        shadow: 'shadow-emerald-500/20',
    },
    {
        to: '/pago',
        title: 'Realizar Pago',
        description: 'Realiza pagos con confirmación mediante token OTP enviado por email.',
        icon: HiOutlineCash,
        gradient: 'from-amber-500 to-orange-600',
        shadow: 'shadow-amber-500/20',
    },
    {
        to: '/saldo',
        title: 'Consultar Saldo',
        description: 'Verifica el saldo disponible en tu billetera digital.',
        icon: HiOutlineSearch,
        gradient: 'from-purple-500 to-violet-600',
        shadow: 'shadow-purple-500/20',
    },
];

export default function DashboardPage() {
    const { cliente, isAuthenticated } = useAppSelector((state) => state.auth);
    const { data: recentTxResponse, isLoading: isLoadingTx } = useRecentTransactions();
    const recentTransactions = recentTxResponse?.data || [];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Bienvenido{isAuthenticated && cliente ? `, ${cliente.nombres}` : ''}
                </h1>
                <p className="text-slate-400 mt-2">
                    Gestiona tu billetera digital de forma rápida y segura.
                </p>
            </div>

            {/* Balance Card */}
            {isAuthenticated && cliente && (
                <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-6 shadow-xl shadow-emerald-500/20">
                    <p className="text-emerald-100 text-sm font-medium">Saldo disponible</p>
                    <p className="text-4xl font-bold text-white mt-2">
                        ${cliente.saldo?.toLocaleString('es-CO') || '0'}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse" />
                        <p className="text-emerald-100 text-xs">
                            Doc: {cliente.documento} • Tel: {cliente.celular}
                        </p>
                    </div>
                </div>
            )}

            {/* Recent Transactions Widget */}
            {isAuthenticated && (
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Movimientos Recientes</h2>
                        <Link to="/historial" className="text-sm text-emerald-400 hover:text-emerald-300">
                            Ver todo
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {isLoadingTx ? (
                            <p className="text-slate-500 text-sm">Cargando...</p>
                        ) : recentTransactions.length === 0 ? (
                            <p className="text-slate-500 text-sm">No tienes movimientos recientes.</p>
                        ) : (
                            recentTransactions.map((tx) => (
                                <div key={tx._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${tx.type === TransactionType.PAGO_ENVIADO ? 'bg-red-400' : 'bg-emerald-400'}`} />
                                        <div>
                                            <p className="text-sm text-white font-medium">
                                                {tx.type === TransactionType.RECARGA ? 'Recarga' :
                                                    tx.type === TransactionType.PAGO_ENVIADO ? 'Pago Enviado' : 'Pago Recibido'}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {new Date(tx.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <p className={`font-mono font-bold ${tx.type === TransactionType.PAGO_ENVIADO ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {tx.type === TransactionType.PAGO_ENVIADO ? '-' : '+'}${tx.amount.toLocaleString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature) => (
                    <Link
                        key={feature.to}
                        to={feature.to}
                        className={`
              group rounded-2xl border border-slate-700/50 bg-slate-800/30
              backdrop-blur-xl p-6 transition-all duration-300
              hover:border-slate-600/50 hover:bg-slate-800/50 hover:shadow-xl
              hover:${feature.shadow} hover:-translate-y-0.5
            `}
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className={`
                  flex items-center justify-center w-12 h-12 rounded-xl
                  bg-gradient-to-br ${feature.gradient} shadow-lg ${feature.shadow}
                  group-hover:scale-110 transition-transform duration-300
                `}
                            >
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-semibold group-hover:text-emerald-400 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-slate-400 mt-1">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Info box */}
            {!isAuthenticated && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                    <p className="text-amber-400 text-sm">
                        💡 Comienza registrando un cliente para acceder a todas las funcionalidades
                        de la billetera digital.
                    </p>
                </div>
            )}
        </div>
    );
}
