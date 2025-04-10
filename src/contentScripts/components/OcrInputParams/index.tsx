/* eslint-disable prettier/prettier */
import React from "react";
import { Select, Tag, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fileTypeItems, languages, models } from "@src/config/ocrParamsConfig";
import { useOcrStore } from "@src/contentScripts/zustand/store";
import styles from "./styles.less";

export const OcrInputParams = () => {
    const dispatch = useDispatch();
    const {
        screenshot,
        ocrStatus,
        model,
        language,
        fileType,
        setModel,
        setLanguage,
        setFileType,
        onCancelOcr,
        setOcrStatus,
    } = useOcrStore();
    const quotaData = useSelector((state: any) => state.userInfo.quota);

    const handleChange = (value: string, key: string) => {
        let fn;
        if (key === "MODEL") {
            fn = setModel;
        } else if (key === "LANGUAGE") {
            fn = setLanguage;
        } else if (key === "FILE_TYPE") {
            fn = setFileType;
        }
        fn && fn(value);
    };

    const startOcr = () => {
        setOcrStatus(1);
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
                        // dropdownRender={(originNode) => {
                        //     return (
                        //         <div className={styles.dropdownRender}>
                        //             <div>{originNode}</div>
                        //             <Tag className={styles.tag} color="#f50">
                        //                 recharge
                        //             </Tag>
                        //         </div>
                        //     );
                        // }}
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
                    <Button onClick={() => onCancelOcr()}>Cancel</Button>
                    <Button className={styles.confirmBtn} type="primary" onClick={() => startOcr()}>
                        Confirm
                    </Button>
                </div>
            </div>
        );
    }

    return <></>;
};
