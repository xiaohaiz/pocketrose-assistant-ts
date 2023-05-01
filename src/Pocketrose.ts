import RequestInterceptorManager from "./interceptor/RequestInterceptorManager";

const interceptorManager = new RequestInterceptorManager();

$(function () {
    const href = location.href;
    if (href.includes("pocketrose")) {
        interceptorManager.lookupInterceptor(href)?.process();
    }
});
