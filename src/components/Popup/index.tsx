import React, { useState } from "react";
import { LoggedIn } from "./LoggedIn";
import { NotLogin } from "./NotLogin";
import { EmailLogin } from "./EmailLogin";

export const Popup: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
    const [isEmailLogin, setIsEmailLogin] = useState<boolean>(false);

    if (isLoggedIn) {
        return <LoggedIn onLogOut={() => setIsLoggedIn(false)} />;
    } else if (isEmailLogin) {
        return <EmailLogin onBack={() => setIsEmailLogin(false)} />;
    }
    return <NotLogin onLogin={() => setIsEmailLogin(true)} />;
};
