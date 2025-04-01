import { createSlice } from "@reduxjs/toolkit";

const userInfoSlice = createSlice({
    name: "userInfo",
    initialState: { name: "测试", user_id: "1", logined: true },
    reducers: {
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
