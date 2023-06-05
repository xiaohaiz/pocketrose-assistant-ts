import _ from "lodash";
import BattleResult from "../battle/BattleResult";
import TreasureLoader from "../equipment/TreasureLoader";
import ReportUtils from "./ReportUtils";

class TreasureReportGenerator {

    readonly #dataList: BattleResult[];

    constructor(dataList: BattleResult[]) {
        this.#dataList = dataList;
    }

    generate() {
        let battleCount = 0;
        let treasureCount = 0;
        let usefulCount = 0;
        let uselessCount = 0;
        const treasures = new Map<string, number>();

        this.#dataList
            .filter(data => data.obtainBattleField === "上洞")
            .forEach(data => {
                battleCount += data.obtainTotalCount;

                const tc = data.obtainTreasureCount;
                treasureCount += tc;
                if (tc > 0) {
                    data.treasures!.forEach((count, code) => {
                        const c = treasures.get(code);
                        let nc = c === undefined ? 0 : c;
                        nc += count;
                        treasures.set(code, nc);

                        const cn = _.parseInt(code);
                        if (cn >= 32 && cn <= 49) {
                            uselessCount += count;
                        } else {
                            usefulCount += count;
                        }
                    });
                }
            });

        let html = "";
        html += "<table style='background-color:#888888;border-width:1px;border-spacing:1px;text-align:center;width:100%;margin:auto'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:yellow' colspan='4'>上洞战数：" + battleCount + "</th>"
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:green;color:white'>入手</th>"
        html += "<th style='background-color:green;color:white'>数量</th>"
        html += "<th style='background-color:green;color:white'>入手率</th>"
        html += "<th style='background-color:green;color:white'>占比</th>"
        html += "</tr>";

        html += "<tr>";
        html += "<td style='background-color:wheat'>全部入手</td>"
        html += "<td style='background-color:wheat'>" + treasureCount + "</td>"
        html += "<td style='background-color:wheat;text-align:left'>" + ReportUtils.generatePermyriadHtml(treasureCount, battleCount) + "</td>"
        html += "<td style='background-color:wheat;text-align:left'>-</td>"
        html += "</tr>";
        html += "<tr>";
        html += "<td style='background-color:wheat'>非玩具</td>"
        html += "<td style='background-color:wheat'>" + usefulCount + "</td>"
        html += "<td style='background-color:wheat;text-align:left'>" + ReportUtils.generatePermyriadHtml(usefulCount, battleCount) + "</td>"
        html += "<td style='background-color:wheat;text-align:left'>" + ReportUtils.generatePercentageHtml(usefulCount, treasureCount) + "</td>"
        html += "</tr>";
        html += "<tr>";
        html += "<td style='background-color:wheat'>玩具</td>"
        html += "<td style='background-color:wheat'>" + uselessCount + "</td>"
        html += "<td style='background-color:wheat;text-align:left'>" + ReportUtils.generatePermyriadHtml(uselessCount, battleCount) + "</td>"
        html += "<td style='background-color:wheat;text-align:left'>" + ReportUtils.generatePercentageHtml(uselessCount, treasureCount) + "</td>"
        html += "</tr>";

        for (const treasureName of TreasureLoader.allTreasureNames()) {
            const code = TreasureLoader.getCodeAsString(treasureName);
            const count = treasures.get(code);
            if (count === undefined) {
                continue;
            }
            html += "<tr>";
            if (treasureName === "好人卡") {
                html += "<td style='background-color:#F8F0E0;color:red;font-weight:bold'>" + treasureName + "</td>"
            } else {
                html += "<td style='background-color:#F8F0E0'>" + treasureName + "</td>"
            }
            html += "<td style='background-color:#F8F0E0'>" + count + "</td>"
            html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePermyriadHtml(count, battleCount) + "</td>"
            html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePercentageHtml(count, treasureCount) + "</td>"
            html += "</tr>";
        }

        html += "</tbody>";
        html += "</table>";

        return html;
    }

}

export = TreasureReportGenerator;