
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuthBalance } from '@/hooks/useAuthBalance';

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    useAuthBalance();

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-5xl mx-auto p-4 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
