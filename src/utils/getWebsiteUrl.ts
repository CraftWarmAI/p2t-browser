export function getWebsiteUrl() {
    const { is_build = true, node_env = "prod" } = process.env;
    if (!is_build) {
        return "http://localhost:8000";
    } else if (node_env === "dev") {
        return "https://dimsim.dev.behye.cn";
    } else {
        return "https://dimsim.behye.com";
    }
}
