import { MemberModel } from "../../_models/member.model";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import memberService from "../../_services/member.service";

interface MemberSearchState {
  items: MemberModel[];
  loading: boolean;
  error: string | null;
}

const initialState: MemberSearchState = {
  items: [],
  loading: false,
  error: null
};

export const searchMemberAction = createAsyncThunk(
  "searchMember",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (query : any, { rejectWithValue }) => {
    try {
      const response = await memberService.searchMember(query);
      return response; 
    } catch (error) {
      return rejectWithValue(error.message || "Lỗi khi tìm kiếm thành viên");
    }
  }
);

const memberSearchSlice = createSlice({
  name: "searchMember",
  initialState,
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(searchMemberAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMemberAction.fulfilled, (state, action: PayloadAction<MemberModel[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(searchMemberAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default memberSearchSlice.reducer;
