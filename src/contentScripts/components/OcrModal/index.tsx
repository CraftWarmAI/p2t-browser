import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { OcrInputParams } from "../OcrInputParams";
import { OcrOutput } from "../OcrOutput";
import styles from "./styles.less";
import { useOcrStore } from "@src/contentScripts/zustand/store";

export const OcrModal: React.FC = () => {
    const { screenshot, openOcrOutputModal, ocrStatus, onCancelOcr } = useOcrStore();
    const [imgUrl, setImgUrl] = useState("");

    useEffect(() => {
        setImgUrl(screenshot ? URL.createObjectURL(screenshot) : "");
    }, [screenshot]);

    return (
        <Modal
            title="Pix2Text"
            centered
            width={{
                md: "90%",
                lg: "960px",
                xl: "1100px",
                xxl: "1400px",
            }}
            open={openOcrOutputModal}
            onCancel={() => onCancelOcr()}
            footer={null}
        >
            {openOcrOutputModal}
            {imgUrl && <img className={styles.preview} src={imgUrl} alt="" />}
            {ocrStatus === 0 && imgUrl && <OcrInputParams />}

            {ocrStatus !== 0 && <OcrOutput />}
        </Modal>
    );
};
