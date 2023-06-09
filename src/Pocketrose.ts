import PageInterceptorManager from "./interceptor/PageInterceptorManager";
import StringUtils from "./util/StringUtils";

const pageInterceptorManager = new PageInterceptorManager();

$(() => {
    const href = location.href;
    if (href.includes("pocketrose")) {
        let cgi = href;
        if (cgi.includes("/")) {
            cgi = StringUtils.substringAfterLast(location.href, "/");
        }
        if (cgi.includes("?")) {
            cgi = StringUtils.substringBefore(cgi, "?");
        }
        pageInterceptorManager.lookupInterceptor(cgi)?.intercept();
    }
});