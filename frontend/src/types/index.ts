// ── Respuesta uniforme del API ──
export interface ApiResponse<T = unknown> {
    success: boolean;
    cod: number;
    message: string;
    data: T | null;
}

// ── Cliente / Wallet ──
export interface Cliente {
    _id?: string;
    documento: string;
    nombres: string;
    email: string;
    celular: string;
    saldo: number;
    createdAt?: string;
}

// ── Auth ──
export interface AuthResponse {
    token: string;
    cliente: Cliente;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    documento: string;
    nombres: string;
    email: string;
    celular: string;
    password: string;
}

export interface ForgotPasswordFormData {
    email: string;
}

export interface ResetPasswordFormData {
    token: string;
    newPassword: string;
}

// ── Wallet ──
export interface RechargeFormData {
    documento: string;
    celular: string;
    valor: number;
}

export interface PaymentRequestFormData {
    documento: string;
    celular: string;
    valor: number;
}

export interface PaymentConfirmFormData {
    sessionId: string;
    token: string;
}

export interface BalanceQueryFormData {
    documento: string;
    celular: string;
}

// ── Respuestas específicas ──
export interface PaymentSessionResponse {
    sessionId: string;
    message: string;
}

export interface BalanceResponse {
    documento: string;
    nombres: string;
    saldo: number;
}
