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

    static generateInvisibleButton(backgroundColor: string) {
        return "<input type='button' " +
            "value='　　' " +
            "style='background-color:" + backgroundColor + ";border-width:0'>";
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

    static generateReturnMapForm(credential: Credential) {
        let html = "";
        // noinspection HtmlUnknownTarget
        html += "<form action='status.cgi' method='post'>";
        html += "<input type='hidden' name='id' value='" + credential.id + "'>";
        html += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
        html += "<input type='hidden' name='mode' value='STATUS'>";
        html += "<input type='submit' id='returnMap'>";
        html += "</form>";
        return html;
    }

    static generateReturnCastleForm(credential: Credential) {
        let html = "";
        // noinspection HtmlUnknownTarget
        html += "<form action='castlestatus.cgi' method='post'>";
        html += "<input type='hidden' name='id' value='" + credential.id + "'>";
        html += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
        html += "<input type='hidden' name='mode' value='CASTLESTATUS'>";
        html += "<input type='submit' id='returnCastle'>";
        html += "</form>";
        return html;
    }

    static loadButtonStyle(code: number) {
        const key = code.toString();
        // @ts-ignore
        if (BUTTON_STYLES[key] !== undefined) {
            let s = $("style[type='text/css']").html();
            s = s.replace("-->", "\n");
            // @ts-ignore
            s += BUTTON_STYLES[key];
            s += "-->";
            $("style[type='text/css']").html(s);
        }
    }
}

