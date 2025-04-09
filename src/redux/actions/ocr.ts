import services from "@src/services/ocr";
import browser from "webextension-polyfill";
import { delToken } from "@src/utils/cookie";
import { Store } from "webext-redux";

export const getQuota = async (queryStore?: any) => {
    const store = queryStore ? queryStore : new Store();
    if (!queryStore) {
        await store.ready();
    }
    const token = store.getState().userInfo.token;
    if (!token) {
        return false;
    }
    let result;
    const params = {
        session_id: token,
    };
    if (queryStore) {
        try {
            result = await services.quota(params);
        } catch {
            result = false;
        }
    } else {
        result = await browser.runtime.sendMessage({
            type: "fetch",
            data: {
                name: "quota",
                value: params,
            },
        });
    }
    if (result) {
        store.dispatch({
            type: "userInfo/LOGIN",
            payload: result,
        });
    } else {
        logout(store);
    }
    return result;
};

export const logout = async (store: any) => {
    try {
        await delToken();
        store.dispatch({
            type: "userInfo/LOGOUT",
        });
    } catch (error) {
        console.info(error);
    }
};
