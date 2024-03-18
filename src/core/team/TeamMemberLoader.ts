import Constants from "../../util/Constants";
import StorageUtils from "../../util/StorageUtils";
import TeamMember from "./TeamMember";

class TeamMemberLoader {

    static loadTeamMember(index: number | null | undefined) {
        if (index === null || index === undefined) return null;
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
        member.master = config.master;
        // @ts-ignore
        member.external = config.external;
        // @ts-ignore
        member.warehouse = config.warehouse;
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

    static loadInternalIds() {
        return TeamMemberLoader.loadTeamMembers().filter(it => !it.external).map(it => it.id!);
    }

    static isMaster(id: string | null | undefined) {
        if (!id) return false;
        const member = TeamMemberLoader.loadTeamMembers().find(it => it.id === id);
        if (!member) return false;
        return member.master !== undefined && member.master;
    }

    static loadTeamMembersAsMap(includeExternal?: boolean): Map<string, TeamMember> {
        const members = new Map<string, TeamMember>();
        TeamMemberLoader.loadTeamMembers()
            .filter(it => includeExternal || !it.external)
            .forEach(it => members.set(it.id!, it));
        return members;
    }
}

function _load(index: number | null | undefined): {} {
    if (index === null || index === undefined) return {};
    if (index < 0 || index >= Constants.MAX_TEAM_MEMBER_COUNT) return {};
    const key = "_fl_" + index;
    const s = StorageUtils.getString(key);
    return s === "" ? {} : JSON.parse(s);
}

export = TeamMemberLoader;