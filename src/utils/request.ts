// 基础请求地址
const BASE_URL_MAP = {
    dev: "https://atropa.dev.behye.cn",
    prod: "https://atropa.behye.com",
};

const node_env = process.env.node_env || "dev";

export const request = async (url: string, params: RequestInit = {}) => {
    const BASE_URL = BASE_URL_MAP[node_env as keyof typeof BASE_URL_MAP];

    if (params) {
        params.headers = {
            ...params.headers,
            "Content-Type": "application/json;charset=UTF-8",
        };
    }
    try {
        const response = await fetch(url.startsWith("http") ? url : BASE_URL + url, params);
        if (response.ok) {
            return Promise.resolve(response.json());
        } else {
            throw response;
        }
    } catch (err) {
        return Promise.reject(err);
    }
};
