import React from "react";
import { useRoutes } from "react-router-dom";
import "./styles.css";
import routes from "./routes";

const AppRoutes = () => {
    return useRoutes(routes);
};

export const RouterIndex = () => {
    return <AppRoutes />;
};
