import StringUtils from "./util/StringUtils";
import BattleRequestInterceptor from "./interceptor/internal/BattleRequestInterceptor";
import PersonalRequestInterceptor from "./interceptor/internal/PersonalRequestInterceptor";
import StatusRequestInterceptor from "./interceptor/internal/StatusRequestInterceptor";
import TownRequestInterceptor from "./interceptor/internal/TownRequestInterceptor";

$(function () {
    if (!location.href.includes("pocketrose")) {
        return
    }
    pocketrose()
})

const interceptorList = [
    new BattleRequestInterceptor(),
    new PersonalRequestInterceptor(),
    new StatusRequestInterceptor(),
    new TownRequestInterceptor()
]

function pocketrose() {
    $(function () {
        const request = StringUtils.substringAfterLast(location.href, "/")
        let interceptor = null
        for (const it of interceptorList) {
            if (it.cgi === request) {
                interceptor = it
                break
            }
        }
        if (interceptor !== null) {
            interceptor.process()
        }
    });
}