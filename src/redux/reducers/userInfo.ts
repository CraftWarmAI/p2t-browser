import { createSlice } from "@reduxjs/toolkit";

const userInfoSlice = createSlice({
    name: "userInfo",
    initialState: { name: "测试" },
    reducers: {
        SET_NAME: (state, action) => {
            state.name = action.payload;
        },
        RELOAD: (state, action) => {
            return action.payload;
        },
    },
});

export default userInfoSlice.reducer;
