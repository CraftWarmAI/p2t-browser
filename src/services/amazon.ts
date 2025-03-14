import { request } from "@src/utils/request";

/**
 * 获取商品关键词
 * @param body
 * @returns
 */
export function getAmazonGoodsKeyword(body: GetAmazonGoodsKeywordBody) {
    const { asin, limit = 10 } = body;
    return request(`/api/v1/amazon/keyword/?asin=${asin}&limit=${limit}`);
}

/**
 * 爬取亚马逊商品详情页面
 * @param body
 * @returns
 */
export function crawlingAmazonPage(body: CrawlingAmazonBody) {
    return request(`/api/v1/crawling/amazon/`, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

/**
 * 获取亚马逊相似商品
 * @param body
 * @returns
 */
export function getAmazonSimilarAsin(body: GetAmazonSimilarAsin) {
    const { asin, limit = 10 } = body;
    return request(`/api/v1/amazon/similar_asin/?asin=${asin}&limit=${limit}`, {
        method: "GET",
    });
}

/**
 * 获取亚马逊相似标签
 * @param body
 * @returns
 */
export function getAmazonRecommendKeyword(body: GetAmazonSimilarAsin) {
    const { asin, limit = 10 } = body;
    return request(`/api/v1/amazon/recommend_keyword/?asin=${asin}&limit=${limit}`, {
        method: "GET",
    });
}

/**
 * 获取亚马逊相似商品
 * @param body
 * @returns
 */
export function getKeywordAnalysis(body: GetKeywordAnalysis) {
    const { target } = body;
    return request(`/api/v1/amazon/keyword_analysis/?target=${target}`, {
        method: "GET",
    });
}

/**
 * 获取亚马逊商品详情
 * @param body
 * @returns
 */
export function getAsinDetail(body: any) {
    const { asin: target } = body;
    return request(`/api/v1/amazon/asin/?target=${target}`, {
        method: "GET",
    });
}
