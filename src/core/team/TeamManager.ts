import StorageUtils from "../../util/StorageUtils";
import TeamMember from "./TeamMember";
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

    static loadMembers() {
        const memberList: TeamMember[] = [];
        for (let i = 0; i < 50; i++) {
            const member = TeamMemberLoader.loadTeamMember(i);
            if (member !== null) {
                memberList.push(member);
            }
        }
        return memberList;
    }

    static loadInternalIds() {
        return TeamManager.loadMembers().filter(it => !it.external).map(it => it.id!);
    }
}

export = TeamManager;