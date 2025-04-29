import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  registrationError: null,
  message: null,
  loading: false,
  user: null,
  success: false,
  error: false
};

const registerSlice = createSlice({
  name: "registration",   // ✅ Clean name
  initialState,
  reducers: {
    registerUserSuccessful(state, action) {
      state.user = action.payload;
      state.loading = false;
      state.success = true;
      state.error = null; // ✅ No error
    },
    registerUserFailed(state, action) {
      state.user = null;
      state.loading = false;
      state.success = false;
      state.error = action.payload; // ✅ Store error here
    },
    resetRegisterFlagChange(state) {
      state.success = false;
      state.error = null; // ✅ Clear both
    },
    apiErrorChange(state) {
      state.error = null; // ✅ Just clear error cleanly
    }
  }
});

// Exports
export const {
  registerUserSuccessful,
  registerUserFailed,
  resetRegisterFlagChange,
  apiErrorChange
} = registerSlice.actions;

export default registerSlice.reducer;