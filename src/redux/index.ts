import { configureStore } from "@reduxjs/toolkit";
// import { Store, createWrapStore } from "webext-redux";
import rootReducer from "./reducers";

export const store: any = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// 创建一个 webext-redux 的 Store 实例用于跨浏览器上下文通信
// const proxyStore = new Store();

// 这里的写法有问题，不能直接赋值这些方法
// webext-redux 的 Store 有自己的实现方式，不应该覆盖其原有方法
// 应该使用 wrapStore 方法将 Redux store 连接到 proxyStore

// 正确的用法应该是:
// import { wrapStore } from 'webext-redux';
// createWrapStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
