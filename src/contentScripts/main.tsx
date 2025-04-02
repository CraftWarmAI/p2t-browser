import React, { useEffect } from "react";
import Screenshot from "./components/Screenshot";
import { OcrModal } from "./components/OcrModal";
import browser from "webextension-polyfill";
import { Provider, useDispatch } from "react-redux";
import store from "@src/redux/index";
import { getQuota } from "@src/redux/actions/ocr";
import "@src/utils/i18";
import "./styles.less";

const Middleware = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        function onMessage(params: SendMessage) {
            if (params.type === "getQuota") {
                setTimeout(async () => {
                    const quota = await getQuota();
                    console.log(quota);
                }, 5000);
            }
        }

        browser.runtime.onMessage.addListener(onMessage);
        return () => {
            browser.runtime.onMessage.removeListener(onMessage);
        };
    }, []);

    useEffect(() => {
        // getQuota(dispatch)

        dispatch({
            type: "userInfo/SET_LOGINED",
            payload: true,
        });
    }, []);

    return (
        <>
            <Screenshot />
            <OcrModal />
        </>
    );
};

const App = () => {
    return (
        <Provider store={store}>
            <Middleware />
        </Provider>
    );
};

export default App;
