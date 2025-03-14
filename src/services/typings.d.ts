interface CrawlingAmazonBody {
    target: {
        type: string;
        asin: string;
        html: string;
    };
}

interface GetAmazonGoodsKeywordBody {
    asin: string;
    limit?: number;
}

interface GetAmazonSimilarAsin {
    asin: string;
    limit?: number;
}

interface GetKeywordAnalysis {
    target: string;
}

interface EventTrackBody {
    ip: string;
    event: string;
    project: string;
    extra: any;
}
