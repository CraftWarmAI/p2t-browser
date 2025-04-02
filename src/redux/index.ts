import _ from "lodash";
import browser from "webextension-polyfill";
import { storeSyncList } from "@src/config/global";
import { getNeedStoreData } from "@src/utils/storeSync";
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducers from "./reducers";

const store = createStore(rootReducers, applyMiddleware(thunkMiddleware));
let historyValue: any;

store.subscribe(
    _.debounce(() => {
        const newValue = getNeedStoreData(store);
        if (historyValue !== newValue) {
            console.log("写入");
            if (!historyValue) {
                historyValue = newValue;
            }
            browser.storage.local.set({ reduxState: newValue });
        }
    }, 20),
);

browser.storage.local.onChanged.addListener((changes: any) => {
    const { newValue } = changes.reduxState;
    historyValue = newValue;
    const oldValue = getNeedStoreData(store);
    if (newValue !== oldValue) {
        console.log("重写");
        const newState = JSON.parse(newValue);
        for (const key in newState) {
            if (storeSyncList.includes(key) && newState.hasOwnProperty(key)) {
                store.dispatch({
                    type: `${key}/RELOAD`,
                    payload: newState[key],
                });
            }
        }
    }
});

export default store;
