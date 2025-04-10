import React from "react";
import { render, delReactDom } from "@src/utils/dom";
import Reload from "./components/Reload";
import browser from "webextension-polyfill";
import { getQuota } from "@src/redux/actions/ocr";
import { Modal } from "antd";
import { Provider } from "react-redux";
import App from "./main";
import { Store } from "webext-redux";
import "./styles.less";

const store = new Store({
    portName: "p2t",
});

const { is_build, node_env } = process.env;
let renderDomId: string;
let appDomId: string;
let timer: any;

(async function () {
    await store.ready();
})();

window.addEventListener("load", pageInit);

window.addEventListener("beforeunload", () => {
    if (timer) clearInterval(timer);
    if (appDomId) delReactDom(appDomId);
    if (renderDomId) delReactDom(renderDomId);
});

async function pageInit() {
    try {
        setToken();

        // 获取body节点
        const node = document.getElementsByTagName("body")?.[0];
        if (!node) throw new Error("body节点不存在");

        // 渲染组件
        appDomId = render(
            node,
            <Provider store={store}>
                <App />
            </Provider>,
        );

        // 快捷刷新
        if (!is_build) {
            renderDomId = render(node, <Reload />);
        }
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
            if (store.getState().userInfo.logined) {
                return clearInterval(timer);
            }
            const token = document.getElementById("ext_login")?.innerHTML || "";
            console.log(token);
            if (currentToken !== token && token) {
                currentToken = token;
                store.dispatch({
                    type: "userInfo/SET_TOKEN",
                    payload: token,
                });
                const result = await getQuota();
                if (result?.ok !== false) {
                    loginSuccess();
                    await browser.storage.local.set({ token });
                }
            }
        }, 2000);
    }
}

function loginSuccess() {
    console.log("loginSuccess");
    Modal.success({
        zIndex: 2147483647,
        title: "login successfully!",
        content: "Set up your shortcut key in the extension window now!",
        okText: "Confirm",
        onOk: () => {
            browser.runtime.sendMessage({
                type: "openPopup",
            });
        },
    });
}
