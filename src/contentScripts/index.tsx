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
let currentToken: string;
init();

async function init() {
    await store.ready();
    pageInit();
}

async function pageInit() {
    try {
        setToken();

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
        if (!is_build) {
            render(node, <Reload />);
        }

        // 监听href更新，重新加载组件
        hrefChange(async () => {
            delReactDom(extId);
            return pageInit();
        });
    } catch (error) {
        console.log(error);
    }
}

function setToken() {
    const { href, search } = window.location;
    if (
        href.indexOf(`p2t${node_env === "dev" ? "-dev" : ""}.breezedeus.com`) > 0 &&
        search.indexOf("event=login") > 0
    ) {
        if (timer) clearInterval(timer);
        timer = setInterval(async () => {
            if (store.getState().userInfo.logined) {
                return clearInterval(timer);
            }
            const token = document.getElementById("ext_login")?.innerHTML || "";
            if (currentToken !== token) {
                currentToken = token;
                store.dispatch({
                    type: "userInfo/SET_TOKEN",
                    payload: token,
                });
                const result = getQuota(store)();
                if (Boolean(result)) {
                    setTimeout(() => {
                        message.success("login successfully");
                    }, 2000);
                    await browser.storage.local.set({ token });
                }
            }
        }, 2000);
    }
}
