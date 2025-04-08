import * as React from "react";
import * as ReactDOM from "react-dom";
import browser from "webextension-polyfill";
import "@src/utils/i18";
import App from "./main";
import { Store } from "webext-redux";
import { Provider } from "react-redux";

const store = new Store();

browser.tabs.query({ active: true, currentWindow: true }).then(async () => {
    await store.ready();
    const node = document.getElementById("popup");

    if (node) {
        ReactDOM.render(
            <Provider store={store}>
                <App />
            </Provider>,
            node,
        );
    }
});
