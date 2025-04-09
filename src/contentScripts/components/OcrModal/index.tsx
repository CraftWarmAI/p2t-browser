import React, { useEffect, useState } from "react";
import { useOcrStore } from "@src/contentScripts/zustand/store";
import browser from "webextension-polyfill";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "antd";
import { OcrInputParams } from "../OcrInputParams";
import { OcrOutput } from "../OcrOutput";
import styles from "./styles.less";
import { fileToBase64 } from "@src/utils/fileConversion";
import ImagesQuicklyCompress from "images-quickly-compress";

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
        const imageCompress = new ImagesQuicklyCompress({
            size: "50kb",
            imageType: file.type,
            quality: 0.8,
            orientation: true,
        });
        return imageCompress.compressor([file]);
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
                        image: await fileToBase64(newFile[0]),
                        session_id: token,
                        language: language,
                        file_type: fileType,
                        resized_shape: "768",
                    },
                },
            });
            if (result.status !== 200) throw result;
            const { status_code, task_id } = result.data;
            if (status_code === 200) {
                getResult(task_id, model);
                setTaskId(task_id);
            } else {
                throw result;
            }
        } catch (error) {
            console.log(error);
            setOrcLoading(false);
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
            if (result.status !== 200) throw result;
            const { status_code, results, plus_quota, status } = result.data;
            if (status === "PROGRESS") {
                const timer = setTimeout(() => {
                    getResult(taskId, modelType);
                    clearTimeout(timer);
                }, 1000);
                return;
            }
            if (status_code !== 200) throw result;
            // dispatch({
            //     type: "userInfo/setQuota",
            //     payload: result.data,
            // });
            if (plus_quota <= 0 && modelType === "plus") {
                Modal.warning({
                    title: "Your Plus Quota is not enough.",
                    content: (
                        <>
                            Visit our <a href="/pricing">Pricing</a> page to recharge.
                        </>
                    ),
                    okText: "Learn More",
                    closable: true,
                    onOk: () => {
                        window.location.href = "/pricing";
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
