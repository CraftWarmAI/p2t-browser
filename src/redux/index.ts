import browser from "webextension-polyfill";
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducers from "./reducers";

const store = createStore(rootReducers, applyMiddleware(thunkMiddleware));

let historyValue: any;

store.subscribe(() => {
    if (historyValue !== JSON.stringify(store.getState())) {
        browser.storage.local.set({ reduxState: JSON.stringify(store.getState()) });
    }
});

browser.storage.local.onChanged.addListener((changes: any) => {
    const { newValue } = changes.reduxState;
    historyValue = newValue;
    if (newValue !== JSON.stringify(store.getState())) {
        const newState = JSON.parse(newValue);
        for (const key in newState) {
            if (newState.hasOwnProperty(key)) {
                store.dispatch({
                    type: `${key}/RELOAD`,
                    payload: newState[key],
                });
            }
        }
    }
});

export default store;
