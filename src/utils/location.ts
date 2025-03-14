import pageKey from "@src/config/pageKey";

/**
 * 获取当前页面
 * @param urlParams
 * @returns
 */
export function getPageSource(urlParams?: string) {
    let url: string = urlParams || "";
    if (!urlParams && window) {
        url = window.location.href;
    } else if (!urlParams && !window) {
        console.log("无法获取window对象，需传入 url:string 参数");
        return false;
    }
    url = url.split("?")[0];

    const regMap: { [s: string]: RegExp } = {
        [pageKey.amazonGoods]: /^https\:\/\/www.amazon.com[\s\S]*\/(product|dp)\/[\da-zA-Z]+/,
    };

    const activeKey = Object.keys(regMap).find((key) => {
        return regMap[key].test(url);
    });

    return activeKey || null;
}

/**
 * 获取亚马逊商品 asin
 * @param url
 * @returns
 */
export function getAmazonGoodsAsin(urlParams?: string) {
    let url: string = urlParams || "";
    if (!urlParams && window) {
        url = window.location.href;
    } else if (!urlParams && !window) {
        console.log("无法获取window对象，需传入 url:string 参数");
        return "";
    }
    url = url.split("?")[0];

    const reg = /^https\:\/\/www.amazon.com[\s\S]*\/(dp|product)\/(\S.{9})/;
    const matched = url.match(reg);
    if (matched) {
        return matched[matched.length - 1];
    } else {
        return "";
    }
}
