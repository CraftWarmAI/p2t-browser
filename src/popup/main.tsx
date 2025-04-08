import React, { useEffect } from "react";
import { HashRouter as Router, useLocation, useNavigate } from "react-router-dom";
import { Transition } from "./routers/Index";
import { useSelector } from "react-redux";
import "reset.css";

const Middleware = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const logined = useSelector((state: any) => {
        return state.userInfo.logined;
    });

    useEffect(() => {
        if (logined && location.pathname !== "/mine") {
            navigate("/mine");
        } else if (!logined && location.pathname !== "/") {
            navigate("/");
        }
    }, [logined]);

    return <Transition />;
};

const App = () => {
    return (
        <Router>
            <Middleware />
        </Router>
    );
};

export default App;
