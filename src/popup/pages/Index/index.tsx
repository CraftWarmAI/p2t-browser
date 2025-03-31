import React, { useState } from "react";
import browser from "webextension-polyfill";
import styles from "./styles.less";
import { useNavigate } from "react-router-dom";
import logoImg from "@src/assets/images/logo.jpg";
import { Button, Typography, Space, Divider, Card } from "antd";

const { Title, Text } = Typography;

export const Index = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            navigate("/email-login");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Card className={styles.card}>
                <div className={styles.header}>
                    <img src={logoImg} alt="Pix2Text Logo" className={styles.logo} />
                    <Title level={3} className={styles.title}>
                        Pix2Text
                    </Title>
                    <Text type="secondary" className={styles.subtitle}>
                        A Free Alternative to Mathpix
                    </Text>
                </div>

                <Divider className={styles.divider} />

                <div className={styles.websiteLink}>
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
                </div>

                <div className={styles.footer}>
                    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                        <Button
                            type="primary"
                            size="large"
                            block
                            onClick={handleLogin}
                            loading={isLoading}
                        >
                            Login
                        </Button>
                    </Space>
                </div>
            </Card>
        </div>
    );
};
