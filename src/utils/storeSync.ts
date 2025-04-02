import browser from "webextension-polyfill";
import { storeSyncList } from "@src/config/global";

export const storeSync = async (store: any) => {
    try {
        const newValue: any = await browser.storage.local.get("reduxState");
        if (newValue.reduxState) {
            const newState = JSON.parse(newValue.reduxState);
            for (const key in newState) {
                if (storeSyncList.includes(key) && newState.hasOwnProperty(key)) {
                    store.dispatch({
                        type: `${key}/RELOAD`,
                        payload: newState[key],
                    });
                }
            }
        }
        return Promise.resolve();
    } catch (error) {
        return Promise.reject();
    }
};

export const getNeedStoreData = (store: any) => {
    const newData: any = {};
    const state = store.getState();
    storeSyncList.forEach((item) => {
        newData[item] = state[item];
    });
    return JSON.stringify(newData);
};
