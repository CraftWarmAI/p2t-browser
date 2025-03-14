declare module "*.module.css";
declare module "whatwg-fetch";
declare module "*.less";
declare module "*.json";
declare module "*.png";
declare module "*.jpg";

interface SendMessage {
    type: string;
    data?: any;
}

interface AmazonKeyWordRequestQuery {
    asin: string;
    limit?: number;
}

interface AmazonKeyWordResult {
    [s: string]: any;
    code?: number;
    result?: any;
}

interface InstalledDetails {
    reason: string;
    [s: string]: any;
}

interface UploadEventTrackData {
    event: string;
    extra: {
        [s: string]: any;
    };
}
