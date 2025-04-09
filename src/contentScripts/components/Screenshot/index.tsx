import React, { useState, useEffect, useRef } from "react";
import { Button, message } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { useOcrStore } from "@src/contentScripts/zustand/store";
import browser from "webextension-polyfill";
import styles from "./component.less";
import Mousetrap from "mousetrap";
import { useSelector } from "react-redux";

interface SelectionArea {
    startX: number;
    startY: number;
    width: number;
    height: number;
}

const Screenshot: React.FC = () => {
    const { setScreenshot } = useOcrStore();
    const logined = useSelector((state: any) => state.userInfo.logined);
    const [isSelecting, setIsSelecting] = useState<boolean>(false);
    const [selection, setSelection] = useState<SelectionArea>({
        startX: -10,
        startY: 0,
        width: 0,
        height: 0,
    });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const [resizeDirection, setResizeDirection] = useState<string>("");
    const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
    const [isDown, setIsDown] = useState<boolean>(false);
    const [bgImg, setBgImg] = useState<string>("");
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        Mousetrap.bind(["esc"], () => {
            resetSelection();
        });

        return () => {
            Mousetrap.unbind(["esc"]);
        };
    }, []);

    useEffect(() => {
        async function onMessage(params: SendMessage) {
            if (params.type === "onCommand") {
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
        }

        browser.runtime.onMessage.addListener(onMessage);
        return () => {
            browser.runtime.onMessage.removeListener(onMessage);
        };
    }, [logined]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isSelecting || !selection) return;

        if (selection && isPointInSelection(e.clientX, e.clientY, selection)) {
            setIsDragging(true);
            setStartPoint({ x: e.clientX, y: e.clientY });
            return;
        }

        if (selection && isPointNearBorder(e.clientX, e.clientY, selection)) {
            setIsResizing(true);
            setStartPoint({ x: e.clientX, y: e.clientY });
            return;
        }

        setIsDown(true);
        setSelection({
            startX: e.clientX,
            startY: e.clientY,
            width: 0,
            height: 0,
        });
        setStartPoint({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isSelecting || !startPoint) return;

        if (isDragging && selection) {
            const deltaX = e.clientX - startPoint.x;
            const deltaY = e.clientY - startPoint.y;

            setSelection({
                startX: selection.startX + deltaX,
                startY: selection.startY + deltaY,
                width: selection.width,
                height: selection.height,
            });

            setStartPoint({ x: e.clientX, y: e.clientY });
            return;
        }

        if (isResizing && selection && resizeDirection) {
            handleResize(e, selection, resizeDirection);
            return;
        }

        if (startPoint) {
            const width = e.clientX - startPoint.x;
            const height = e.clientY - startPoint.y;

            setSelection({
                startX: width >= 0 ? startPoint.x : e.clientX,
                startY: height >= 0 ? startPoint.y : e.clientY,
                width: Math.abs(width),
                height: Math.abs(height),
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
        setStartPoint(null);
        setIsDown(false);
    };

    const isPointInSelection = (x: number, y: number, sel: SelectionArea): boolean => {
        return (
            x >= sel.startX &&
            x <= sel.startX + sel.width &&
            y >= sel.startY &&
            y <= sel.startY + sel.height
        );
    };

    const isPointNearBorder = (x: number, y: number, sel: SelectionArea): boolean => {
        const borderThreshold = 10;
        const isNearLeftBorder = Math.abs(x - sel.startX) <= borderThreshold;
        const isNearRightBorder = Math.abs(x - (sel.startX + sel.width)) <= borderThreshold;
        const isNearTopBorder = Math.abs(y - sel.startY) <= borderThreshold;
        const isNearBottomBorder = Math.abs(y - (sel.startY + sel.height)) <= borderThreshold;

        if (isNearLeftBorder) {
            setResizeDirection("left");
            return true;
        } else if (isNearRightBorder) {
            setResizeDirection("right");
            return true;
        } else if (isNearTopBorder) {
            setResizeDirection("top");
            return true;
        } else if (isNearBottomBorder) {
            setResizeDirection("bottom");
            return true;
        }

        return false;
    };

    const handleResize = (e: React.MouseEvent, sel: SelectionArea, direction: string) => {
        const deltaX = e.clientX - (startPoint?.x || 0);
        const deltaY = e.clientY - (startPoint?.y || 0);

        const newSelection = { ...sel };

        switch (direction) {
            case "left":
                newSelection.startX = sel.startX + deltaX;
                newSelection.width = sel.width - deltaX;
                break;
            case "right":
                newSelection.width = sel.width + deltaX;
                break;
            case "top":
                newSelection.startY = sel.startY + deltaY;
                newSelection.height = sel.height - deltaY;
                break;
            case "bottom":
                newSelection.height = sel.height + deltaY;
                break;
        }

        setSelection(newSelection);
        setStartPoint({ x: e.clientX, y: e.clientY });
    };

    const handleConfirm = async () => {
        if (selection) {
            try {
                const newImg: File = await cropImage(bgImg, selection);
                setScreenshot(newImg);
            } catch (e) {
                console.error(e);
            }
        }
        resetSelection();
    };

    const cropImage = async (imageUrl: string, sel: SelectionArea): Promise<File> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = sel.width;
                canvas.height = sel.height;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Failed to get canvas context"));
                    return;
                }
                ctx.drawImage(
                    img,
                    sel.startX,
                    sel.startY,
                    sel.width,
                    sel.height,
                    0,
                    0,
                    sel.width,
                    sel.height,
                );
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error("Failed to create blob from canvas"));
                        return;
                    }
                    const croppedFile = new File([blob], "cropped-screenshot.png", {
                        type: "image/png",
                    });

                    resolve(croppedFile);
                }, "image/png");
            };
            img.onerror = () => {
                reject(new Error("Failed to load image"));
            };
            img.src = imageUrl;
        });
    };

    const handleCancel = () => {
        resetSelection();
    };

    const resetSelection = () => {
        setIsSelecting(false);
        setSelection({
            startX: -10,
            startY: 0,
            width: 0,
            height: 0,
        });
        setIsDragging(false);
        setIsResizing(false);
        setStartPoint(null);
        setBgImg("");
    };

    if (!isSelecting) {
        return null;
    }

    return (
        <div
            style={{
                backgroundImage: `url(${bgImg})`,
            }}
            ref={overlayRef}
            className={styles.latexOcrOverlay}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div className={styles.bg}>
                <div
                    style={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: `${selection.startX}px`,
                    }}
                ></div>
                <div
                    style={{
                        top: 0,
                        left: `${selection.startX}px`,
                        height: `${selection.startY}px`,
                        right: 0,
                    }}
                ></div>
                <div
                    style={{
                        top: `${selection.startY}px`,
                        left: `${selection.startX + selection.width}px`,
                        bottom: 0,
                        right: 0,
                    }}
                ></div>
                <div
                    style={{
                        top: `${selection.startY + selection.height}px`,
                        left: `${selection.startX}px`,
                        bottom: 0,
                        width: `${selection.width}px`,
                    }}
                ></div>
            </div>
            <div
                className={styles.selectionArea}
                style={{
                    left: `${selection.startX}px`,
                    top: `${selection.startY}px`,
                    width: `${selection.width}px`,
                    height: `${selection.height}px`,
                }}
            >
                {!isDown && (
                    <div className={styles.selectionControls}>
                        <Button
                            danger
                            className={styles.cancelButton}
                            onClick={handleCancel}
                            type="primary"
                            icon={<CloseOutlined />}
                        />
                        <Button
                            className={styles.confirmButton}
                            onClick={handleConfirm}
                            type="primary"
                            icon={<CheckOutlined />}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Screenshot;
