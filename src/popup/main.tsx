import React, { useEffect } from "react";
import { HashRouter as Router, useLocation, useNavigate } from "react-router-dom";
import { RouterIndex } from "./routers/Index";
import { useSelector } from "react-redux";
import "reset.css";

const Middleware = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const logined = useSelector((state: any) => state.userInfo.logined);

    useEffect(() => {
        if (logined && location.pathname !== "/mine") {
            navigate("/mine");
        } else if (!logined && location.pathname !== "/") {
            navigate("/");
        }
    }, [logined]);

    return <RouterIndex />;
};

const App = () => {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Middleware />
        </Router>
    );
};

export default App;
