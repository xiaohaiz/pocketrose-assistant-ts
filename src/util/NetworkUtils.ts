import MessageBoard from "./MessageBoard";
import PocketUtils from "./PocketUtils";

class NetworkUtils {

    static sendGetRequest(cgi: string, handler?: (html: string) => void) {
        __internalSendGetRequest(0, cgi, handler);
    }

    static sendPostRequest(cgi: string, request: {}, handler?: (html: string) => void) {
        __internalSendPostRequest(0, cgi, request, handler);
    }

    static async get(cgi: string): Promise<string> {
        return await (() => {
            return new Promise<string>(resolve => {
                NetworkUtils.sendGetRequest(cgi, function (html) {
                    resolve(html);
                });
            });
        })();
    }

    static async post(cgi: string, request: Map<string, string>): Promise<string> {
        const action = (cgi: string, request: Map<string, string>) => {
            return new Promise<string>(resolve => {
                const body = PocketUtils.asRequest(request);
                NetworkUtils.sendPostRequest(cgi, body, function (html) {
                    resolve(html);
                });
            });
        };
        return await action(cgi, request);
    }
}

function __internalSendGetRequest(count: number, cgi: string, handler?: (html: string) => void) {
    if (count === 3) {
        MessageBoard.publishWarning("请求" + cgi + "达到最大重试次数，依然失败，看起来口袋出问题了，请联系GM！");
        return;
    }
    fetch(cgi, {method: "GET"})
        .then((response) => {
            if (!response.ok) {
                MessageBoard.publishWarning("请求" + cgi + "时返回错误[status=" + response.status + "]，尝试重试！");
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
        MessageBoard.publishWarning("请求" + cgi + "达到最大重试次数，依然失败，看起来口袋出问题了，请联系GM！");
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
                MessageBoard.publishWarning("请求" + cgi + "时返回错误[status=" + response.status + "]，尝试重试！");
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

export = NetworkUtils;