import React from "react";
import { Mine } from "../pages/Mine/index";
import { Index } from "../pages/Index/index";

const routes = [
    { path: "/", element: <Index />, index: true },
    { path: "/mine", element: <Mine /> },
];

export default routes;