const BUTTON_STYLES: {} = {
    "5": ".button-5 {\n" +
        "  align-items: center;\n" +
        "  background-clip: padding-box;\n" +
        "  background-color: #fa6400;\n" +
        "  border: 1px solid transparent;\n" +
        "  border-radius: .25rem;\n" +
        "  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;\n" +
        "  box-sizing: border-box;\n" +
        "  color: #fff;\n" +
        "  cursor: pointer;\n" +
        "  display: inline-flex;\n" +
        "  font-size: 16px;\n" +
        "  font-weight: 600;\n" +
        "  justify-content: center;\n" +
        "  line-height: 1.25;\n" +
        "  margin: 0;\n" +
        "  min-height: 3rem;\n" +
        "  padding: calc(.875rem - 1px) calc(1.5rem - 1px);\n" +
        "  position: relative;\n" +
        "  text-decoration: none;\n" +
        "  transition: all 250ms;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "  vertical-align: baseline;\n" +
        "  width: auto;\n" +
        "}\n" +
        "\n" +
        ".button-5:hover,\n" +
        ".button-5:focus {\n" +
        "  background-color: #fb8332;\n" +
        "  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;\n" +
        "}\n" +
        "\n" +
        ".button-5:hover {\n" +
        "  transform: translateY(-1px);\n" +
        "}\n" +
        "\n" +
        ".button-5:active {\n" +
        "  background-color: #c85000;\n" +
        "  box-shadow: rgba(0, 0, 0, .06) 0 2px 4px;\n" +
        "  transform: translateY(0);\n" +
        "}\n",
    "8": ".button-8 {\n" +
        "  background-color: #e1ecf4;\n" +
        "  border-radius: 3px;\n" +
        "  border: 1px solid #7aa7c7;\n" +
        "  box-shadow: rgba(255, 255, 255, .7) 0 1px 0 0 inset;\n" +
        "  box-sizing: border-box;\n" +
        "  color: #39739d;\n" +
        "  cursor: pointer;\n" +
        "  display: inline-block;\n" +
        "  font-size: 13px;\n" +
        "  font-weight: 400;\n" +
        "  line-height: 1.15385;\n" +
        "  margin: 0;\n" +
        "  outline: none;\n" +
        "  padding: 8px .8em;\n" +
        "  position: relative;\n" +
        "  text-align: center;\n" +
        "  text-decoration: none;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "  vertical-align: baseline;\n" +
        "  white-space: nowrap;\n" +
        "}\n" +
        "\n" +
        ".button-8:hover,\n" +
        ".button-8:focus {\n" +
        "  background-color: #b3d3ea;\n" +
        "  color: #2c5777;\n" +
        "}\n" +
        "\n" +
        ".button-8:focus {\n" +
        "  box-shadow: 0 0 0 4px rgba(0, 149, 255, .15);\n" +
        "}\n" +
        "\n" +
        ".button-8:active {\n" +
        "  background-color: #a0c7e4;\n" +
        "  box-shadow: none;\n" +
        "  color: #2c5777;\n" +
        "}\n",
    "24": ".button-24 {\n" +
        "  background: #FF4742;\n" +
        "  border: 1px solid #FF4742;\n" +
        "  border-radius: 6px;\n" +
        "  box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;\n" +
        "  box-sizing: border-box;\n" +
        "  color: #FFFFFF;\n" +
        "  cursor: pointer;\n" +
        "  display: inline-block;\n" +
        "  font-size: 16px;\n" +
        "  font-weight: 800;\n" +
        "  line-height: 16px;\n" +
        "  min-height: 40px;\n" +
        "  outline: 0;\n" +
        "  padding: 12px 14px;\n" +
        "  text-align: center;\n" +
        "  text-rendering: geometricprecision;\n" +
        "  text-transform: none;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "  vertical-align: middle;\n" +
        "}\n" +
        "\n" +
        ".button-24:hover,\n" +
        ".button-24:active {\n" +
        "  background-color: initial;\n" +
        "  background-position: 0 0;\n" +
        "  color: #FF4742;\n" +
        "}\n" +
        "\n" +
        ".button-24:active {\n" +
        "  opacity: .5;\n" +
        "}\n",
    "30": ".button-30 {\n" +
        "  align-items: center;\n" +
        "  appearance: none;\n" +
        "  background-color: #FCFCFD;\n" +
        "  border-radius: 4px;\n" +
        "  border-width: 0;\n" +
        "  box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,rgba(45, 35, 66, 0.3) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset;\n" +
        "  box-sizing: border-box;\n" +
        "  color: #36395A;\n" +
        "  cursor: pointer;\n" +
        "  display: inline-flex;\n" +
        "  height: 48px;\n" +
        "  justify-content: center;\n" +
        "  line-height: 1;\n" +
        "  list-style: none;\n" +
        "  overflow: hidden;\n" +
        "  padding-left: 16px;\n" +
        "  padding-right: 16px;\n" +
        "  position: relative;\n" +
        "  text-align: left;\n" +
        "  text-decoration: none;\n" +
        "  transition: box-shadow .15s,transform .15s;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "  white-space: nowrap;\n" +
        "  will-change: box-shadow,transform;\n" +
        "  font-size: 18px;\n" +
        "}\n" +
        "\n" +
        ".button-30:focus {\n" +
        "  box-shadow: #D6D6E7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;\n" +
        "}\n" +
        "\n" +
        ".button-30:hover {\n" +
        "  box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;\n" +
        "  transform: translateY(-2px);\n" +
        "}\n" +
        "\n" +
        ".button-30:active {\n" +
        "  box-shadow: #D6D6E7 0 3px 7px inset;\n" +
        "  transform: translateY(2px);\n" +
        "}",
    "32": ".button-32 {\n" +
        "  background-color: #fff000;\n" +
        "  border-radius: 12px;\n" +
        "  color: #000;\n" +
        "  cursor: pointer;\n" +
        "  font-weight: bold;\n" +
        "  padding: 10px 15px;\n" +
        "  text-align: center;\n" +
        "  transition: 200ms;\n" +
        "  width: 100%;\n" +
        "  box-sizing: border-box;\n" +
        "  border: 0;\n" +
        "  font-size: 16px;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "}\n" +
        "\n" +
        ".button-32:not(:disabled):hover,\n" +
        ".button-32:not(:disabled):focus {\n" +
        "  outline: 0;\n" +
        "  background: #f4e603;\n" +
        "  box-shadow: 0 0 0 2px rgba(0,0,0,.2), 0 3px 8px 0 rgba(0,0,0,.15);\n" +
        "}\n" +
        "\n" +
        ".button-32:disabled {\n" +
        "  filter: saturate(0.2) opacity(0.5);\n" +
        "  -webkit-filter: saturate(0.2) opacity(0.5);\n" +
        "  cursor: not-allowed;\n" +
        "}\n",
    "33": ".button-33 {\n" +
        "  background-color: #c2fbd7;\n" +
        "  border-radius: 100px;\n" +
        "  box-shadow: rgba(44, 187, 99, .2) 0 -25px 18px -14px inset,rgba(44, 187, 99, .15) 0 1px 2px,rgba(44, 187, 99, .15) 0 2px 4px,rgba(44, 187, 99, .15) 0 4px 8px,rgba(44, 187, 99, .15) 0 8px 16px,rgba(44, 187, 99, .15) 0 16px 32px;\n" +
        "  color: green;\n" +
        "  cursor: pointer;\n" +
        "  display: inline-block;\n" +
        "  padding: 7px 20px;\n" +
        "  text-align: center;\n" +
        "  text-decoration: none;\n" +
        "  transition: all 250ms;\n" +
        "  border: 0;\n" +
        "  font-size: 16px;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "}\n" +
        "\n" +
        ".button-33:hover {\n" +
        "  box-shadow: rgba(44,187,99,.35) 0 -25px 18px -14px inset,rgba(44,187,99,.25) 0 1px 2px,rgba(44,187,99,.25) 0 2px 4px,rgba(44,187,99,.25) 0 4px 8px,rgba(44,187,99,.25) 0 8px 16px,rgba(44,187,99,.25) 0 16px 32px;\n" +
        "  transform: scale(1.05) rotate(-1deg);\n" +
        "}\n",
    "35": ".button-35 {\n" +
        "  align-items: center;\n" +
        "  background-color: #fff;\n" +
        "  border-radius: 12px;\n" +
        "  box-shadow: transparent 0 0 0 3px,rgba(18, 18, 18, .1) 0 6px 20px;\n" +
        "  box-sizing: border-box;\n" +
        "  color: #121212;\n" +
        "  cursor: pointer;\n" +
        "  display: inline-flex;\n" +
        "  flex: 1 1 auto;\n" +
        "  font-family: Inter,sans-serif;\n" +
        "  font-size: 1.2rem;\n" +
        "  font-weight: 700;\n" +
        "  justify-content: center;\n" +
        "  line-height: 1;\n" +
        "  margin: 0;\n" +
        "  outline: none;\n" +
        "  padding: 1rem 1.2rem;\n" +
        "  text-align: center;\n" +
        "  text-decoration: none;\n" +
        "  transition: box-shadow .2s,-webkit-box-shadow .2s;\n" +
        "  white-space: nowrap;\n" +
        "  border: 0;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "}\n" +
        "\n" +
        ".button-35:hover {\n" +
        "  box-shadow: #121212 0 0 0 3px, transparent 0 0 0 0;\n" +
        "}\n",
};

export = PageUtils;