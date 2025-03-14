import browser from "webextension-polyfill";

browser.runtime.onMessage.addListener(async (params: SendMessage) => {
    if (params.type === "reload") {
        browser.runtime.reload();
    } else if (params.type === "captureScreenshot") {
        return captureScreenshot();
    } else if (params.type === "latexOcr") {
        console.log(params.data.img);
        await browser.downloads.download({
            url: params.data.img,
            filename: `cropped_screenshot_${Date.now()}.png`,
            saveAs: true,
        });
    }

    return false;
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
