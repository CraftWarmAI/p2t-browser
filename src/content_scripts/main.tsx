import React from "react";
import store from "./redux/index";
import { Provider } from "react-redux";
import { render, delReactDom } from "@src/utils/dom";
import LatexOcr from "@src/components/LatexOcr";
import Reload from "@src/components/Reload";
import { hrefChange } from "@src/utils/hrefChange";
import "@src/utils/i18";

const { is_build } = process.env;

init();

function init() {
    pageInit();
}

async function pageInit() {
    // 获取商品关键词
    try {
        // 获取body节点
        const node = document.getElementsByTagName("body")?.[0];
        if (!node) throw new Error("body节点不存在");

        // 渲染组件
        const extId = render(
            node,
            <Provider store={store}>
                <LatexOcr />
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
