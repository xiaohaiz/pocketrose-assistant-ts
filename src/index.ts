$(function () {
    if (!location.href.includes("pocketrose")) {
        return
    }
    pocketrose()
})

const interceptorList = [
    new BattleRequestInterceptor(),
    new PersonalRequestInterceptor()
]

function pocketrose() {
    $(document).ready(function () {
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