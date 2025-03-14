import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import browser from "webextension-polyfill";
const enUS = require("../config/i18/en_US.json");
const zhCN = require("../config/i18/zh_CN.json");
const { is_build, node_env } = process.env;
const lang = browser.i18n.getUILanguage();

const resources = {
    "en-US": {
        translation: enUS,
    },
    "zh-CN": {
        translation: zhCN,
    },
};

i18n.use(initReactI18next).init({
    resources,
    debug: node_env === "dev" && is_build === "false",
    lng: lang === "zh-CN" ? "zh-CN" : "en-US",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
