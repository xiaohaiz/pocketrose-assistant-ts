import PageProcessorContext from "./PageProcessorContext";
import Credential from "../util/Credential";
import PageUtils from "../util/PageUtils";
import TownLoader from "../core/town/TownLoader";
import Town from "../core/town/Town";
import LocationModeTown from "../core/location/LocationModeTown";
import LocationModeCastle from "../core/location/LocationModeCastle";
import LocationModeMap from "../core/location/LocationModeMap";
import LocationModeMetro from "../core/location/LocationModeMetro";
import Coordinate from "../util/Coordinate";

abstract class StatefulPageProcessor {

    readonly credential: Credential;
    readonly context: PageProcessorContext;

    protected constructor(credential: Credential, context: PageProcessorContext) {
        this.credential = credential;
        this.context = context;
    }

    process() {
        PageUtils.fixCurrentPageBrokenImages();
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();

        this.doProcess().then();
    }

    protected async doProcess() {
    }

    protected get townId(): string | undefined {
        return this.context.get("townId");
    }

    protected get town(): Town | null {
        return TownLoader.load(this.townId);
    }

    protected get castleName(): string | undefined {
        return this.context.get("castleName");
    }

    protected get roleLocation(): string | undefined {
        const loc = this.context.get("_LOCATION")
        if (loc === "T") {
            const townId = this.context.get("townId")!
            const town = TownLoader.load(townId)
            return town === null ? undefined : town.name
        }
        if (loc === "C") {
            return this.context.get("castleName")
        }
        if (loc === "M") {
            return this.context.get("coordinate")
        }
        if (loc === "S") {
            return "地铁区域"
        }
        // No '_LOCATION' specified.
        const townId = this.context.get("townId")
        if (townId !== undefined) {
            const town = TownLoader.load(townId)
            return town === null ? undefined : town.name
        }
        const castleName = this.context.get("castleName")
        if (castleName !== undefined) {
            return castleName;
        }
        const coordinate = this.context.get("coordinate")
        if (coordinate !== undefined) {
            return coordinate
        }
        return undefined
    }

    protected createLocationMode(): LocationModeTown | LocationModeCastle | LocationModeMap | LocationModeMetro | undefined {
        const loc = this.context.get("_LOCATION");
        if (loc === undefined) return undefined;
        switch (loc) {
            case "T":
                const townId = this.context.get("townId")!
                return new LocationModeTown(townId);
            case "C":
                const castleName = this.context.get("castleName")!;
                return new LocationModeCastle(castleName);
            case "M":
                const coordinate = this.context.get("coordinate")!;
                return new LocationModeMap(Coordinate.parse(coordinate));
            case "S":
                return new LocationModeMetro();
            default:
                return undefined;
        }
    }
}

export = StatefulPageProcessor;