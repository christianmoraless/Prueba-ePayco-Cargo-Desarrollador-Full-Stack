import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Cliente } from '@/types';

interface AuthState {
    cliente: Cliente | null;
    token: string | null;
    isAuthenticated: boolean;
}

// Recuperar estado del localStorage
const savedToken = localStorage.getItem('epayco_token');
const savedCliente = localStorage.getItem('epayco_cliente');

const initialState: AuthState = {
    cliente: savedCliente ? JSON.parse(savedCliente) : null,
    token: savedToken || null,
    isAuthenticated: !!savedToken,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<{ token: string; cliente: Cliente }>) => {
            state.token = action.payload.token;
            state.cliente = action.payload.cliente;
            state.isAuthenticated = true;
            localStorage.setItem('epayco_token', action.payload.token);
            localStorage.setItem('epayco_cliente', JSON.stringify(action.payload.cliente));
        },
        setCliente: (state, action: PayloadAction<Cliente>) => {
            state.cliente = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem('epayco_cliente', JSON.stringify(action.payload));
        },
        updateSaldo: (state, action: PayloadAction<number>) => {
            if (state.cliente) {
                state.cliente.saldo = action.payload;
                localStorage.setItem('epayco_cliente', JSON.stringify(state.cliente));
            }
        },
        logout: (state) => {
            state.cliente = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('epayco_token');
            localStorage.removeItem('epayco_cliente');
        },
    },
});

export const { setAuth, setCliente, updateSaldo, logout } = authSlice.actions;
export default authSlice.reducer;
