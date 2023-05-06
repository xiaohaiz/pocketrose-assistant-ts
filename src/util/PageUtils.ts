import Credential from "./Credential";
import Constants from "./Constants";
import StringUtils from "./StringUtils";

class PageUtils {

    static currentPageHtml(): string {
        return document.documentElement.outerHTML;
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
        $("script")
            .filter(function () {
                const src = $(this).attr("src");
                return src !== undefined && src.includes("google-analytics");
            })
            .each(function (_idx, script) {
                script.remove();
            });
    }

    static currentCredential() {
        const id = $("input:hidden[name='id']:first").val();
        const pass = $("input:hidden[name='pass']:first").val();
        return new Credential(id!.toString(), pass!.toString());
    }

    static parseCredential(pageHtml: string) {
        const id = $(pageHtml).find("input:hidden[name='id']:first").val() as string;
        const pass = $(pageHtml).find("input:hidden[name='pass']:first").val() as string;
        return new Credential(id, pass);
    }

    static generateProgressBarHTML(ratio: number) {
        if (ratio === 0) {
            return "<img src='" + Constants.POCKET_DOMAIN + "/image/bg/bar2.gif'  height='7' width='50' alt=''>";
        }
        if (ratio === 1) {
            return "<img src='" + Constants.POCKET_DOMAIN + "/image/bg/bar1.gif'  height='7' width='50' alt=''>";
        }
        const w1 = Math.min(49, Math.ceil(50 * ratio));
        const w2 = 50 - w1;
        return "<img src='" + Constants.POCKET_DOMAIN + "/image/bg/bar1.gif'  height='7' width='" + w1 + "' alt=''>" +
            "<img src='" + Constants.POCKET_DOMAIN + "/image/bg/bar2.gif'  height='7' width='" + w2 + "' alt=''>";
    }

    static findFirstRoleImageHtml() {
        let roleImage = "";
        $("img").each(function (_idx, img) {
            if (roleImage === "") {
                const src = $(img).attr("src");
                if (src !== undefined && src.startsWith(Constants.POCKET_DOMAIN + "/image/head/")) {
                    // 发现了用户头像
                    roleImage = src;
                }
            }
        });
        if (roleImage === "") {
            return null;
        } else {
            return "<img src='" + roleImage + "' width='64' height='64' id='roleImage' alt=''>";
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

    static fixCurrentPageBrokenImages() {
        if ($("img").length === 0) {
            return;
        }
        $("img")
            .filter(function () {
                const src = $(this).attr("src") as string;
                return src.startsWith("http://pocketrose.21sun.net:81/pocketrose") ||
                    src.startsWith("http://pocketrose.21sun.net/pocketrose");
            })
            .each(function (_idx, img) {
                const src = $(img).attr("src") as string;
                let s = src;
                if (src.includes("http://pocketrose.21sun.net:81/pocketrose")) {
                    s = StringUtils.substringAfter(s, "http://pocketrose.21sun.net:81/pocketrose");
                } else if (src.includes("http://pocketrose.21sun.net/pocketrose")) {
                    s = StringUtils.substringAfter(s, "http://pocketrose.21sun.net/pocketrose");
                }
                s = Constants.POCKET_DOMAIN + s;
                $(img).attr("src", s);
            });
    }

    static fixBrokenImageIfNecessary(s: string): string {
        let t = s;
        if (t.includes("http://pocketrose.21sun.net:81/pocketrose")) {
            t = t.replace("http://pocketrose.21sun.net:81/pocketrose", Constants.POCKET_DOMAIN);
        }
        if (t.includes("http://pocketrose.21sun.net/pocketrose")) {
            t = t.replace("http://pocketrose.21sun.net/pocketrose", Constants.POCKET_DOMAIN);
        }
        return t;
    }

    static convertHtmlToText(html: string) {
        const s = "<td>" + html + "</td>";
        return $(s).text();
    }

    static scrollIntoView(elementId: string) {
        document.getElementById(elementId)?.scrollIntoView();
    }
}

export = PageUtils;