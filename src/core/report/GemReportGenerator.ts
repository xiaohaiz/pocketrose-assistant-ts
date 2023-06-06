import _ from "lodash";
import BattleResult from "../battle/BattleResult";
import TreasureLoader from "../equipment/TreasureLoader";
import ReportUtils from "./ReportUtils";

class GemReportGenerator {

    readonly #dataList: BattleResult[];

    constructor(dataList: BattleResult[]) {
        this.#dataList = dataList;
    }

    generate() {
        let battleCount = 0;
        let gemCount = 0;
        const gems = new Map<string, number>();

        this.#dataList
            .filter(data => data.obtainBattleField === "十二宫")
            .forEach(data => {
                battleCount += data.obtainTotalCount;

                const gc = data.obtainGemCount;
                gemCount += gc;
                if (gc > 0) {
                    data.treasures!.forEach((count, code) => {
                        const cn = _.parseInt(code);
                        if (cn === 51 || cn === 52 || cn === 53) {
                            const c = gems.get(code);
                            let nc = c === undefined ? 0 : c;
                            nc += count;
                            gems.set(code, nc);
                        }
                    });
                }
            });

        let html = "";
        html += "<table style='background-color:#888888;border-width:1px;border-spacing:1px;text-align:center;width:100%;margin:auto'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:yellow' colspan='4'>十二宫战数：" + battleCount + "</th>"
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:green;color:white'>入手</th>"
        html += "<th style='background-color:green;color:white'>数量</th>"
        html += "<th style='background-color:green;color:white'>入手率</th>"
        html += "<th style='background-color:green;color:white'>占比</th>"
        html += "</tr>";

        html += "<tr>";
        html += "<td style='background-color:wheat'>全部入手</td>"
        html += "<td style='background-color:wheat'>" + gemCount + "</td>"
        html += "<td style='background-color:wheat;text-align:left'>" + ReportUtils.generatePermyriadHtml(gemCount, battleCount) + "</td>"
        html += "<td style='background-color:wheat;text-align:left'>-</td>"
        html += "</tr>";

        for (const treasureName of TreasureLoader.allTreasureNames()) {
            const code = TreasureLoader.getCodeAsString(treasureName);
            const count = gems.get(code);
            if (count === undefined) {
                continue;
            }
            html += "<tr>";
            html += "<td style='background-color:#F8F0E0'>" + treasureName + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + count + "</td>"
            html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePermyriadHtml(count, battleCount) + "</td>"
            html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePercentageHtml(count, gemCount) + "</td>"
            html += "</tr>";
        }

        html += "</tbody>";
        html += "</table>";

        return html;
    }

}

export = GemReportGenerator;