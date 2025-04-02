import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { OcrInputParams } from "../OcrInputParams";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.less";

export const OcrModal = () => {
    const dispatch = useDispatch();
    const openOcrOutputModal = useSelector((state: any) => state.ocr.openOcrOutputModal);
    const screenshot = useSelector((state: any) => state.ocr.screenshot);
    const [previewImgUrl, setPreviewImgUrl] = useState<string>("");

    useEffect(() => {
        setPreviewImgUrl(screenshot ? URL.createObjectURL(screenshot) : "");
    }, [screenshot]);

    const onCancelModal = () => {
        dispatch({
            type: "ocr/SET_OPEN_OCR_OUTPUT_MODAL",
            payload: false,
        });
    };

    return (
        <Modal
            zIndex={2147483647}
            centered
            closeIcon={null}
            width={{
                md: "90%",
                lg: "960px",
                xl: "1000px",
            }}
            open={openOcrOutputModal}
            onCancel={() => onCancelModal()}
            footer={null}
        >
            <img className={styles.preview} src={previewImgUrl} alt="" />

            <OcrInputParams />
        </Modal>
    );
};
