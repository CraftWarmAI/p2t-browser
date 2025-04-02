import browser from "webextension-polyfill";

export const getQuota = async () => {
    const result = await browser.runtime.sendMessage({
        type: "fetch",
        data: {
            name: "quota",
        },
    });
    console.log("=======result========");
    return result;
};
