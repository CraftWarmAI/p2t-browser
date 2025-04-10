import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import browser from "webextension-polyfill";
import { Card, Typography, Button, Space, Divider, message } from "antd";
import { LikeOutlined, LogoutOutlined, EditOutlined } from "@ant-design/icons";
import { logout } from "@src/redux/actions/ocr";
import styles from "./styles.less";
import logoImg from "@src/assets/images/logo3.png";
import { Store } from "webext-redux";

const store = new Store({
    portName: "p2t",
});

const { Title, Text } = Typography;

export const Mine = () => {
    const user = useSelector((state: any) => state.userInfo.user);
    const quota = useSelector((state: any) => state.userInfo.quota);
    const [shortcut, setShortcut] = useState("");

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        try {
            const getCommands = await browser.runtime.sendMessage({
                type: "commandsGetAll",
            });
            const screenshot = getCommands.find((item: any) => item.name === "screenshot");
            setShortcut(screenshot.shortcut);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRecharge = () => {
        browser.tabs.create({
            url: "https://p2t.breezedeus.com/pricing",
        });
    };

    const handleLogout = async () => {
        await store.ready();
        logout(store);
        message.success("Logged out!");
    };

    const formatDate = (timestamp: number) => {
        if (!timestamp) return "N/A";
        return timestamp;
    };

    const recordShortcut = () => {
        browser.tabs.create({
            url: "chrome://extensions/shortcuts",
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

            <Card className={styles.userCard}>
                <div className={styles.userInfo}>
                    <div className={styles.infoItem}>
                        <Text strong>Email:</Text>
                        <Text>{user.email || "Not available"}</Text>
                    </div>

                    <div className={styles.infoItem}>
                        <Text strong>Pro Credits:</Text>
                        <Text>{quota.pro_quota || 0}</Text>
                    </div>

                    <div className={styles.infoItem}>
                        <Text strong>Pro Expires:</Text>
                        <Text>{formatDate(quota.pro_expiry_date)}</Text>
                    </div>

                    <div className={styles.infoItem}>
                        <Text strong>Plus Credits:</Text>
                        <Text>{quota.plus_quota || 0}</Text>
                    </div>

                    <div className={styles.infoItem}>
                        <Text strong>Plus Expires:</Text>
                        <Text>{formatDate(quota.plus_expiry_date)}</Text>
                    </div>

                    <div className={styles.infoItem}>
                        <Text strong>Screenshot Shortcut:</Text>
                        <Space>
                            <Text>{shortcut || "Not set"}</Text>
                            <Button size="small" icon={<EditOutlined />} onClick={recordShortcut} />
                        </Space>
                    </div>
                </div>

                <Divider className={styles.divider} />

                <div className={styles.actions}>
                    <Button
                        className={styles.recharge}
                        type="primary"
                        onClick={handleRecharge}
                        icon={<LikeOutlined />}
                    >
                        Recharge Plus
                    </Button>
                    <Button
                        className={styles.logout}
                        danger
                        onClick={handleLogout}
                        icon={<LogoutOutlined />}
                    >
                        Logout
                    </Button>
                </div>
            </Card>
        </div>
    );
};
