import Credential from "./Credential";
import DOMAIN from "./Constants";

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
        div.find("a").attr("href", "javascript:void(0)");
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
        return new Credential(id!.toString(), pass!.toString());
    }

    static generateProgressBarHTML(ratio: number) {
        if (ratio === 0) {
            return "<img src='" + DOMAIN + "/image/bg/bar2.gif'  height='7' width='50' alt=''>";
        }
        if (ratio === 1) {
            return "<img src='" + DOMAIN + "/image/bg/bar1.gif'  height='7' width='50' alt=''>";
        }
        const w1 = Math.min(49, Math.ceil(50 * ratio));
        const w2 = 50 - w1;
        return "<img src='" + DOMAIN + "/image/bg/bar1.gif'  height='7' width='" + w1 + "' alt=''>" +
            "<img src='" + DOMAIN + "/image/bg/bar2.gif'  height='7' width='" + w2 + "' alt=''>";
    }

    static findFirstUserImageHtml() {
        let userImage = "";
        $("img").each(function (_idx, img) {
            if (userImage === "") {
                const src = $(img).attr("src");
                if (src !== undefined && src.startsWith(DOMAIN + "/image/head/")) {
                    // 发现了用户头像
                    userImage = src;
                }
            }
        });
        if (userImage === "") {
            return undefined;
        } else {
            return "<img src='" + userImage + "' width='64' height='64' id='userImage' alt=''>";
        }
    }

    static isColorBlue(id: string) {
        const color = $("#" + id).css("color");
        return color.toString() === "rgb(0, 0, 255)"
    }

    static isColorGrey(id: string) {
        const color = $("#" + id).css("color");
        return color.toString() === "rgb(128, 128, 128)"
    }
}

export = PageUtils;