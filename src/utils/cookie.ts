import browser from "webextension-polyfill";

export const getToken = async () => {
    const value = await browser.storage.local.get("token");
    return value?.token || null;
};

export const delToken = async () => {
    await browser.storage.local.remove("token");
    return true;
};
