import browser from "webextension-polyfill";
import services from "@src/services/ocr";
import { getQuota } from "@src/redux/actions/ocr";
import { getToken } from "@src/utils/cookie";
import { store } from "@src/redux/store";
import { wrapStore } from "webext-redux";
import { base64ToFile } from "@src/utils/fileConversion";

try {
    wrapStore(store);
} catch (error) {
    console.log(error);
}
init();

browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        const timer = setTimeout(() => {
            browser.action.openPopup();
            clearTimeout(timer);
        }, 2000);
        loadContentScripts();
    } else if (details.reason === "update") {
        loadContentScripts();
    }
});

try {
    browser.runtime.onMessage.addListener(async (params: SendMessage) => {
        if (params.type === "reload") {
            return browser.runtime.reload();
        } else if (params.type === "captureScreenshot") {
            return captureScreenshot();
        } else if (params.type === "openPopup") {
            return await browser.action.openPopup();
        } else if (params.type === "commandsGetAll") {
            return browser.commands.getAll();
        } else if (params.type === "commandsUpdate") {
            return browser.commands.update(params.data);
        } else if (params.type === "fetch") {
            const { name, value = {}, type } = params.data;
            const func: any = services[name as keyof typeof services];
            try {
                let newValue: any;
                if (type === "formData") {
                    newValue = new FormData();
                    for (const key in value) {
                        let item = value[key];
                        if (key === "image") {
                            item = base64ToFile(value[key], "ext.png", "image/png");
                            console.log(item);
                        }
                        newValue.append(key, item);
                    }
                } else {
                    newValue = value;
                }
                return await func(newValue);
            } catch (err) {
                console.log(err);
                return false;
            }
        }

        return false;
    });
} catch (error) {
    console.log("======== bg通信模块 =========");
    console.log(error);
}

browser.commands.onCommand.addListener((command) => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs.length > 0) {
            try {
                browser.tabs.sendMessage(tabs[0].id as number, {
                    type: "onCommand",
                    data: command,
                });
            } catch (error) {
                console.info("onCommand" + error);
            }
        }
    });
});

async function captureScreenshot(): Promise<string> {
    try {
        const url = await browser.tabs.captureVisibleTab(undefined, { format: "png" });
        return Promise.resolve(url);
    } catch (e) {
        console.log(e);
        return Promise.reject("");
    }
}

function loadContentScripts() {
    browser.tabs.query({}).then(async (tabs: any) => {
        for (const tab of tabs) {
            if (tab.url && tab.url.startsWith("http") && tab.status === "complete") {
                await browser.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ["js/contentScriptMain.js"],
                });
            }
        }
    });
}

async function init() {
    const token = await getToken();
    if (token) {
        store.dispatch({
            type: "userInfo/SET_TOKEN",
            payload: token,
        });
        await getQuota(store);
    }
}
