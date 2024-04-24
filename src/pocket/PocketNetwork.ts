import NetworkUtils from "../util/NetworkUtils";

class PocketNetwork {

    static async post(cgi: string, request: Map<string, string>): Promise<string> {
        return await NetworkUtils.post(cgi, request);
    }

    static async get(cgi: string): Promise<string> {
        return await NetworkUtils.get(cgi);
    }

}

export {PocketNetwork};