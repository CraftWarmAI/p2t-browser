import services from "@src/services/ocr";
import browser from "webextension-polyfill";
import { delToken } from "@src/utils/cookie";
import { Store } from "webext-redux";
import { createStore } from "@src/utils/store";

export const getQuota = async (queryStore?: Store) => {
    try {
        let store: Store;
        if (queryStore) {
            store = queryStore;
        } else {
            store = await createStore(100);
        }
        const token = store.getState().userInfo.token;
        if (!token) {
            return { ok: false };
        }
        let result;
        const params = {
            session_id: token,
        };
        if (queryStore) {
            try {
                result = await services.quota(params);
            } catch (error: any) {
                if ([401, 422].includes(error?.status)) {
                    await logout();
                }
                result = error;
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
        if (result?.ok !== false) {
            store.dispatch({
                type: "userInfo/LOGIN",
                payload: result,
            });
        }
        return result;
    } catch {
        return { ok: false };
    }
};

export const logout = async (bgStore?: Store) => {
    try {
        let store: Store;
        if (bgStore) {
            store = bgStore;
        } else {
            store = await createStore(100);
        }
        await delToken();
        store.dispatch({
            type: "userInfo/LOGOUT",
        });
    } catch (error) {
        return Promise.reject(error);
    }
    return true;
};
