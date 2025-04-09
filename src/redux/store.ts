// import { configureStore } from "@reduxjs/toolkit";
// import rootReducer from "./reducers";

// export const store: any = configureStore({
//     reducer: rootReducer,
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
// });

// export type RootState = ReturnType<typeof rootReducer>;
// export type AppDispatch = typeof store.dispatch;

import { legacy_createStore as createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducers from "./reducers";

export const store = createStore(rootReducers, applyMiddleware(thunkMiddleware));

export default store;
