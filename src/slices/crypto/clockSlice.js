// redux/clockSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    status: "",
    maxTime: ""
};

const clockSlice = createSlice({
    name: 'clock',
    initialState,
    reducers: {
        setClockInStatus: (state, action) => {
            state.status = action.payload.status;
            state.maxTime = action.payload.maxTime;
        }

    }

});

export const { setClockInStatus } = clockSlice.actions;

export default clockSlice.reducer;
