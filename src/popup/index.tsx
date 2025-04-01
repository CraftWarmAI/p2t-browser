import * as React from "react";
import * as ReactDOM from "react-dom";
import browser from "webextension-polyfill";
import store from "../redux/index";
import "@src/utils/i18";
import App from "./main";

browser.tabs.query({ active: true, currentWindow: true }).then(async () => {
    const node = document.getElementById("popup");
    if (node) {
        node.innerHTML = "";
        const newValue: any = await browser.storage.local.get("reduxState");
        if (newValue.reduxState) {
            const newState = JSON.parse(newValue.reduxState);
            for (const key in newState) {
                if (newState.hasOwnProperty(key)) {
                    store.dispatch({
                        type: `${key}/RELOAD`,
                        payload: newState[key],
                    });
                }
            }
        }
        ReactDOM.render(<App />, node);
    }
});
