import axiosClient from './axiosClient';
import type {
    ApiResponse,
    AuthResponse,
    LoginFormData,
    RegisterFormData,
    ForgotPasswordFormData,
    ResetPasswordFormData,
    RechargeFormData,
    PaymentRequestFormData,
    PaymentConfirmFormData,
    BalanceQueryFormData,
    Cliente,
    PaymentSessionResponse,
    BalanceResponse,
} from '@/types';

// ── Auth ──
export const authRegister = async (
    data: RegisterFormData
): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosClient.post<ApiResponse<AuthResponse>>(
        '/auth/register',
        data
    );
    return response.data;
};

export const authLogin = async (
    data: LoginFormData
): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosClient.post<ApiResponse<AuthResponse>>(
        '/auth/login',
        data
    );
    return response.data;
};

export const authForgotPassword = async (
    data: ForgotPasswordFormData
): Promise<ApiResponse<null>> => {
    const response = await axiosClient.post<ApiResponse<null>>(
        '/auth/forgot-password',
        data
    );
    return response.data;
};

export const authResetPassword = async (
    data: ResetPasswordFormData
): Promise<ApiResponse<null>> => {
    const response = await axiosClient.post<ApiResponse<null>>(
        '/auth/reset-password',
        data
    );
    return response.data;
};

export const authGetProfile = async (): Promise<ApiResponse<Cliente>> => {
    const response = await axiosClient.get<ApiResponse<Cliente>>('/auth/profile');
    return response.data;
};

// ── Registro de clientes (legacy) ──
export const registrarCliente = async (
    data: RegisterFormData
): Promise<ApiResponse<Cliente>> => {
    const response = await axiosClient.post<ApiResponse<Cliente>>(
        '/registroCliente',
        data
    );
    return response.data;
};

// ── Recarga de billetera ──
export const recargarBilletera = async (
    data: RechargeFormData
): Promise<ApiResponse<Cliente>> => {
    const response = await axiosClient.post<ApiResponse<Cliente>>(
        '/recargarBilletera',
        data
    );
    return response.data;
};

// ── Solicitar pago ──
export const solicitarPago = async (
    data: PaymentRequestFormData
): Promise<ApiResponse<PaymentSessionResponse>> => {
    const response = await axiosClient.post<ApiResponse<PaymentSessionResponse>>(
        '/solicitarPago',
        data
    );
    return response.data;
};

// ── Confirmar pago ──
export const confirmarPago = async (
    data: PaymentConfirmFormData
): Promise<ApiResponse<null>> => {
    const response = await axiosClient.post<ApiResponse<null>>(
        '/confirmarPago',
        data
    );
    return response.data;
};

// ── Consultar saldo ──
export const consultarSaldo = async (
    data: BalanceQueryFormData
): Promise<ApiResponse<BalanceResponse>> => {
    const response = await axiosClient.post<ApiResponse<BalanceResponse>>(
        '/consultarSaldo',
        data
    );
    return response.data;
};
