import { legacy_createStore as createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducers from "./reducers";

export const store = createStore(rootReducers, applyMiddleware(thunkMiddleware));

export default store;
