import TreasureHint from "../../common/TreasureHint";
import Coordinate from "../../util/Coordinate";

class TreasureHintParser {

    static parseTreasureHintList(pageHtml: string): TreasureHint[] {
        const treasureHintList: TreasureHint[] = [];
        $(pageHtml)
            .find("input:checkbox")
            .each(function (_idx, checkbox) {
                const t0 = $(checkbox).parent();
                const t1 = $(t0).next();
                const t2 = $(t1).next();
                const t3 = $(t2).next();
                const t4 = $(t3).next();
                const t5 = $(t4).next();

                const treasureHint = new TreasureHint();
                treasureHint.index = parseInt($(checkbox).val() as string);
                treasureHint.name = $(t2).text();
                const x = parseInt($(t4).text());
                const y = parseInt($(t5).text());
                treasureHint.coordinate = new Coordinate(x, y);
                treasureHintList.push(treasureHint);
            });
        return treasureHintList;
    }

}

export = TreasureHintParser;