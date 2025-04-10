// 基础请求地址
const BASE_URL_MAP = {
    dev: "https://p2t-dev.breezedeus.com",
    prod: "https://p2t.breezedeus.com",
};

const node_env = process.env.node_env || "dev";

export const request = async (url: string, params: any = {}, responseType = "json") => {
    const BASE_URL = BASE_URL_MAP[node_env as keyof typeof BASE_URL_MAP];

    if (params) {
        params.headers = {
            "Content-Type": "application/json;charset=UTF-8",
            ...params.headers,
        };
        if (params.headers["Content-Type"] === "multipart/form-data") {
            delete params.headers["Content-Type"];
        }
    }
    try {
        const response = await fetch(url.startsWith("http") ? url : BASE_URL + url, params);
        if (response.ok) {
            if (responseType === "json") {
                return Promise.resolve(response.json());
            } else if (responseType === "blob") {
                return Promise.resolve(await response.blob());
            }

            return Promise.resolve(response);
        } else {
            throw response;
        }
    } catch (err) {
        return Promise.reject(err);
    }
};
