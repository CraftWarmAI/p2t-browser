import React, { useEffect } from "react";
import { HashRouter as Router, useLocation, useNavigate } from "react-router-dom";
import { Transition } from "./routers/Index";
import { Provider, useSelector } from "react-redux";
import store from "../redux/index";
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
        }
    }, []);

    return <Transition />;
};

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <Middleware />
            </Router>
        </Provider>
    );
};

export default App;
