import React, { useEffect, useState } from "react";
import { Input, Tooltip, message, Button, Spin } from "antd";
import { DownloadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import mathjax3 from "markdown-it-mathjax3";
import md from "markdown-it";
import Clipboard from "clipboard";
import browser from "webextension-polyfill";
import { useSelector } from "react-redux";
import { useOcrStore } from "@src/contentScripts/zustand/store";
import { getQuota } from "@src/redux/actions/ocr";
import { base64ToBlob } from "@src/utils/fileConversion";
import styles from "./styles.less";
import mdStyles from "./mackdown.less";

const { TextArea } = Input;

const Md = md({
    breaks: true,
}).use(mathjax3, {
    loader: { load: ["input/tex", "output/chtml"] },
    tex: {
        inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"],
        ],
    },
});

try {
    const defaultParagraphRenderer =
        Md.renderer.rules.paragraph_open ||
        ((tokens: any, idx: any, options: any, env: any, self: any) =>
            self.renderToken(tokens, idx, options));
    Md.renderer.rules.paragraph_open = function (
        tokens: any,
        idx: any,
        options: any,
        env: any,
        self: any,
    ) {
        let result = "";
        if (idx > 1) {
            const inline = tokens[idx - 2];
            const paragraph = tokens[idx];
            if (
                inline.type === "inline" &&
                inline.map &&
                inline.map[1] &&
                paragraph.map &&
                paragraph.map[0]
            ) {
                const diff = paragraph.map[0] - inline.map[1];
                if (diff > 0) {
                    result = "<br>".repeat(diff);
                }
            }
        }
        return result + defaultParagraphRenderer(tokens, idx, options, env, self);
    };
    // eslint-disable-next-line prettier/prettier
} catch { }

export const OcrOutput = () => {
    const token = useSelector((state: any) => state.userInfo.token);
    const { ocrInputValue, taskId, setOcrInputValue, orcLoading, model } = useOcrStore();
    const [downloadLoading, setDownloadLoading] = useState(false);

    useEffect(() => {
        const clipboard = new Clipboard("#copyAsin");
        clipboard.on("success", () => {
            message.success("Copy successful");
        });
        return () => {
            clipboard.destroy();
        };
    }, []);

    useEffect(() => {
        getMdResult(ocrInputValue);
    }, [ocrInputValue]);

    const getMdResult = (value: string) => {
        const result = Md.render(value);
        const node = document.getElementById("box");
        if (node) {
            node.innerHTML = result;
        }
    };

    const exportClick = async (format: string) => {
        setDownloadLoading(true);
        try {
            const result = await browser.runtime.sendMessage({
                type: "fetch",
                data: {
                    name: model === "plus" ? "exportResultGpu" : "exportResult",
                    value: {
                        taskId: taskId,
                        format,
                        session_id: token,
                    },
                },
            });
            const url = window.URL.createObjectURL(
                base64ToBlob(
                    result,
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8",
                ),
            );
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.setAttribute("download", taskId + "." + format);
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(a.href);
            document.body.removeChild(a);
            getQuota();
        } catch (error) {
            console.log(error);
        }
        setDownloadLoading(false);
    };

    return (
        <Spin spinning={orcLoading} tip="Loading" size="small">
            <section className={styles.editorContainer}>
                <div className={styles.editorPanel}>
                    <div className={styles.panelHeader}>
                        <div className={styles.panelTitle}>Markdown Editor</div>
                        <div className={styles.panelActions}>
                            <div
                                className={styles.actionButton}
                                id="copyAsin"
                                data-clipboard-text={ocrInputValue}
                                title="Copy Content"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <TextArea
                        className={styles.editorTextarea}
                        value={ocrInputValue}
                        onChange={(e) => setOcrInputValue(e.target.value)}
                        placeholder=""
                    />
                </div>

                <div className={styles.previewPanel}>
                    <div className={styles.panelHeader}>
                        <div className={styles.panelTitle}>Preview</div>
                        <div className={styles.panelActions}>
                            <Button
                                type="primary"
                                loading={downloadLoading}
                                size="small"
                                className={styles.docxButton}
                                title="Download as DOCX"
                                disabled={!taskId}
                                onClick={() => exportClick("docx")}
                            >
                                <DownloadOutlined />
                                DOCX
                            </Button>

                            <Tooltip
                                placement="bottomRight"
                                title="Download will cost 50 points of the Plus Quota"
                            >
                                <ExclamationCircleOutlined className={styles.downloadTip} />
                            </Tooltip>
                        </div>
                    </div>
                    <div id="box" className={`${styles.previewContent} ${mdStyles.md}`}></div>
                </div>
            </section>
        </Spin>
    );
};
