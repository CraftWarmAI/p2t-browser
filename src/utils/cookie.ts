import browser from "webextension-polyfill";

export const getToken = async () => {
    const value = await browser.storage.local.get("token");
    return value?.token || null;
};

export const setToken = async (value: string) => {
    await browser.storage.local.set({
        token: value,
    });
    return true;
};

export const delToken = async () => {
    await browser.storage.local.remove("token");
    return true;
};

export const delReduxState = async () => {
    await browser.storage.local.remove("reduxState");
    return true;
};
