import Credential from "../util/Credential";
import Coordinate from "../util/Coordinate";

class TravelPlan {

    credential?: Credential;
    scope?: number;
    mode?: string;
    source?: Coordinate;
    destination?: Coordinate;

}

export = TravelPlan;