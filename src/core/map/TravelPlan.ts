import Coordinate from "../../util/Coordinate";
import Credential from "../../util/Credential";

class TravelPlan {

    credential?: Credential;
    scope?: number;
    mode?: string;
    source?: Coordinate;
    destination?: Coordinate;

}

export = TravelPlan;