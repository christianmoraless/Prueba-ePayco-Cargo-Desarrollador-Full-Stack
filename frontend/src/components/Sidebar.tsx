import { NavLink } from 'react-router-dom';
import {
    HiOutlineHome,
    HiOutlineUserAdd,
    HiOutlineCreditCard,
    HiOutlineCash,
    HiOutlineSearch,
} from 'react-icons/hi';

const navItems = [
    { to: '/', label: 'Dashboard', icon: HiOutlineHome },
    { to: '/registro', label: 'Registro', icon: HiOutlineUserAdd },
    { to: '/recarga', label: 'Recarga', icon: HiOutlineCreditCard },
    { to: '/pago', label: 'Pago', icon: HiOutlineCash },
    { to: '/saldo', label: 'Saldo', icon: HiOutlineSearch },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    return (
        <>
            {/* Overlay móvil */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 z-50 h-full w-64 
          bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-700/50">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">eP</span>
                    </div>
                    <span className="text-lg font-bold text-white">
                        e<span className="text-emerald-400">Payco</span> Wallet
                    </span>
                </div>

                {/* Navigation */}
                <nav className="mt-6 px-3 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={onClose}
                            className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200 group
                ${isActive
                                    ? 'bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/5'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                }
              `}
                        >
                            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer del sidebar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50">
                    <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-4">
                        <p className="text-xs text-emerald-400 font-medium">Prueba Técnica</p>
                        <p className="text-xs text-slate-400 mt-1">ePayco Full Stack</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
