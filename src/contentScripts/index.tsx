import React from "react";
import { render, delReactDom } from "@src/utils/dom";
import Reload from "./components/Reload";
import { hrefChange } from "@src/utils/hrefChange";
import App from "./main";

const { is_build } = process.env;

init();

function init() {
    pageInit();
}

async function pageInit() {
    try {
        // 获取body节点
        const node = document.getElementsByTagName("body")?.[0];
        if (!node) throw new Error("body节点不存在");

        // 渲染组件
        const extId = render(node, <App />);

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
