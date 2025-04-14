import * as React from "react";
import * as ReactDOM from "react-dom";
import browser from "webextension-polyfill";
import App from "./main";
import { Store } from "webext-redux";
import { Provider } from "react-redux";
import { createStore } from "@src/utils/store";

init();

browser.tabs.query({ active: true, currentWindow: true }).then(init);

async function init() {
    const store: Store = await createStore(100);

    setTimeout(() => {
        const node = document.getElementById("popup");

        if (node) {
            ReactDOM.render(
                <Provider store={store}>
                    <App />
                </Provider>,
                node,
            );
        }
    }, 0);
}
