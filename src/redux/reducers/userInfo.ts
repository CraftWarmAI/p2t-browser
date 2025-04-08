import { createSlice } from "@reduxjs/toolkit";

const initQuota = {
    pro_quota: 0,
    plus_quota: 0,
    pro_expiry_date: null,
    plus_expiry_date: null,
};

const initUser = { email: "", id: "" };

const userInfoSlice = createSlice({
    name: "userInfo",
    initialState: {
        token: "",
        logined: false,
        user: { ...initUser },
        quota: { ...initQuota },
    },
    reducers: {
        LOGIN: (state, action) => {
            const { pro_quota, plus_quota, pro_expiry_date, plus_expiry_date, user } =
                action.payload;
            state.quota = {
                pro_quota,
                plus_quota,
                pro_expiry_date,
                plus_expiry_date,
            };
            state.user = user;
            state.logined = true;
        },
        LOGOUT: (state) => {
            state.token = "";
            state.logined = false;
            state.quota = { ...initQuota };
            state.user = { ...initUser };
        },
        a: (state, action) => {
            state.logined = action.payload;
        },
        SET_TOKEN: (state, action) => {
            state.token = action.payload;
        },
        RELOAD: (state, action) => {
            return action.payload;
        },
    },
});

export default userInfoSlice.reducer;
