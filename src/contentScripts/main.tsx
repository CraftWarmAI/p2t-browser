import React, { useEffect } from "react";
import browser from "webextension-polyfill";
import { message } from "antd";
import Screenshot from "./components/Screenshot";
import { OcrModal } from "./components/OcrModal";
import { useSelector } from "react-redux";
import { useOcrStore } from "@src/contentScripts/zustand/store";
import "./styles.less";

const App = () => {
    const quota = useSelector((state: any) => state.userInfo.quota);
    const { setModel } = useOcrStore();

    useEffect(() => {
        setModel(quota.plus_quota > 0 ? "plus" : "pro");
    }, [quota]);

    useEffect(() => {
        async function onMessage(params: SendMessage) {
            if (params.type === "message") {
                message.warning(params.data);
            }
        }
        browser.runtime.onMessage.addListener(onMessage);
        return () => {
            browser.runtime.onMessage.removeListener(onMessage);
        };
    }, []);

    return (
        <>
            <Screenshot />
            <OcrModal />
        </>
    );
};

export default App;
