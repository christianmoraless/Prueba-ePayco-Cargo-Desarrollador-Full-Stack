import { HiOutlineMenuAlt2, HiOutlineLogout } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { logout } from '@/store/authSlice';

interface NavbarProps {
    onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
    const { cliente, isAuthenticated } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-30 h-16 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
                {/* Hamburger (mobile) */}
                <button
                    onClick={onToggleSidebar}
                    className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                    <HiOutlineMenuAlt2 className="w-6 h-6" />
                </button>

                {/* Título */}
                <div className="hidden lg:block">
                    <h1 className="text-sm font-medium text-slate-400">
                        Billetera Digital
                    </h1>
                </div>

                {/* Info del cliente + Logout */}
                <div className="flex items-center gap-4">
                    {isAuthenticated && cliente ? (
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-white">
                                    {cliente.nombres}
                                </p>
                                <p className="text-xs text-emerald-400">
                                    Saldo: ${cliente.saldo?.toLocaleString('es-CO') || '0'}
                                </p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {cliente.nombres?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                title="Cerrar sesión"
                            >
                                <HiOutlineLogout className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50">
                            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            <span className="text-xs text-slate-400">Sin sesión activa</span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
