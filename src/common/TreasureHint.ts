import TownLoader from "../core/town/TownLoader";
import Coordinate from "../util/Coordinate";

class TreasureHint {

    index?: number;
    name?: string;
    coordinate?: Coordinate;

    get commentHtml(): string {
        if (!this.coordinate!.isAvailable) {
            return "<span style='color:red'>活动图</span>";
        }
        const town = TownLoader.getTownByCoordinate(this.coordinate!);
        if (town === null) {
            return "-";
        } else {
            return "<span style='color:red'>" + town.name + " " + this.coordinate!.asText() + "</span>";
        }
    }
}

export = TreasureHint;