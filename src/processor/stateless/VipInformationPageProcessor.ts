import StatelessPageProcessor from "../StatelessPageProcessor";
import VipInformationPageParser from "../../core/information/VipInformationPageParser";
import PageUtils from "../../util/PageUtils";
import {VipInformation, VipInformationPage} from "../../core/information/VipInformationPage";
import _ from "lodash";
import Constants from "../../util/Constants";

class VipInformationPageProcessor extends StatelessPageProcessor {

    protected async doProcess(): Promise<void> {
        await this.render(await this.initialize());
    }

    private async initialize() {
        return VipInformationPageParser.parse(PageUtils.currentPageHtml());
    }

    private async render(page: VipInformationPage) {
        const list = page.informationList!;
        if (list.length === 0) return;

        const table = $("body:first > div:first > table:first").removeAttr("width");
        const tableBody = table.find("> tbody:first").html("");

        const groupCount = _.ceil(list.length / 10);
        for (let group = 0; group < groupCount; group++) {
            let html = "<tr style='text-align:center;background-color:#EEEEEE'>";
            for (let i = 0; i < 10; i++) {
                const index = group * 10 + i;
                let information: VipInformation | undefined = undefined;
                if (index < list.length) {
                    information = list[index];
                }
                html += "<td style='width:64px;height:64px'>";
                if (information) {
                    const src = Constants.POCKET_DOMAIN + "/image/head/" + information.image;
                    html += "<img src='" + src + "' alt='" + information.code + "' " +
                        "width='64' height='64' title='" + information.race + "'>";
                }
                html += "</td>";
            }
            html += "</tr>";
            html += "<tr style='text-align:center;background-color:#CCCCCC'>";
            for (let i = 0; i < 10; i++) {
                const index = group * 10 + i;
                let information: VipInformation | undefined = undefined;
                if (index < list.length) {
                    information = list[index];
                }
                html += "<th style='width:64px'>";
                if (information) {
                    html += information.code!;
                }
                html += "</th>";
            }
            html += "</tr>";
            tableBody.append($(html));
        }
    }
}

export = VipInformationPageProcessor;