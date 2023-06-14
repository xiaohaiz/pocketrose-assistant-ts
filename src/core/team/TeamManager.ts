import StorageUtils from "../../util/StorageUtils";
import TeamMemberLoader from "./TeamMemberLoader";

class TeamManager {

    static isMaster(id: string): boolean {
        const masterId = StorageUtils.getInt("_tm_", -1);
        if (masterId < 0) {
            // No team master specified, return false
            return false;
        }
        const member = TeamMemberLoader.loadTeamMember(masterId);
        if (member === null) {
            // Specified masterId not configured, return false
            return false;
        }
        return id === member.id;
    }

}

export = TeamManager;