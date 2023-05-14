import MessageBoard from "./MessageBoard";
import ObjectUtils from "./ObjectUtils";

class NetworkUtils {

    static sendGetRequest(cgi: string, handler?: (html: string) => void) {
        fetch(cgi, {method: "GET"})
            .then((response) => {
                if (!response.ok) {
                    MessageBoard.publishWarning("网络请求发生错误，请自行重试！");
                    throw new Error("RESPONSE was not ok");
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
            .catch((error) => {
                console.error("Error raised:", error);
            });
    }

    static sendPostRequest(cgi: string, request: {}, handler?: (html: string) => void) {
        fetch(cgi, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(request),
        })
            .then((response) => {
                if (!response.ok) {
                    MessageBoard.publishWarning("网络请求发生错误，请自行重试！");
                    throw new Error("RESPONSE was not ok");
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
            .catch((error) => {
                console.error("Error raised:", error);
            });
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
                const body = ObjectUtils.convertMapToObject(request);
                NetworkUtils.sendPostRequest(cgi, body, function (html) {
                    resolve(html);
                });
            });
        };
        return await action(cgi, request);
    }
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
            return response.arrayBuffer();
        })
        .then((arrayBuffer) => {
            const decoder = new TextDecoder("gb2312");
            const html = decoder.decode(new Uint8Array(arrayBuffer));
            if (handler !== undefined) {
                handler(html);
            }
        })
        .catch((error) => {
            __internalSendPostRequest(count + 1, cgi, request, handler);
        });
}

export = NetworkUtils;