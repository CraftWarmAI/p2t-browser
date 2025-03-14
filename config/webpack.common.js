const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const manifest_config = require("./manifest_config.json");

// 打包的浏览器环境
const browser = process.env.BROWSER || "chrome";
const node_env = process.env.NODE_ENV || "dev";
const build = process.env.BUILD || false;

let BASE_PATH = path.join(__dirname, "../dist/js");

if (build) {
    BASE_PATH = path.join(__dirname, `../build/${browser}/${node_env}/js`);
}

module.exports = {
    entry: {
        backgroundPage: path.join(__dirname, "../src/backgroundPage.ts"),
        contentScriptMain: path.join(__dirname, "../src/content_scripts/main.tsx"),
        popup: path.join(__dirname, "../src/popup/index.tsx"),
    },
    output: {
        path: BASE_PATH,
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.tsx?$/,
                use: "ts-loader",
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader", "postcss-loader"],
            },
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                        },
                    },
                    "less-loader",
                ],
            },
            {
                test: /\.module.css$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                        },
                    },
                    "postcss-loader",
                ],
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            outputPath: "../",
                            publicPath: "../",
                            limit: 81920,
                            name: "images/[name]_[hash:7].[ext]",
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            "@src": path.resolve(__dirname, "../src/"),
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: "process/browser",
        }),
        new webpack.DefinePlugin({
            "process.env": {
                node_env: JSON.stringify(process.env.NODE_ENV || "dev"),
                is_build: JSON.stringify(process.env.BUILD || false),
            },
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: "public/common/*.*",
                    to: "../[name][ext]",
                },
                {
                    from: "public/common/_locales/en/*.*",
                    to: "../_locales/en/[name][ext]",
                },
                {
                    from: "public/common/_locales/zh_CN/*.*",
                    to: "../_locales/zh_CN/[name][ext]",
                },
                {
                    from: `public/${browser}/${node_env}/*.*`,
                    to: "../[name][ext]",
                    transform: {
                        transformer(content, absoluteFrom) {
                            if (absoluteFrom.endsWith("manifest.json")) {
                                const contentObj = JSON.parse(content.toString("utf8"));
                                Object.keys(manifest_config).forEach((key) => {
                                    if (!contentObj[key]) {
                                        contentObj[key] = manifest_config[key];
                                    }
                                });
                                return Promise.resolve(Buffer.from(JSON.stringify(contentObj)));
                            }
                        },
                    },
                },
            ],
        }),
    ],
};
