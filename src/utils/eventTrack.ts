import browser from "webextension-polyfill";
import store from "../content_scripts/redux";

const mockOpenEventTrack = false;

// 埋点
export async function eventTrack(params: EventTrackParams) {
    try {
        if (process.env?.is_build === "true" || mockOpenEventTrack) {
            await browser.runtime.sendMessage({
                type: "eventTrack",
                data: {
                    ...params,
                    extra: {
                        url: store.getState().goodsDetailView.href,
                        ...params.extra,
                    },
                },
            });
        }
    } catch (error) {
        console.log("埋点上传失败：", error);
    }
}

interface EventTrackParams {
    event: string;
    extra?: {
        [s: string]: any;
    };
}
