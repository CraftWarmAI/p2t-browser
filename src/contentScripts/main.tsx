import React, { useState } from "react";
import Screenshot from "./components/Screenshot";
import { OcrModal } from "./components/OcrModal";
import "@src/utils/i18";
import "./styles.less";

const App = () => {
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [ocrStatus, setOcrStatus] = useState(0);
    const [openOcrOutputModal, setOpenOcrOutputModal] = useState(false);

    const onCancelModal = () => {
        setOpenOcrOutputModal(false);
        setOcrStatus(0);
    };

    const onScreenshot = (img: File) => {
        setScreenshot(img);
    };

    return (
        <>
            <Screenshot onScreenshot={onScreenshot} />
            <OcrModal
                onCancelModal={onCancelModal}
                openOcrOutputModal={openOcrOutputModal}
                screenshot={screenshot}
                ocrStatus={ocrStatus}
            />
        </>
    );
};

export default App;
