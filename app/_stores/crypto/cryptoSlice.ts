import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { CryptoModel } from "../../_models/crypto.model";
import cryptoService from "../../_services/crypto.service";

interface CryptoState {
    items: CryptoModel[];
    loading: boolean;
    error: string | null;
}

const initialState: CryptoState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchCryptoAction = createAsyncThunk(
    "crypto/fetchCrypto",
    async (query: { currency: string; per_page: number; page: number }, { rejectWithValue }) => {
        try {
            return await cryptoService.searchCryto(query);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const cryptoSlice = createSlice({
    name: "crypto",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCryptoAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCryptoAction.fulfilled, (state, action: PayloadAction<CryptoModel[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCryptoAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default cryptoSlice.reducer;
