import React, { useEffect } from "react";
import Screenshot from "./components/LatexOcr";
import { Provider, useDispatch } from "react-redux";
import store from "../redux/index";
import "@src/utils/i18";

const Middleware = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: "userInfo/SET_LOGINED",
            payload: true,
        });
    }, []);

    return <Screenshot />;
};

const App = () => {
    return (
        <Provider store={store}>
            <Middleware />
        </Provider>
    );
};

export default App;
