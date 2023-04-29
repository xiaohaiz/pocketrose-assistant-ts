import TravelPlan from "./TravelPlan";
import StringUtils from "../util/StringUtils";
import Coordinate from "../util/Coordinate";
import MessageBoard from "../util/MessageBoard";

class TravelPlanBuilder {

    static initializeTravelPlan(pageHtml: string): TravelPlan {
        let s = $(pageHtml)
            .find("select[name='chara_m']")
            .find("option:last")
            .val();
        const scope = parseInt(s! as string);

        let mode = "ROOK";
        $(pageHtml).find("input:submit").each(function (_idx, input) {
            const v = $(input).val();
            const d = $(input).attr("disabled");
            if (v === "↖" && d === undefined) {
                mode = "QUEEN";
            }
        });

        let source = new Coordinate(-1, -1);
        $(pageHtml)
            .find("td")
            .each(function (_idx, td) {
                const text = $(td).text();
                if (text.includes("现在位置(") && text.endsWith(")")) {
                    const s = StringUtils.substringBetween(text, "(", ")");
                    const x = StringUtils.substringBefore(s, ",");
                    const y = StringUtils.substringAfter(s, ",");
                    source = new Coordinate(parseInt(x), parseInt(y));
                }
            });

        MessageBoard.publishMessage("移动范围：<span style='color:greenyellow'>" + scope + "</span>");
        MessageBoard.publishMessage("移动模式：<span style='color:greenyellow'>" + mode + "</span>");
        MessageBoard.publishMessage("当前坐标：<span style='color:greenyellow'>" + source.asText() + "</span>");

        const plan = new TravelPlan();
        plan.scope = scope;
        plan.mode = mode;
        plan.source = source;
        return plan;
    }

}

export = TravelPlanBuilder;