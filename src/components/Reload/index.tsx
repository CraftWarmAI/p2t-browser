import React from "react";
import browser from "webextension-polyfill";

const Reload = () => {
    const reload = () => {
        browser.runtime.sendMessage({
            type: "reload",
        });
        location.reload();
    };

    return (
        <button
            style={{
                position: "fixed",
                left: "50%",
                top: 0,
                marginLeft: "-120px",
                zIndex: 2147483647,
                width: "240px",
                height: "80px",
                fontSize: "50px",
                fontWeight: "bold",
                color: "red",
            }}
            onClick={reload}
        >
            reload
        </button>
    );
};

export default Reload;
