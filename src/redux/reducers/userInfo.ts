import { createSlice } from "@reduxjs/toolkit";

const userInfoSlice = createSlice({
    name: "userInfo",
    initialState: {
        initialize: false,
        name: "测试",
        quota: {
            plus_quota: 0,
        },
        logined: true,
    },
    reducers: {
        SET_INITIALIZE: (state) => {
            state.initialize = true;
        },
        SET_LOGINED: (state, action) => {
            state.logined = action.payload;
        },
        SET_NAME: (state, action) => {
            state.name = action.payload;
        },
        RELOAD: (state, action) => {
            return action.payload;
        },
    },
});

export default userInfoSlice.reducer;
