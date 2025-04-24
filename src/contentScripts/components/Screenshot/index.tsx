import React, { useState, useEffect, useRef } from "react";
import { Button, message } from "antd";
import Cropper, { ReactCropperElement } from "react-cropper";
import { useOcrStore } from "@src/contentScripts/zustand/store";
import browser from "webextension-polyfill";
import styles from "./component.less";
import Mousetrap from "mousetrap";
import { useSelector } from "react-redux";
import "cropperjs/dist/cropper.css";

const Screenshot: React.FC = () => {
    const { setScreenshot } = useOcrStore();
    const [hasCrop, setHasCrop] = useState(false);
    const cropperRef = useRef<ReactCropperElement>(null);
    const logined = useSelector((state: any) => {
        return state.userInfo.logined;
    });
    const [isSelecting, setIsSelecting] = useState<boolean>(false);
    const [bgImg, setBgImg] = useState<string>("");

    useEffect(() => {
        Mousetrap.bind(["esc"], () => {
            handleCancel();
        });

        return () => {
            Mousetrap.unbind(["esc"]);
        };
    }, []);

    useEffect(() => {
        async function onMessage(params: SendMessage) {
            if (params.type === "onCommand") {
                if (isSelecting) return false;
                if (!logined) {
                    message.warning("Please log in before using the P2T feature.");
                    return await browser.runtime.sendMessage({
                        type: "openPopup",
                    });
                }
                try {
                    const url = await browser.runtime.sendMessage({
                        type: "captureScreenshot",
                    });
                    setBgImg(url);
                    setIsSelecting(true);
                } catch (e) {
                    console.error(e);
                }
            }
            return false;
        }

        browser.runtime.onMessage.addListener(onMessage);
        return () => {
            browser.runtime.onMessage.removeListener(onMessage);
        };
    }, [logined, isSelecting]);

    // const onCrop = () => {
    //     const cropper: any = cropperRef.current?.cropper;
    //     console.log(cropper.getCroppedCanvas().toDataURL());
    // };

    const handleCancel = () => {
        setHasCrop(false);
        setIsSelecting(false);
        cropperRef.current?.cropper.destroy();
    };

    if (!isSelecting) {
        return null;
    }

    return (
        <>
            <Cropper
                ref={cropperRef}
                src={bgImg}
                className={styles.cropper}
                autoCropArea={1}
                checkOrientation={false}
                viewMode={1}
                zoomable={false}
                background={true}
                guides={true}
                autoCrop={false}
                cropstart={() => setHasCrop(true)}
                cropend={() => {
                    const cropper: any = cropperRef.current?.cropper;
                    const data = cropper.getData(true);
                    const isEmpty = data.width === 0 || data.height === 0;
                    setHasCrop(!isEmpty);
                }}
            />
            {!hasCrop && <div className={styles.background}></div>}
        </>
    );
};

export default Screenshot;
