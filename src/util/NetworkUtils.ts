import MessageBoard from "./MessageBoard";

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
}

export = NetworkUtils;