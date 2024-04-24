import Coordinate from "../util/Coordinate";
import _ from "lodash";

class PageProcessorContext {

    readonly #context: Map<string, string>;

    constructor() {
        this.#context = new Map<string, string>();
    }

    static whenInTown(townId?: string): PageProcessorContext {
        return new PageProcessorContext().set("_LOCATION", "T").withTownId(townId)
    }

    static whenInCastle(castleName?: string): PageProcessorContext {
        return new PageProcessorContext().set("_LOCATION", "C").withCastleName(castleName)
    }

    static whenInMap(coordinate?: Coordinate): PageProcessorContext {
        return new PageProcessorContext().set("_LOCATION", "M").withCoordinate(coordinate?.asText())
    }

    static whenInMetro(): PageProcessorContext {
        return new PageProcessorContext().set("_LOCATION", "S")
    }

    set(key: string, value: string | undefined): PageProcessorContext {
        if (value !== undefined) {
            this.#context.set(key, value);
        }
        return this;
    }

    get(key: string): string | undefined {
        return this.#context.get(key);
    }

    withTownId(townId: string | undefined): PageProcessorContext {
        if (townId !== undefined) {
            this.set("townId", townId);
        }
        return this;
    }

    withBattleCount(battleCount: string | undefined): PageProcessorContext {
        if (battleCount !== undefined) {
            this.set("battleCount", battleCount);
        }
        return this;
    }

    withCastleName(castleName: string | undefined): PageProcessorContext {
        if (castleName !== undefined) {
            this.set("castleName", castleName);
        }
        return this;
    }

    withCoordinate(coordinate: string | undefined): PageProcessorContext {
        if (coordinate !== undefined) {
            this.set("coordinate", coordinate);
        }
        return this;
    }

    withRoleLevel(roleLevel: number | undefined): PageProcessorContext {
        if (roleLevel !== undefined) {
            this.set("roleLevel", roleLevel.toString());
        }
        return this;
    }

    withRoleCareer(roleCareer: string | undefined): PageProcessorContext {
        if (roleCareer !== undefined) {
            this.set("roleCareer", roleCareer);
        }
        return this;
    }

    parseBattleCount(): number | undefined {
        const s = this.get("battleCount");
        if (s === undefined) {
            return undefined;
        }
        return _.parseInt(s);
    }

}

export = PageProcessorContext;