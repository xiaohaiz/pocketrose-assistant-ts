import Constants from "../../util/Constants";
import StorageUtils from "../../util/StorageUtils";
import TeamMember from "./TeamMember";

class TeamMemberLoader {

    static loadTeamMember(index: number | null | undefined) {
        if (!index) return null;
        const config = _load(index);
        const member = new TeamMember();
        member.index = index;
        // @ts-ignore
        member.name = config.name;
        // @ts-ignore
        member.id = config.id;
        // @ts-ignore
        member.pass = config.pass;
        // @ts-ignore
        member.external = config.external;
        return member.available ? member : null;
    }

    static loadTeamMembers() {
        const memberList: TeamMember[] = [];
        for (let i = 0; i < Constants.MAX_TEAM_MEMBER_COUNT; i++) {
            const member = TeamMemberLoader.loadTeamMember(i);
            if (member) memberList.push(member);
        }
        return memberList;
    }

}

function _load(index: number | null | undefined): {} {
    if (!index) return {};
    if (index < 0 || index >= Constants.MAX_TEAM_MEMBER_COUNT) return {};
    const key = "_fl_" + index;
    const s = StorageUtils.getString(key);
    return s === "" ? {} : JSON.parse(s);
}

export = TeamMemberLoader;