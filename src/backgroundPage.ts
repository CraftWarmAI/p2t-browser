import browser from "webextension-polyfill";
import services from "@src/services/ocr";
import store from "@src/redux/index";
import { getQuota } from "@src/redux/actions/ocr";
import { getToken } from "@src/utils/cookie";

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
            browser.runtime.reload();
        } else if (params.type === "captureScreenshot") {
            return captureScreenshot();
        } else if (params.type === "latexOcr") {
            await browser.downloads.download({
                url: params.data.img,
                filename: `cropped_screenshot_${Date.now()}.png`,
                saveAs: true,
            });
        } else if (params.type === "openPopup") {
            browser.action.openPopup();
        } else if (params.type === "commandsGetAll") {
            return browser.commands.getAll();
        } else if (params.type === "commandsUpdate") {
            return browser.commands.update(params.data);
        } else if (params.type === "fetch") {
            const { name, value = {} } = params.data;
            const func: any = services[name as keyof typeof services];
            try {
                return await func(value);
            } catch (err) {
                console.info(err);
                return false;
            }
        }

        return false;
    });
} catch (error) {
    console.info("======== bg通信模块 =========");
    console.info(error);
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
    store.dispatch({
        type: "userInfo/SET_INITIALIZE",
    });
    const token = await getToken();
    if (token) {
        store.dispatch({
            type: "userInfo/SET_TOKEN",
            payload: token,
        });
    }
    getQuota(true);
}
