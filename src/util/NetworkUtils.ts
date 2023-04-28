class NetworkUtils {

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