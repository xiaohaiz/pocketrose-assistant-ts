import PageUtils from "./PageUtils";

class PocketPage {

    static scrollIntoTitle() {
        PageUtils.scrollIntoView("_pocket_page_title");
    }

    static generatePageHeaderHTML(title: string, location?: string): string {
        let html = "";
        html += "<table style='background-color:navy;margin:auto;width:100%;border-spacing:0;border-width:0'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td id='_pocket_page_title' style='color:yellowgreen;text-align:left;font-weight:bold;font-size:150%;width:100%'>";
        html += title;
        if (location !== undefined) {
            html += "<span> </span>";
            html += "<span style='background-color:red;color:white;font-size:80%'>" + location + "</span>";
        }
        html += "</td>";
        html += "<td id='_pocket_page_command' style='text-align:right;white-space:nowrap'>";
        html += "</td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='_pocket_page_extension' colspan='2'>";
        html += "<div id='_pocket_page_extension_0'></div>";
        html += "<div id='_pocket_page_extension_1'></div>";
        html += "<div id='_pocket_page_extension_2'></div>";
        html += "<div id='_pocket_page_extension_3'></div>";
        html += "<div id='_pocket_page_extension_4'></div>";
        html += "<div id='_pocket_page_extension_5'></div>";
        html += "<div id='_pocket_page_extension_6'></div>";
        html += "<div id='_pocket_page_extension_7'></div>";
        html += "<div id='_pocket_page_extension_8'></div>";
        html += "<div id='_pocket_page_extension_9'></div>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>"
        return html;
    }

    static disableStatelessElements() {
        $(".C_pocket_StatelessElement").prop("disabled", true);
    }

    static enableStatelessElements() {
        $(".C_pocket_StatelessElement").prop("disabled", false);
    }

    static generateGemSelectionHTML(elementId: string, includeDragonBall?: boolean) {
        let html = "";
        html += "<select id='" + elementId + "'>";
        html += "<option value='ALL'>所有宝石</option>";
        html += "<option value='POWER' style='color:blue'>威力宝石</option>";
        html += "<option value='LUCK' style='color:red'>幸运宝石</option>";
        html += "<option value='WEIGHT' style='color:green'>重量宝石</option>";
        html += "<option value='SEVEN'>七心宝石</option>";
        if (includeDragonBall) {
            html += "<option value='DRAGON'>龙珠</option>";
        }
        html += "</select>";
        return html;
    }

    static generateGemCountHTML(elementId: string) {
        let html = "";
        html += "<select id='" + elementId + "'>";
        html += "<option value='0'>宝石数量(自动)</option>";
        for (let i = 1; i <= 20; i++) {
            html += "<option value='" + i + "'>" + i + "</option>";
        }
        html += "</select>";
        return html;
    }
}

export {PocketPage};