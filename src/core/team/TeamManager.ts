import StorageUtils from "../../util/StorageUtils";
import FastLoginLoader from "./FastLoginLoader";

class TeamManager {

    static isMaster(id: string): boolean {
        const masterId = StorageUtils.getInt("_tm_", -1);
        if (masterId < 0) {
            // No team master specified, return false
            return false;
        }
        const config = FastLoginLoader.loadFastLogin(masterId);
        if (config === null) {
            // Specified masterId not configured, return false
            return false;
        }
        return id === config.id;
    }

}

export = TeamManager;