import React, { useState, useEffect } from "react";
import styles from "./styles/component.less";
import { Select, Button, message } from "antd";
import Browser from "webextension-polyfill";

export function Options() {
    const [nodeEnvValue, setNodeEnvValue] = useState<string | number>("Prod");

    useEffect(() => {
        Browser.storage.local.get().then((res) => {
            if (res.NODE_ENV && ["Dev", "Prod"].includes(res.NODE_ENV)) {
                setNodeEnvValue(res.NODE_ENV);
            }
        });
    }, []);

    const saveSettings = async () => {
        await Browser.storage.local.set({
            NODE_ENV: nodeEnvValue,
        });
        message.success("Save successfully !");
    };

    return (
        <div className={styles.optionsContainer}>
            <h1 className={styles.title}>settings</h1>
            <div className={styles.item}>
                <div className={styles.itemTitle}>Node Env:</div>
                <div className={styles.itemContent}>
                    <Select
                        style={{ width: 150 }}
                        value={nodeEnvValue}
                        onChange={setNodeEnvValue}
                        options={[
                            {
                                value: "Dev",
                                label: "Dev",
                            },
                            {
                                value: "Prod",
                                label: "Prod",
                            },
                        ]}
                    />
                </div>
            </div>
            <div className={styles.footer}>
                <Button type="primary" onClick={saveSettings}>
                    save settings
                </Button>
            </div>
        </div>
    );
}
