import React from "react";
import Screenshot from "./components/Screenshot";
import { OcrModal } from "./components/OcrModal";
import { Provider } from "react-redux";
import store from "@src/redux/index";
import "@src/utils/i18";
import "./styles.less";

const Middleware = () => {
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
