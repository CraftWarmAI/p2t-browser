import React, { useState } from "react";
import { Button, Typography, Input, Tabs, Form, message } from "antd";
import {
    ArrowLeftOutlined,
    UserOutlined,
    MailOutlined,
    LockOutlined,
    SafetyOutlined,
} from "@ant-design/icons";
import browser from "webextension-polyfill";
import styles from "./EmailLogin.less"; // Reusing existing styles

const { Title } = Typography;
const { TabPane } = Tabs;

export const EmailLogin: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<string>("login");
    const [sendingCode, setSendingCode] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<number>(0);
    const [loginForm] = Form.useForm();
    const [registerForm] = Form.useForm();

    const handleBack = async () => {
        try {
            onBack();
        } catch (error) {
            console.error("Failed to navigate back:", error);
        }
    };

    const handleLogin = async (values: any) => {
        try {
            await browser.runtime.sendMessage({
                type: "loginWithEmail",
                email: values.email,
                password: values.password,
            });
            message.success("Login successful");
        } catch (error) {
            console.error("Login failed:", error);
            message.error("Login failed. Please check your credentials.");
        }
    };

    const handleRegister = async (values: any) => {
        try {
            await browser.runtime.sendMessage({
                type: "registerWithEmail",
                name: values.name,
                email: values.email,
                password: values.password,
                verificationCode: values.verificationCode,
            });
            message.success("Registration successful");
            setActiveTab("login");
        } catch (error) {
            console.error("Registration failed:", error);
            message.error("Registration failed. Please try again.");
        }
    };

    const sendVerificationCode = async () => {
        const email = registerForm.getFieldValue("email");
        if (!email) {
            message.error("Please enter your email first");
            return;
        }

        try {
            setSendingCode(true);
            await browser.runtime.sendMessage({
                type: "sendVerificationCode",
                email: email,
            });
            message.success("Verification code sent");

            // Start countdown
            setCountdown(60);
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setSendingCode(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            console.error("Failed to send verification code:", error);
            message.error("Failed to send verification code");
            setSendingCode(false);
        }
    };

    return (
        <div className={styles.popup}>
            <div className={styles.userHeader}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleBack}
                    style={{ marginRight: 8 }}
                />
                <div className={styles.userInfo}>
                    <Title level={4}>{activeTab === "login" ? "Email Login" : "Register"}</Title>
                </div>
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                centered
                style={{ marginBottom: 16 }}
            >
                <TabPane tab="Login" key="login">
                    <Form form={loginForm} layout="vertical" onFinish={handleLogin}>
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: "Please input your email" },
                                { type: "email", message: "Please enter a valid email" },
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: "Please input your password" }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </TabPane>
                <TabPane tab="Register" key="register">
                    <Form form={registerForm} layout="vertical" onFinish={handleRegister}>
                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: "Please input your name" }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Name" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: "Please input your email" },
                                { type: "email", message: "Please enter a valid email" },
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: "Please input your password" },
                                { min: 6, message: "Password must be at least 6 characters" },
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                        </Form.Item>
                        <Form.Item
                            name="verificationCode"
                            rules={[{ required: true, message: "Please input verification code" }]}
                        >
                            <Input
                                prefix={<SafetyOutlined />}
                                placeholder="Verification Code"
                                addonAfter={
                                    <Button
                                        type="link"
                                        size="small"
                                        onClick={sendVerificationCode}
                                        disabled={sendingCode}
                                        style={{ padding: 0 }}
                                    >
                                        {countdown > 0 ? `${countdown}s` : "Send Code"}
                                    </Button>
                                }
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Register
                            </Button>
                        </Form.Item>
                    </Form>
                </TabPane>
            </Tabs>
        </div>
    );
};
