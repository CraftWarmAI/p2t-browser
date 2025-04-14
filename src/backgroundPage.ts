import browser from "webextension-polyfill";
import services from "@src/services/ocr";
import { getQuota, logout } from "@src/redux/actions/ocr";
import { getToken } from "@src/utils/cookie";
import { store } from "@src/redux/store";
import { wrapStore, Store } from "webext-redux";
import { base64ToFile, blobToBase64 } from "@src/utils/fileConversion";

try {
    wrapStore(store, {
        portName: "p2t",
    });
} catch (error) {
    console.log("======== redux初始化模块 =========");
    console.log(error);
}

init();

try {
    browser.runtime.onInstalled.addListener((details) => {
        if (details.reason === "install") {
            loadContentScripts();
            const timer = setTimeout(async () => {
                await browser.action.openPopup();
                clearTimeout(timer);
            }, 3000);
        } else if (details.reason === "update" && process.env.is_build === "true") {
            loadContentScripts();
        }
    });
} catch (error) {
    console.log("======== Install模块 =========");
    console.log(error);
}

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
            return await fetchBridge(params);
        }

        return false;
    });
} catch (error) {
    console.log("======== bg通信模块 =========");
    console.log(error);
}

browser.commands.onCommand.addListener((command) => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs.length > 0 && tabs[0].status === "complete") {
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

async function fetchBridge(params: SendMessage) {
    const { name, value = {}, type = "json" } = params.data;
    const func: any = services[name as keyof typeof services];
    try {
        let newValue: any;
        if (type === "formData") {
            newValue = new FormData();
            for (const key in value) {
                let item = value[key];
                if (key === "image") {
                    item = base64ToFile(value[key], "ext.png", "image/png");
                }
                newValue.append(key, item);
            }
        } else {
            newValue = value;
        }
        let result = await func(newValue);
        if (["exportResultGpu", "exportResult"].includes(params.data.name)) {
            result = blobToBase64(result);
        }
        return result;
    } catch (error: any) {
        if ([401, 422].includes(error?.status)) {
            await logout(store as Store);
            browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
                if (tabs.length > 0) {
                    browser.tabs.sendMessage(tabs[0].id as number, {
                        type: "message",
                        data: "Login expired. Please sign in to continue.",
                    });
                }
            });
            browser.action.openPopup();
        }
        return error;
    }
}
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
        await getQuota(store as Store);
    }
}
