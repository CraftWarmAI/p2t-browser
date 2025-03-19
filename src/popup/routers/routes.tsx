import React from "react";
import { Mine } from "../pages/Mine/index";
import { EmailLogin } from "../pages/EmailLogin/index";
import { Index } from "../pages/Index/index";

const routes = [
    { path: "/", element: <Index />, index: true },
    { path: "/email-login", element: <EmailLogin /> },
    { path: "/mine", element: <Mine /> },
];

export default routes;
