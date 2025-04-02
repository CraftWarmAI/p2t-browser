import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { OcrInputParams } from "../OcrInputParams";
import { OcrOutput } from "../OcrOutput";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.less";

export const OcrModal = () => {
    const dispatch = useDispatch();
    const ocrStatus = useSelector((state: any) => state.ocr.ocrStatus);
    const openOcrOutputModal = useSelector((state: any) => state.ocr.openOcrOutputModal);
    const screenshot = useSelector((state: any) => state.ocr.screenshot);
    const [previewImgUrl, setPreviewImgUrl] = useState<string>("");

    useEffect(() => {
        setPreviewImgUrl(screenshot ? URL.createObjectURL(screenshot) : "");
    }, [screenshot]);

    const onCancelModal = () => {
        dispatch({
            type: "ocr/CANCEL_OCR",
        });
    };

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
            <img className={styles.preview} src={previewImgUrl} alt="" />

            {ocrStatus === 0 && screenshot && <OcrInputParams />}

            {ocrStatus !== 0 && <OcrOutput />}
        </Modal>
    );
};
