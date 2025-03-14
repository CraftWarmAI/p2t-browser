import { request } from "@src/utils/request";

/**
 * 上传埋点
 * @param body
 * @returns
 */
export function uploadEventTrack(body: EventTrackBody) {
    return request(`/api/v1/event/`, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

/**
 * 获取ip地址
 * @param body
 * @returns
 */
export function getUserIP() {
    return request(`https://httpbin.org/ip`);
}
