// formSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface FormState {
  username: string;
  email: string;
  accessToken: string | null;
}

const initialState: FormState = {
  username: "",
  email: "",
  accessToken: null,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      debugger
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.accessToken = action.payload.accessToken;
    },
    clearFormData: (state) => {
      state.username = "";
      state.email = "";
      state.accessToken = null;
    },
  },
});

export const { setFormData, clearFormData } = formSlice.actions;
export default formSlice.reducer;
