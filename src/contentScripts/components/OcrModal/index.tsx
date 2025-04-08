import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { OcrInputParams } from "../OcrInputParams";
import { OcrOutput } from "../OcrOutput";
import styles from "./styles.less";

interface Props {
    ocrStatus: number;
    screenshot: File | null;
    openOcrOutputModal: boolean;
    onCancelModal: () => void;
}

export const OcrModal: React.FC<Props> = (props) => {
    const { ocrStatus, screenshot, openOcrOutputModal, onCancelModal } = props;
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
            onCancel={() => onCancelModal()}
            footer={null}
        >
            {screenshot && <img className={styles.preview} src={imgUrl} alt="" />}
            {ocrStatus === 0 && screenshot && <OcrInputParams />}

            {ocrStatus !== 0 && <OcrOutput />}
        </Modal>
    );
};
