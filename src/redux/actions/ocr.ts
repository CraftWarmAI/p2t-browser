import services from "@src/services/ocr";
import browser from "webextension-polyfill";
import { delToken } from "@src/utils/cookie";
import { Store } from "webext-redux";

export const getQuota = async (queryStore?: any) => {
    const store = queryStore
        ? queryStore
        : new Store({
              portName: "p2t",
          });
    if (!queryStore) {
        await store.ready();
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
                await logout(store);
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
};

export const logout = async (store: any) => {
    try {
        await delToken();
        store.dispatch({
            type: "userInfo/LOGOUT",
        });
    } catch (error) {
        console.log(error);
    }
    return true;
};
