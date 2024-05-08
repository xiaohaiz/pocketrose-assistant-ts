import PageUtils from "../util/PageUtils";
import LocationModeTown from "../core/location/LocationModeTown";
import LocationModeCastle from "../core/location/LocationModeCastle";
import LocationModeMap from "../core/location/LocationModeMap";
import LocationModeMetro from "../core/location/LocationModeMetro";
import Credential from "../util/Credential";

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
        html += "<span> </span>";
        html += "<span id='_pocket_page_role_location' style='background-color:red;color:white;font-size:80%'>" + (location ?? "") + "</span>";
        html += "</td>";
        html += "<td style='text-align:center;white-space:nowrap'>";
        html += "<span id='_pocket_page_timer' style='background-color:wheat;color:navy;font-weight:bold'></span>";
        html += "<span> </span>";
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
        $(".C_StatelessElement").prop("disabled", true);
    }

    static enableStatelessElements() {
        $(".C_pocket_StatelessElement").prop("disabled", false);
        $(".C_StatelessElement").prop("disabled", false);
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

class PocketFormGenerator {

    private readonly credential: Credential;
    private readonly locationMode: LocationModeTown | LocationModeCastle | LocationModeMap | LocationModeMetro;

    constructor(credential: Credential, locationMode: LocationModeTown | LocationModeCastle | LocationModeMap | LocationModeMetro) {
        this.credential = credential;
        this.locationMode = locationMode;
    }

    generateReturnFormHTML() {
        let html = "";
        if (this.locationMode instanceof LocationModeTown ||
            this.locationMode instanceof LocationModeMap ||
            this.locationMode instanceof LocationModeMetro) {
            // noinspection HtmlUnknownTarget
            html += "<form action='status.cgi' method='post'>";
            html += "<input type='hidden' name='id' value='" + this.credential.id + "'>";
            html += "<input type='hidden' name='pass' value='" + this.credential.pass + "'>"
            html += "<input type='hidden' name='mode' value='STATUS'>";
            html += "<input type='submit' id='_pocket_ReturnSubmit'>";
            html += "</form>";
        } else {
            // noinspection HtmlUnknownTarget
            html += "<form action='castlestatus.cgi' method='post'>";
            html += "<input type='hidden' name='id' value='" + this.credential.id + "'>";
            html += "<input type='hidden' name='pass' value='" + this.credential.pass + "'>"
            html += "<input type='hidden' name='mode' value='CASTLESTATUS'>";
            html += "<input type='submit' id='_pocket_ReturnSubmit'>";
            html += "</form>";
        }
        return html;
    }

    generateLeaveForm(): string | undefined {
        if (this.locationMode instanceof LocationModeTown ||
            this.locationMode instanceof LocationModeCastle) {
            let html = "";
            // noinspection HtmlUnknownTarget
            html += "<form action='map.cgi' method='post'>";
            html += "<input type='hidden' name='id' value='" + this.credential.id + "'>";
            html += "<input type='hidden' name='pass' value='" + this.credential.pass + "'>";
            html += "<input type='hidden' name='navi' value='on'>";
            html += "<input type='hidden' name='out' value='1'>";
            html += "<input type='hidden' name='mode' value='MAP_MOVE'>";
            html += "<input type='submit' id='_pocket_LeaveSubmit'>";
            html += "</form>";
            return html;
        }
        return undefined;
    }

    generateEquipmentForm(): string {
        let html = "";
        // noinspection HtmlUnknownTarget
        html += "<form action='mydata.cgi' method='post'>";
        html += "<input type='hidden' name='id' value='" + this.credential.id + "'>";
        html += "<input type='hidden' name='pass' value='" + this.credential.pass + "'>"
        html += "<input type='hidden' name='mode' value='USE_ITEM'>";
        html += "<input type='submit' id='_pocket_EquipmentSubmit'>";
        html += "</form>";
        return html;
    }

    generateGemForm(): string | undefined {
        if (this.locationMode instanceof LocationModeTown) {
            let form = "";
            // noinspection HtmlUnknownTarget
            form += "<form action='town.cgi' method='post'>";
            form += "<input type='hidden' name='id' value='" + this.credential.id + "'>";
            form += "<input type='hidden' name='pass' value='" + this.credential.pass + "'>"
            form += "<input type='hidden' name='town' value='" + this.locationMode.townId + "'>";
            form += "<input type='hidden' name='con_str' value='50'>";
            form += "<input type='hidden' name='mode' value='BAOSHI_SHOP'>";
            form += "<input type='submit' id='_pocket_GemSubmit'>";
            form += "</form>";
            return form;
        }
        return undefined;
    }
}

export {PocketPage, PocketFormGenerator};