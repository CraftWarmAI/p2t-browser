import React, { useEffect, useState } from "react";
import { useOcrStore } from "@src/contentScripts/zustand/store";
import browser from "webextension-polyfill";
import { useDispatch, useSelector } from "react-redux";
import { Modal, message } from "antd";
import { OcrInputParams } from "../OcrInputParams";
import { OcrOutput } from "../OcrOutput";
import styles from "./styles.less";
import { fileToBase64 } from "@src/utils/fileConversion";
import Compressor from "compressorjs";

export const OcrModal: React.FC = () => {
    const dispatch = useDispatch();
    const token = useSelector((state: any) => state.userInfo.token);
    const {
        language,
        fileType,
        model,
        screenshot,
        openOcrOutputModal,
        ocrStatus,
        setOcrInputValue,
        setOrcLoading,
        setTaskId,
        onCancelOcr,
    } = useOcrStore();
    const [imgUrl, setImgUrl] = useState("");

    useEffect(() => {
        setImgUrl(screenshot ? URL.createObjectURL(screenshot) : "");
    }, [screenshot]);

    useEffect(() => {
        if (ocrStatus === 1) {
            createOcrTask();
        }
    }, [ocrStatus]);

    const imgQuality = (file: File) => {
        return new Promise((resolve, reject) => {
            new Compressor(file, {
                quality: 0.9,
                success(result: File) {
                    resolve(result);
                },
                error(err: Error) {
                    reject(err);
                },
            });
        });
    };

    const createOcrTask = async () => {
        try {
            setOrcLoading(true);
            const newFile = await imgQuality(screenshot as File);
            const result = await browser.runtime.sendMessage({
                type: "fetch",
                data: {
                    type: "formData",
                    name: model === "plus" ? "imgOcrGpu" : "imgOcr",
                    value: {
                        image: await fileToBase64(newFile as File),
                        session_id: token,
                        language: language,
                        file_type: fileType,
                        resized_shape: "768",
                    },
                },
            });
            const { status_code, task_id, ok } = result;
            if (ok === false || status_code !== 200) throw result;
            getResult(task_id, model);
            setTaskId(task_id);
        } catch (error) {
            console.log(error);
            setOrcLoading(false);
            message.error("please try again");
        }
    };
    const getResult = async (taskId: string, modelType: string) => {
        try {
            const result = await browser.runtime.sendMessage({
                type: "fetch",
                data: {
                    name: modelType === "pro" ? "getTaskResult" : "getTaskResultGpu",
                    value: {
                        task_id: taskId,
                        session_id: token,
                    },
                },
            });
            if (result?.ok == false) throw result;
            const { results, plus_quota, status } = result;
            if (status === "PROGRESS") {
                const timer = setTimeout(() => {
                    getResult(taskId, modelType);
                    clearTimeout(timer);
                }, 1000);
                return;
            }
            dispatch({
                type: "userInfo/setQuota",
                payload: result,
            });
            if (plus_quota <= 0 && modelType === "plus") {
                Modal.warning({
                    getContainer: false,
                    styles: {
                        mask: {
                            zIndex: 2147483647,
                        },
                        wrapper: {
                            zIndex: 2147483647,
                        },
                    },
                    title: "Your Plus Quota is not enough.",
                    content: (
                        <>
                            Visit our <a href="https://p2t.breezedeus.com/pricing">Pricing</a> page
                            to recharge.
                        </>
                    ),
                    okText: "Learn More",
                    closable: true,
                    onOk: () => {
                        browser.tabs.create({
                            url: "https://p2t.breezedeus.com/pricing",
                        });
                    },
                });
            }
            setOcrInputValue(results);
        } catch (error) {
            console.log(error);
        }

        setOrcLoading(false);
    };

    return (
        <Modal
            getContainer={false}
            styles={{
                mask: {
                    zIndex: 2147483647,
                },
                wrapper: {
                    zIndex: 2147483647,
                },
            }}
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
