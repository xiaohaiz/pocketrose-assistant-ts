import StorageUtils from "../../util/StorageUtils";
import TeamMember from "./TeamMember";

class FastLoginLoader {

    static loadFastLoginConfig(code: number): {} {
        if (code < 0 || code > 49) {
            return {};
        }
        const key = "_fl_" + code;
        const s = StorageUtils.getString(key);
        if (s === "") {
            return {};
        } else {
            return JSON.parse(s);
        }
    }

    static loadFastLogin(code: number) {
        const config = FastLoginLoader.loadFastLoginConfig(code);
        if (!doCheckConfigAvailability(config)) {
            return null;
        }
        const fastLogin = new TeamMember();
        fastLogin.index = code;
        // @ts-ignore
        fastLogin.name = config.name;
        // @ts-ignore
        fastLogin.id = config.id;
        // @ts-ignore
        fastLogin.pass = config.pass;
        // @ts-ignore
        fastLogin.external = config.external;

        return fastLogin;
    }

}

function doCheckConfigAvailability(config: {}): boolean {
    // @ts-ignore
    return config.name !== undefined && config.id !== undefined && config.pass !== undefined;
}

export = FastLoginLoader;