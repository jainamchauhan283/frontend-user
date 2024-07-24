// Ex. Libraries
import { createSlice } from "@reduxjs/toolkit";
import { User } from "../interfaces/models/User";

interface FormState {
  user: User | null;
  payment: any;
  accessToken: string | null;
}

const initialState: FormState = {
  user: null,
  payment: null,
  accessToken: null,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.user = action.payload;
    },
    setPaymentData: (state, action) => {
      state.payment = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    logoutFormData: (state) => {
      state = initialState;
    },
  },
});

export const { setUserData, setAccessToken, setPaymentData, logoutFormData } =
  formSlice.actions;
export default formSlice.reducer;
