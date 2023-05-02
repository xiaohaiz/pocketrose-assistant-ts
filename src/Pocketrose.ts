import ProcessorManager from "./processor/ProcessorManager";
import StringUtils from "./util/StringUtils";

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
        processorManager.lookupProcessor(cgi)?.process();
    }
});
