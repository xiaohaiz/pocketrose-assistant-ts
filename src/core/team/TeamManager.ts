import FastLogin from "../../common/FastLogin";
import StorageUtils from "../../util/StorageUtils";
import FastLoginLoader from "./FastLoginLoader";

class TeamManager {

    static isMaster(id: string): boolean {
        const masterId = StorageUtils.getInt("_tm_", -1);
        if (masterId < 0) {
            // No team master specified, return false
            return false;
        }
        const member = FastLoginLoader.loadFastLogin(masterId);
        if (member === null) {
            // Specified masterId not configured, return false
            return false;
        }
        return id === member.id;
    }

    static loadMembers() {
        const memberList: FastLogin[] = [];
        for (let i = 0; i < 50; i++) {
            const member = FastLoginLoader.loadFastLogin(i);
            if (member !== null) {
                memberList.push(member);
            }
        }
        return memberList;
    }

}

export = TeamManager;