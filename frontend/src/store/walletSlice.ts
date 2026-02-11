import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface WalletState {
    sessionId: string | null;
    pendingAmount: number | null;
}

const initialState: WalletState = {
    sessionId: null,
    pendingAmount: null,
};

const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        setPaymentSession: (
            state,
            action: PayloadAction<{ sessionId: string; amount: number }>
        ) => {
            state.sessionId = action.payload.sessionId;
            state.pendingAmount = action.payload.amount;
        },
        clearPaymentSession: (state) => {
            state.sessionId = null;
            state.pendingAmount = null;
        },
    },
});

export const { setPaymentSession, clearPaymentSession } = walletSlice.actions;
export default walletSlice.reducer;
