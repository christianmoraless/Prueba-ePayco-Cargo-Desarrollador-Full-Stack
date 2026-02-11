import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';
import AuthRegisterPage from '@/pages/AuthRegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import DashboardPage from '@/pages/DashboardPage';
import RegisterPage from '@/pages/RegisterPage';
import RechargePage from '@/pages/RechargePage';
import PaymentPage from '@/pages/PaymentPage';
import BalancePage from '@/pages/BalancePage';
import TransactionsPage from '@/pages/TransactionsPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Auth routes (públicas) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/auth/register" element={<AuthRegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* App routes (protegidas) */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/registro" element={<RegisterPage />} />
                        <Route path="/recarga" element={<RechargePage />} />
                        <Route path="/pago" element={<PaymentPage />} />
                        <Route path="/saldo" element={<BalancePage />} />
                        <Route path="/historial" element={<TransactionsPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
