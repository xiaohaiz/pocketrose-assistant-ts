import _ from "lodash";
import Coordinate from "../../util/Coordinate";
import Castle from "../castle/Castle";

class CastleInformationPage {

    castleList?: Castle[];

    findByRoleName(roleName: string) {
        for (const castle of this.castleList!) {
            if (castle.owner === roleName) {
                return castle;
            }
        }
        return null;
    }

    findByCoordinate(coordinate: Coordinate | string): Castle[] {
        let c: Coordinate;
        if (coordinate instanceof Coordinate) {
            c = coordinate;
        } else {
            c = Coordinate.parse(coordinate.toString());
        }
        const cs: Castle[] = [];
        if (!this.castleList) {
            return cs;
        }
        for (const castle of this.castleList) {
            if (!castle.coordinate) {
                continue;
            }
            if (c.equals(castle.coordinate)) {
                cs.push(castle);
            }
        }
        return cs;
    }

    get coordinateList(): string[] {
        const coordinates: string[] = [];
        if (!this.castleList) {
            return coordinates;
        }
        for (const castle of this.castleList) {
            if (!castle.coordinate) {
                continue;
            }
            const s = castle.coordinate.asText();
            if (!_.includes(coordinates, s)) {
                coordinates.push(s);
            }
        }
        return coordinates;
    }
}

export = CastleInformationPage;