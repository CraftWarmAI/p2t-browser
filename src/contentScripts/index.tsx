import React from "react";
import { render, delReactDom } from "@src/utils/dom";
import Reload from "./components/Reload";
import browser from "webextension-polyfill";
import { hrefChange } from "@src/utils/hrefChange";
import { getQuota } from "@src/redux/actions/ocr";
import { message } from "antd";
import { Provider } from "react-redux";
import App from "./main";
import { Store } from "webext-redux";
const store = new Store();

const { is_build, node_env } = process.env;
let timer: any;

(async function () {
    await store.ready();
    setToken();
    pageInit();
})();

async function pageInit() {
    try {
        console.log("pageInit");

        // 获取body节点
        const node = document.getElementsByTagName("body")?.[0];
        if (!node) throw new Error("body节点不存在");

        // 渲染组件
        const extId = render(
            node,
            <Provider store={store}>
                <App />
            </Provider>,
        );

        // 快捷刷新
        let reloadId: string;
        if (!is_build) {
            reloadId = render(node, <Reload />);
        }

        // 监听href更新，重新加载组件
        hrefChange(async () => {
            delReactDom(extId);
            if (reloadId) delReactDom(reloadId);
            if (timer) clearInterval(timer);
            return pageInit();
        });
    } catch (error) {
        console.log(error);
    }
}

function setToken() {
    const { href, search } = window.location;
    let currentToken: string;

    if (
        href.indexOf(`p2t${node_env === "dev" ? "-dev" : ""}.breezedeus.com`) > 0 &&
        search.indexOf("event=login") > 0
    ) {
        if (timer) clearInterval(timer);
        timer = setInterval(async () => {
            if (await store.getState().userInfo.logined) {
                return clearInterval(timer);
            }
            const token = document.getElementById("ext_login")?.innerHTML || "";
            if (currentToken !== token && token) {
                currentToken = token;
                store.dispatch({
                    type: "userInfo/SET_TOKEN",
                    payload: token,
                });
                const result = await getQuota();
                if (Boolean(result)) {
                    message.success("login successfully");
                    await browser.storage.local.set({ token });
                    try {
                        await browser.runtime.sendMessage({
                            type: "openPopup",
                        });
                    } catch (error) {
                        console.log("openPopup启动限制");
                    }
                }
            }
        }, 2000);
    }
}
