import * as React from "react";
import * as ReactDOM from "react-dom";
import browser from "webextension-polyfill";
import store from "@src/redux/index";
import { storeSync } from "@src/utils/storeSync";
import "@src/utils/i18";
import App from "./main";

browser.tabs.query({ active: true, currentWindow: true }).then(async () => {
    const node = document.getElementById("popup");
    if (node) {
        node.innerHTML = "";
        await storeSync(store);
        ReactDOM.render(<App />, node);
    }
});
