import RequestInterceptor from "./RequestInterceptor";
import BattleRequestInterceptor from "./internal/BattleRequestInterceptor";
import CastleRequestInterceptor from "./internal/CastleRequestInterceptor";
import CastleStatusRequestInterceptor from "./internal/CastleStatusRequestInterceptor";
import PersonalRequestInterceptor from "./internal/PersonalRequestInterceptor";
import StatusRequestInterceptor from "./internal/StatusRequestInterceptor";
import TownRequestInterceptor from "./internal/TownRequestInterceptor";
import StringUtils from "../util/StringUtils";

class RequestInterceptorManager {

    #buffer: Map<string, RequestInterceptor>;

    constructor() {
        this.#buffer = new Map<string, RequestInterceptor>();

        const interceptorList: RequestInterceptor[] = [
            new BattleRequestInterceptor(),
            new CastleRequestInterceptor(),
            new CastleStatusRequestInterceptor(),
            new PersonalRequestInterceptor(),
            new StatusRequestInterceptor(),
            new TownRequestInterceptor()
        ];

        for (const interceptor of interceptorList) {
            this.#buffer.set(interceptor.cgi, interceptor);
        }
    }

    lookupInterceptor(href: string) {
        let request = href;
        if (request.includes("/")) {
            request = StringUtils.substringAfterLast(location.href, "/");
        }
        if (request.includes("?")) {
            request = StringUtils.substringBefore(request, "?");
        }
        return this.#buffer.get(request);
    }
}


export = RequestInterceptorManager;