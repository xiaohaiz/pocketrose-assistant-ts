import Credential from "./Credential";

export = PageUtils;

class PageUtils {

    static currentPageHtml(): string {
        return $("body:first").html();
    }

    static currentPageText(): string {
        return $("body:first").text();
    }

    /**
     * Remove unused hyper links from last div element.
     */
    static removeUnusedHyperLinks() {
        const div = $("div:last");
        div.find("a:first").attr("href", "javascript:void(0)");
        div.find("a:eq(1)").attr("href", "javascript:void(0)");
        div.find("a").attr("tabIndex", "-1");
    }

    /**
     * Remove last google-analytics script
     */
    static removeGoogleAnalyticsScript() {
        $("script:last").remove();
    }

    static currentCredential() {
        const id = $("input:hidden[name='id']:first").val();
        const pass = $("input:hidden[name='pass']:first").val();
        if (id === undefined || pass === undefined) {
            throw new Error("No id/pass found");
        }
        return new Credential(id.toString(), pass.toString());
    }

}