import * as React from "react";
import * as ReactDOM from "react-dom";
import browser from "webextension-polyfill";
import App from "./main";
import { Store } from "webext-redux";
import { Provider } from "react-redux";

const store = new Store({
    portName: "p2t",
});

init();

browser.tabs.query({ active: true, currentWindow: true }).then(init);

async function init() {
    await store.ready();
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
