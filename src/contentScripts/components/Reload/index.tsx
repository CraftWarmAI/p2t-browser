import React, { useEffect } from "react";
import browser from "webextension-polyfill";
import Mousetrap from "mousetrap";

const Reload = () => {
    useEffect(() => {
        Mousetrap.bind(["command+m"], () => {
            reload();
        });

        return () => {
            Mousetrap.unbind(["command+m"]);
        };
    }, []);

    const reload = () => {
        browser.runtime.sendMessage({
            type: "reload",
        });
        const timer = setTimeout(() => {
            location.reload();
            clearTimeout(timer);
        }, 1000);
    };

    return (
        <button
            style={{
                position: "fixed",
                left: "50%",
                top: "-100px",
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
