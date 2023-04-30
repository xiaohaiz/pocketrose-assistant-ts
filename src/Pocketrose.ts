import StringUtils from "./util/StringUtils";
import BattleRequestInterceptor from "./interceptor/internal/BattleRequestInterceptor";
import PersonalRequestInterceptor from "./interceptor/internal/PersonalRequestInterceptor";
import StatusRequestInterceptor from "./interceptor/internal/StatusRequestInterceptor";
import TownRequestInterceptor from "./interceptor/internal/TownRequestInterceptor";
import CastleRequestInterceptor from "./interceptor/internal/CastleRequestInterceptor";
import CastleStatusRequestInterceptor from "./interceptor/internal/CastleStatusRequestInterceptor";
import RequestInterceptor from "./interceptor/RequestInterceptor";

$(function () {
    if (!location.href.includes("pocketrose")) {
        return;
    }
    pocketrose();
})

const interceptorList: RequestInterceptor[] = [
    new BattleRequestInterceptor(),
    new CastleRequestInterceptor(),
    new CastleStatusRequestInterceptor(),
    new PersonalRequestInterceptor(),
    new StatusRequestInterceptor(),
    new TownRequestInterceptor()
]

function pocketrose() {
    $(function () {
        let request = StringUtils.substringAfterLast(location.href, "/")
        if (request.includes("?")) {
            request = StringUtils.substringBefore(request, "?");
        }
        let interceptor = null;
        for (const it of interceptorList) {
            if (it.cgi === request) {
                interceptor = it;
                break;
            }
        }
        if (interceptor !== null) {
            interceptor.process();
        }
    });
}