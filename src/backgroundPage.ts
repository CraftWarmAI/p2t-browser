import browser from "webextension-polyfill";

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
    }

    return false;
});

browser.commands.onCommand.addListener((command) => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs.length > 0) {
            browser.tabs.sendMessage(tabs[0].id as number, {
                type: "onCommand",
                data: command,
            });
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
