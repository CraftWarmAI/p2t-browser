import services from "@src/services/ocr";
import browser from "webextension-polyfill";
import { delToken } from "@src/utils/cookie";

export const getQuota = (store: any) => {
    return async (isBgPage = false) => {
        const token = store.getState().userInfo.token;
        if (!token) {
            return false;
        }
        let result;
        const params = {
            session_id: token,
        };
        if (isBgPage) {
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
        console.log("=======result========");
        console.log(result);
        if (result) {
            store.dispatch({
                type: "userInfo/LOGIN",
                payload: result,
            });
            await await browser.runtime.sendMessage({
                type: "openPopup",
            });
        } else {
            logout(store);
        }
        return result;
    };
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
