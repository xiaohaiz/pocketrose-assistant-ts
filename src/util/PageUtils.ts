import Constants from "./Constants";
import Credential from "./Credential";
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
                // @ts-ignore
                const src = $(this).attr("src");
                return src !== undefined && (src as string).includes("google-analytics");
            })
            .each(function (_idx, script) {
                script.remove();
            });
    }

    static currentCredential() {
        const id = $("input:hidden[name='id']:last").val();
        const pass = $("input:hidden[name='pass']:last").val();
        return new Credential(id!.toString(), pass!.toString());
    }

    static parseCredential(pageHtml: string) {
        const id = $(pageHtml).find("input:hidden[name='id']:last").val() as string;
        const pass = $(pageHtml).find("input:hidden[name='pass']:last").val() as string;
        return new Credential(id, pass);
    }

    static generateProgressBarHTML(ratio: number, width?: number) {
        const px = (width === undefined || width < 10) ? 50 : width;
        if (ratio === 0) {
            return "<img src='" + Constants.POCKET_DOMAIN + "/image/bg/bar2.gif'  height='7' width='" + px + "' alt=''>";
        }
        if (ratio === 1) {
            return "<img src='" + Constants.POCKET_DOMAIN + "/image/bg/bar1.gif'  height='7' width='" + px + "' alt=''>";
        }
        const w1 = Math.min(px - 1, Math.ceil(px * ratio));
        const w2 = px - w1;
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

    static toggleBlueOrGrey(id: string) {
        if (PageUtils.isColorGrey(id)) {
            PageUtils.changeColorBlue(id)
        } else if (PageUtils.isColorBlue(id)) {
            PageUtils.changeColorGrey(id)
        }
    }

    static toggleColor(id: string,
                       g2b: (() => void) | undefined,
                       b2g: (() => void) | undefined) {
        if (PageUtils.isColorGrey(id)) {
            PageUtils.changeColorBlue(id)
            if (g2b !== undefined) g2b()
        } else if (PageUtils.isColorBlue(id)) {
            PageUtils.changeColorGrey(id)
            if (b2g !== undefined) b2g()
        }
    }

    static changeColorBlue(id: string) {
        $("#" + id).css("color", "blue");
    }

    static changeColorGrey(id: string) {
        $("#" + id).css("color", "grey");
    }

    static isColorBlue(id: string) {
        const color = $("#" + id).css("color");
        return color.toString() === "rgb(0, 0, 255)"
    }

    static isColorGrey(id: string) {
        const color = $("#" + id).css("color");
        return color.toString() === "rgb(128, 128, 128)"
    }

    static generateInvisibleButton(backgroundColor: string) {
        return "<input type='button' " +
            "value='　　' " +
            "style='background-color:" + backgroundColor + ";border-width:0' " +
            "tabindex='-1'>";
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

    static generateReturnTownForm(credential: Credential) {
        let html = "";
        // noinspection HtmlUnknownTarget
        html += "<form action='status.cgi' method='post'>";
        html += "<input type='hidden' name='id' value='" + credential.id + "'>";
        html += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
        html += "<input type='hidden' name='mode' value='STATUS'>";
        html += "<input type='submit' id='returnTown'>";
        html += "</form>";
        return html;
    }

    static generateEquipmentManagementForm(credential: Credential) {
        let html = "";
        // noinspection HtmlUnknownTarget
        html += "<form action='mydata.cgi' method='post'>";
        html += "<input type='hidden' name='id' value='" + credential.id + "'>";
        html += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
        html += "<input type='hidden' name='mode' value='USE_ITEM'>";
        html += "<input type='submit' id='openEquipmentManagement'>";
        html += "</form>";
        return html;
    }

    static generatePetManagementForm(credential: Credential) {
        let html = "";
        // noinspection HtmlUnknownTarget
        html += "<form action='mydata.cgi' method='post'>";
        html += "<input type='hidden' name='id' value='" + credential.id + "'>";
        html += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
        html += "<input type='hidden' name='mode' value='PETSTATUS'>";
        html += "<input type='submit' id='openPetManagement'>";
        html += "</form>";
        return html;
    }

    static generateCareerManagementForm(credential: Credential) {
        let html = "";
        // noinspection HtmlUnknownTarget
        html += "<form action='mydata.cgi' method='post'>";
        html += "<input type='hidden' name='id' value='" + credential.id + "'>";
        html += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
        html += "<input type='hidden' name='mode' value='CHANGE_OCCUPATION'>";
        html += "<input type='submit' id='openCareerManagement'>";
        html += "</form>";
        return html;
    }

    static generateFullRecoveryForm(credential: Credential) {
        let form = "";
        // noinspection HtmlUnknownTarget
        form += "<form action='town.cgi' method='post'>";
        form += "<input type='hidden' name='id' value='" + credential.id + "'>";
        form += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
        form += "<input type='hidden' name='mode' value='RECOVERY'>";
        form += "<input type='submit' id='fullRecovery'>";
        form += "</form>";
        return form;
    }

    static generateItemShopForm(credential: Credential, townId: string) {
        let form = "";
        // noinspection HtmlUnknownTarget
        form += "<form action='town.cgi' method='post'>";
        form += "<input type='hidden' name='id' value='" + credential.id + "'>";
        form += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
        form += "<input type='hidden' name='town' value='" + townId + "'>";
        form += "<input type='hidden' name='con_str' value='50'>";
        form += "<input type='hidden' name='mode' value='ITEM_SHOP'>";
        form += "<input type='submit' id='openItemShop'>";
        form += "</form>";
        return form;
    }

    static generateGemHouseForm(credential: Credential, townId?: string) {
        let form = "";
        // noinspection HtmlUnknownTarget
        form += "<form action='town.cgi' method='post'>";
        form += "<input type='hidden' name='id' value='" + credential.id + "'>";
        form += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
        if (townId) {
            form += "<input type='hidden' name='town' value='" + townId + "'>";
        }
        form += "<input type='hidden' name='con_str' value='50'>";
        form += "<input type='hidden' name='mode' value='BAOSHI_SHOP'>";
        form += "<input type='submit' id='openGemHouse'>";
        form += "</form>";
        return form;
    }

    static disableElement(elementId: string) {
        const element = $("#" + elementId);
        if (element.length > 0) {
            element.prop("disabled", true);
        }
    }

    static enableElement(elementId: string) {
        const element = $("#" + elementId);
        if (element.length > 0) {
            element.prop("disabled", false);
        }
    }

    static disablePageInteractiveElements(includeSubmit?: boolean) {
        $("input")
            .filter((_idx, e) => {
                const t = $(e).attr("type");
                if (t === undefined) return true;
                const s = t.toLowerCase();
                return s === "button" ||
                    s === "text" ||
                    s === "radio" ||
                    s === "checkbox" ||
                    (s === "submit" && includeSubmit !== undefined && includeSubmit);
            })
            .each((_idx, e) => {
                $(e).prop("disabled", true);
            });
        $("button").prop("disabled", true);
        $("select").prop("disabled", true);
        $("textarea").prop("disabled", true);
    }

    static triggerClick(elementId: string) {
        const element = $("#" + elementId);
        if (element.length > 0) {
            element.trigger("click");
        }
    }
}

export = PageUtils;