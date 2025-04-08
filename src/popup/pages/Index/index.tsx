import React from "react";
import browser from "webextension-polyfill";
import styles from "./styles.less";
import logoImg from "@src/assets/images/logo3.jpg";
import { Button, Typography, Space, Divider } from "antd";

const { node_env } = process.env;
const { Title, Text } = Typography;

export const Index = () => {
    const handleLogin = async () => {
        browser.tabs.create({
            url: `https://p2t${node_env === "dev" ? "-dev" : ""}.breezedeus.com?event=login`,
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img src={logoImg} alt="Pix2Text Logo" className={styles.logo} />
                <div className={styles.logoText}>
                    <Title level={3} className={styles.title}>
                        Pix2Text
                    </Title>
                    <Text type="secondary" className={styles.subtitle}>
                        A Free Alternative to Mathpix
                    </Text>
                </div>
            </div>

            <Divider className={styles.divider} />

            <div className={styles.usageInstructions}>
                <Title level={4}>How to Use</Title>
                <Space direction="vertical" size="small">
                    <Text>1. Log in to the browser extension using a web-based site.</Text>
                    <Text>2. Press the shortcut key to capture a screenshot instantly.</Text>
                    <Text>3. Select the area containing math equations or text.</Text>
                    <Text>4. Click the checkmark to process the image.</Text>
                </Space>
            </div>

            {/* <div className={styles.websiteLink}>
                <Text>
                    Visit our website:{" "}
                    <a
                        href="https://p2t.breezedeus.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                            e.preventDefault();
                            browser.tabs.create({ url: "https://p2t.breezedeus.com/" });
                        }}
                    >
                        p2t.breezedeus.com
                    </a>
                </Text>
            </div> */}

            <div className={styles.footer}>
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <Button type="primary" size="large" block onClick={handleLogin}>
                        Login
                    </Button>
                </Space>
            </div>
        </div>
    );
};
