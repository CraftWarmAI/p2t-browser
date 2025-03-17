import React from "react";
import { Button, Typography, Space, Divider } from "antd";
import browser from "webextension-polyfill";
import styles from "./NotLogin.less";

const { Title, Text } = Typography;

export const NotLogin: React.FC<{ onLogin: () => void }> = (props) => {
    const handleLogin = async () => {
        props.onLogin();
    };

    const handleRegister = async () => {
        try {
            await browser.runtime.sendMessage({ type: "openRegisterPage" });
        } catch (error) {
            console.error("Failed to open register page:", error);
        }
    };

    return (
        <div className={styles.popup}>
            <div className={styles.userHeader}>
                <div className={styles.userInfo}>
                    <Title level={4}>Welcome</Title>
                    <Text type="secondary">Please login to access all features</Text>
                </div>
            </div>

            <Divider />

            <div className={styles.subscriptionInfo}>
                <Title level={5}>Benefits of VIP Membership</Title>
                <Space direction="vertical" size="small">
                    <Text>✓ Unlimited access to all features</Text>
                    <Text>✓ Priority customer support</Text>
                    <Text>✓ Faster, more accurate math formula recognition</Text>
                </Space>
            </div>

            <div className={styles.actions}>
                <Button type="primary" onClick={handleLogin} className={styles.renewButton}>
                    Email Login
                </Button>
                <Button className={styles.googleButton} onClick={handleRegister}>
                    Google Login
                </Button>
            </div>
        </div>
    );
};
