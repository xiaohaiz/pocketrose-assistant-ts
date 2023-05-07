import ProcessorManager from "./processor/ProcessorManager";
import StringUtils from "./util/StringUtils";
import PageInterceptorManager from "./interceptor/PageInterceptorManager";

const pageInterceptorManager = new PageInterceptorManager();
const processorManager = new ProcessorManager();

$(function () {
    const href = location.href;
    if (href.includes("pocketrose")) {
        let cgi = href;
        if (cgi.includes("/")) {
            cgi = StringUtils.substringAfterLast(location.href, "/");
        }
        if (cgi.includes("?")) {
            cgi = StringUtils.substringBefore(cgi, "?");
        }
        const interceptor = pageInterceptorManager.lookupInterceptor(cgi);
        if (interceptor != null) {
            interceptor.intercept();
        } else {
            processorManager.lookupProcessor(cgi)?.process();
        }
    }
});
