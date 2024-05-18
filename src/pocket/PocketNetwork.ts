import {PocketLogger} from "./PocketLogger";
import Constants from "../util/Constants";
import MessageBoard from "../util/MessageBoard";

const logger = PocketLogger.getLogger("NETWORK");

class PocketNetwork {

    static async get(cgi: string): Promise<GetResponse> {
        const start = Date.now();
        let msg = "Send GET request to [" + cgi + "]";
        logger.debug(msg);
        const html = await PocketNetwork.internalGet(cgi);
        const end = Date.now();
        const response = new GetResponse(start, end, html);
        msg = "Receive GET response (length=" + html.length + ")";
        logger.debug(msg, response.durationInMillis);
        return response;
    }

    static async post(cgi: string, request: Map<string, string>): Promise<PostResponse> {
        const start = Date.now();
        let msg = "Send POST request to [" + cgi + "]";
        const mode = request.get("mode");
        if (mode) {
            msg += " (mode=" + mode + ")";
        }
        logger.debug(msg);
        const html = await PocketNetwork.internalPost(cgi, request);
        const end = Date.now();
        const response = new PostResponse(start, end, html);
        msg = "Receive POST response (length=" + html.length + ")";
        logger.debug(msg, response.durationInMillis);
        return response;
    }

    private static async internalGet(cgi: string): Promise<string> {
        return await (() => {
            return new Promise<string>(resolve => {
                PocketNetwork.sendGetRequest(cgi, function (html) {
                    resolve(html);
                });
            });
        })();
    }

    private static async internalPost(cgi: string, request: Map<string, string>): Promise<string> {
        return await (() => {
            return new Promise<string>(resolve => {
                const body = asRequest(request);
                PocketNetwork.sendPostRequest(cgi, body, function (html) {
                    resolve(html);
                });
            });
        })();
    }

    private static sendGetRequest(cgi: string, handler?: (html: string) => void) {
        __internalSendGetRequest(0, cgi, handler);
    }

    private static sendPostRequest(cgi: string, request: {}, handler?: (html: string) => void) {
        __internalSendPostRequest(0, cgi, request, handler);
    }
}

class PostResponse {

    startTime: number;
    endTime: number;
    html: string;

    constructor(startTime: number, endTime: number, html: string) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.html = html;
    }

    touch() {
        this.endTime = Date.now();
    }

    get durationInMillis() {
        return this.endTime - this.startTime;
    }

}

class GetResponse {

    startTime: number;
    endTime: number;
    html: string;

    constructor(startTime: number, endTime: number, html: string) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.html = html;
    }

    touch() {
        this.endTime = Date.now();
    }

    get durationInMillis() {
        return this.endTime - this.startTime;
    }

}

function __internalSendGetRequest(count: number, cgi: string, handler?: (html: string) => void) {
    if (count === Constants.MAX_NETWORK_FAILURE_RETRIES) {
        logger.warn("请求" + cgi + "达到最大重试次数，依然失败，看起来口袋出问题了，请联系GM！");
        return;
    }
    fetch(cgi, {method: "GET"})
        .then((response) => {
            if (!response.ok) {
                logger.warn("请求" + cgi + "时返回错误[status=" + response.status + "]，尝试重试！");
                throw new Error("RESPONSE was not ok");
            }
            if (count !== 0) {
                MessageBoard.publishMessage("第" + count + "次重试请求" + cgi + "成功。");
            }
            return response.arrayBuffer();
        })
        .then((arrayBuffer) => {
            const decoder = new TextDecoder("gb2312");
            const html = decoder.decode(new Uint8Array(arrayBuffer));
            if (handler !== undefined) {
                handler(html);
            }
        })
        .catch(() => {
            __internalSendGetRequest(count + 1, cgi, handler);
        });
}

function __internalSendPostRequest(count: number, cgi: string, request: {}, handler?: (html: string) => void) {
    if (count === 3) {
        logger.warn("请求" + cgi + "达到最大重试次数，依然失败，看起来口袋出问题了，请联系GM！");
        return;
    }
    fetch(cgi, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(request),
    })
        .then((response) => {
            if (!response.ok) {
                // @ts-ignore
                const mode = request.mode;
                if (mode) {
                    logger.warn("请求" + cgi + "时返回错误[mode=" + mode + ",status=" + response.status + "]，尝试重试！");
                } else {
                    logger.warn("请求" + cgi + "时返回错误[status=" + response.status + "]，尝试重试！");
                }
                throw new Error("RESPONSE was not ok");
            }
            if (count !== 0) {
                MessageBoard.publishMessage("第" + count + "次重试请求" + cgi + "成功。");
            }
            return response.arrayBuffer();
        })
        .then((arrayBuffer) => {
            const decoder = new TextDecoder("gb2312");
            const html = decoder.decode(new Uint8Array(arrayBuffer));
            if (handler !== undefined) {
                handler(html);
            }
        })
        .catch(() => {
            __internalSendPostRequest(count + 1, cgi, request, handler);
        });
}

function asRequest(map: Map<string, string>) {
    const result = {};
    map.forEach(function (value, key) {
        // @ts-ignore
        result[key] = value;
    });
    return result;
}

export {PocketNetwork, PostResponse, GetResponse};