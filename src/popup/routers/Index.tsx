import React from "react";
import { HashRouter as Router, useRoutes, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./styles.css";
import routes from "./routes";

const AppRoutes = () => {
    return useRoutes(routes);
};

export const RouterIndex = () => {
    return (
        <Router>
            <Transition />
        </Router>
    );
};

export const Transition = () => {
    const location = useLocation();

    return (
        <TransitionGroup>
            <CSSTransition key={location.key} classNames="page" timeout={300}>
                <div className="page-container">
                    <AppRoutes />
                </div>
            </CSSTransition>
        </TransitionGroup>
    );
};
