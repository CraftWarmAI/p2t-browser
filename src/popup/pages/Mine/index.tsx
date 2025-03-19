import React, { useState, useEffect } from "react";
import { Button, Typography, Space, Divider, Tag } from "antd";
import { CrownOutlined, LogoutOutlined } from "@ant-design/icons";
import styles from "./styles.less";
import { useDispatch, useSelector } from "react-redux";

const { Title, Text } = Typography;

export const Mine = () => {
    const dispatch = useDispatch();
    const name = useSelector((state: any) => state.userInfo.name);
    const [userInfo, setUserInfo] = useState({
        email: name,
        vipExpiry: "2023-12-31",
        isVip: true,
    });

    useEffect(() => {
        // Fetch user info from storage or API
        const fetchUserInfo = async () => {
            try {
            } catch (error) {
                console.error("Failed to fetch user info:", error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleLogout = async () => {
        dispatch({
            type: "userInfo/SET_NAME",
            payload: "d_" + Date.now(),
        });
    };

    const getRemainingDays = () => {
        if (!userInfo.vipExpiry) return 0;

        const today = new Date();
        const expiryDate = new Date(userInfo.vipExpiry);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays > 0 ? diffDays : 0;
    };

    return (
        <div className={styles.popup}>
            <div className={styles.userHeader}>
                <div className={styles.userInfo}>
                    <Title level={4}>{userInfo.email}</Title>
                    {userInfo.isVip ? (
                        <Tag color="gold" icon={<CrownOutlined />}>
                            VIP Member
                        </Tag>
                    ) : (
                        <Tag>Free User</Tag>
                    )}
                </div>
            </div>

            <Divider />

            <div className={styles.subscriptionInfo}>
                <Title level={5}>Subscription Status{name}</Title>
                {userInfo.isVip ? (
                    <Space direction="vertical" size="small">
                        <Text>
                            VIP expires on: <Text strong>{userInfo.vipExpiry}</Text>
                        </Text>
                        <Text type={getRemainingDays() < 7 ? "danger" : "secondary"}>
                            {getRemainingDays()} days remaining
                        </Text>
                    </Space>
                ) : (
                    <Text>You don&apos;t have an active subscription</Text>
                )}
            </div>

            <div className={styles.actions}>
                <Button type="primary" onClick={() => false} className={styles.renewButton}>
                    {userInfo.isVip ? "Renew Subscription" : "Upgrade to VIP"}
                </Button>
                <Button
                    danger
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    className={styles.logoutButton}
                >
                    Logout
                </Button>
            </div>
        </div>
    );
};
