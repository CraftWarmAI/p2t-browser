import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import browser from "webextension-polyfill";
import { Card, Typography, Button, Space, Divider } from "antd";
import { LikeOutlined, LogoutOutlined, EditOutlined } from "@ant-design/icons";
import styles from "./styles.less";
import logoImg from "@src/assets/images/logo.jpg";

const { Title, Text } = Typography;

export const Mine = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state: any) => state.userInfo);
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

    const handleLogout = () => {
        dispatch({
            type: "userInfo/LOGOUT",
        });
        browser.tabs.create({
            url: "https://p2t.breezedeus.com?event=logout",
        });
    };

    const formatDate = (timestamp: number) => {
        if (!timestamp) return "N/A";
        return new Date(timestamp * 1000).toLocaleDateString();
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
                <Title level={3} className={styles.title}>
                    Pix2Text
                </Title>
                <Text type="secondary" className={styles.subtitle}>
                    A Free Alternative to Mathpix
                </Text>
            </div>

            <Card className={styles.userCard}>
                <div className={styles.userInfo}>
                    <div className={styles.infoItem}>
                        <Text strong>Email:</Text>
                        <Text>{userInfo.email || "Not available"}</Text>
                    </div>

                    <div className={styles.infoItem}>
                        <Text strong>Pro Credits:</Text>
                        <Text>
                            {userInfo.proTokens || 0} (Expires: {formatDate(userInfo.proExpiry)})
                        </Text>
                    </div>

                    <div className={styles.infoItem}>
                        <Text strong>Plus Credits:</Text>
                        <Text>
                            {userInfo.plusTokens || 0} (Expires: {formatDate(userInfo.plusExpiry)})
                        </Text>
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
