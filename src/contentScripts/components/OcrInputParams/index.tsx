import React from "react";
import { Select, Tag, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fileTypeItems, languages, models } from "@src/config/ocrParamsConfig";
import styles from "./styles.less";

export const OcrInputParams = () => {
    const dispatch = useDispatch();
    const model = useSelector((state: any) => state.ocr.model);
    const language = useSelector((state: any) => state.ocr.language);
    const fileType = useSelector((state: any) => state.ocr.fileType);
    const ocrStatus = useSelector((state: any) => state.ocr.ocrStatus);
    const screenshot = useSelector((state: any) => state.ocr.screenshot);
    const quotaData = useSelector((state: any) => state.userInfo.quota);

    const handleChange = (value: string, key: string) => {
        dispatch({
            type: "ocr/SET_" + key,
            payload: value,
        });
    };

    const startOcr = () => {
        dispatch({
            type: "ocr/START_OCR",
        });
    };

    const cancelOcr = () => {
        dispatch({
            type: "ocr/CANCEL_OCR",
        });
    };

    if (ocrStatus === 0 && screenshot) {
        return (
            <div>
                <div className={styles.fileTypeSelector}>
                    <div>
                        <label>Model</label>
                        <Select
                            className={styles.select}
                            value={model}
                            onChange={(e) => handleChange(e, "MODEL")}
                            options={models.map((item: any) => {
                                item.disabled = item.value === "plus" && quotaData.plus_quota <= 0;
                                return item;
                            })}
                            dropdownRender={(originNode) => {
                                return (
                                    <div className={styles.dropdownRender}>
                                        <div>{originNode}</div>
                                        <Tag className={styles.tag} color="#f50">
                                            recharge
                                        </Tag>
                                    </div>
                                );
                            }}
                        />
                    </div>
                    <div>
                        <label>Text Language</label>
                        <Select
                            className={styles.select}
                            value={language}
                            onChange={(e) => handleChange(e, "LANGUAGE")}
                            options={languages.map((item: any, index) => {
                                item.disabled = !(index <= 1 || model === "plus");
                                return item;
                            })}
                        />
                    </div>
                    <div>
                        <label>File Type</label>
                        <Select
                            className={styles.select}
                            value={fileType}
                            onChange={(e) => handleChange(e, "FILE_TYPE")}
                            options={fileTypeItems.map((item: any) => {
                                if (item.value === "page") {
                                    item.disabled = model === "pro";
                                }
                                return item;
                            })}
                        />
                    </div>
                </div>
                <div className={styles.footer}>
                    <Button onClick={() => cancelOcr()}>Cancel</Button>
                    <Button className={styles.confirmBtn} type="primary" onClick={() => startOcr()}>
                        Confirm
                    </Button>
                </div>
            </div>
        );
    }

    return <></>;
};
