import React from "react";
import Screenshot from "./components/Screenshot";
import { OcrModal } from "./components/OcrModal";
import "./styles.less";

const App = () => {
    return (
        <>
            <Screenshot />
            <OcrModal />
        </>
    );
};

export default App;
