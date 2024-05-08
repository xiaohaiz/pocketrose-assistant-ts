import NetworkUtils from "../util/NetworkUtils";
import {PocketLogger} from "./PocketLogger";

const logger = PocketLogger.getLogger("NETWORK");

class PocketNetwork {

    static async post(cgi: string, request: Map<string, string>): Promise<PostResponse> {
        const start = Date.now();
        let msg = "Send POST request to [" + cgi + "]";
        const mode = request.get("mode");
        if (mode) {
            msg += " (mode=" + mode + ")";
        }
        logger.debug(msg);
        const html = await NetworkUtils.post(cgi, request);
        const end = Date.now();
        const response = new PostResponse(start, end, html);
        msg = "Receive POST response (length=" + html.length + ")";
        logger.debug(msg, response.durationInMillis);
        return response;
    }

    static async get(cgi: string): Promise<GetResponse> {
        const start = Date.now();
        let msg = "Send GET request to [" + cgi + "]";
        logger.debug(msg);
        const html = await NetworkUtils.get(cgi);
        const end = Date.now();
        const response = new GetResponse(start, end, html);
        msg = "Receive GET response (length=" + html.length + ")";
        logger.debug(msg, response.durationInMillis);
        return response;
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

export {PocketNetwork, PostResponse, GetResponse};