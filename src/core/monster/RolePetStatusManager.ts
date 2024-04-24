import Credential from "../../util/Credential";
import PersonalPetManagementPage from "./PersonalPetManagementPage";
import GoldenCagePage from "./GoldenCagePage";
import CastleRanchPage from "./CastleRanchPage";
import Pet from "./Pet";
import _ from "lodash";
import {RolePetStatus, RolePetStatusReport} from "./RolePetStatus";
import {RolePetStatusStorage} from "./RolePetStatusStorage";

class RolePetStatusManager {

    private readonly credential: Credential;

    constructor(credential: Credential) {
        this.credential = credential;
    }

    async updatePersonalPetStatus(page?: PersonalPetManagementPage) {
        if (page === undefined) return;
        const petList = page.petList;
        if (petList === undefined) return;
        await this.writePetStatus("P", petList);
    }

    async updateGoldenCagePetStatus(page?: GoldenCagePage) {
        if (page === undefined) return;
        const petList = page.petList;
        if (petList === undefined) return;
        await this.writePetStatus("C", petList);
    }

    async updateCastleRanchPetStatus(page?: CastleRanchPage) {
        if (page === undefined) return;
        const petList = page.ranchPetList;
        if (petList === undefined) return;
        await this.writePetStatus("R", petList);
    }

    private async writePetStatus(location: string, petList: Pet[]) {
        const petStatusList: string[] = [];
        for (const pet of petList) {
            let s = "";
            s += _.escape(pet.name);
            s += "/";
            s += pet.gender;
            s += "/";
            s += pet.level;
            s += "/";
            s += pet.maxHealth;
            s += "/";
            s += pet.attack;
            s += "/";
            s += pet.defense;
            s += "/";
            s += pet.specialAttack;
            s += "/";
            s += pet.specialDefense;
            s += "/";
            s += pet.speed;
            s += "/";
            s += location;
            petStatusList.push(s);
        }
        const record = new RolePetStatus();
        record.id = location + "/" + this.credential.id;
        record.updateTime = new Date().getTime();
        record.json = JSON.stringify(petStatusList);
        await RolePetStatusStorage.write(record);
    }

    static async loadRolePetStatusReports(roleIdList: string[]): Promise<Map<string, RolePetStatusReport>> {
        const reports = new Map<string, RolePetStatusReport>();
        if (_.isEmpty(roleIdList)) return reports;
        for (const roleId of roleIdList) {
            const report = await RolePetStatusManager.loadRoleStatusReport(roleId);
            reports.set(report.roleId!, report);
        }
        return reports;
    }

    static async loadRoleStatusReport(roleId: string): Promise<RolePetStatusReport> {

        const report = new RolePetStatusReport();
        report.roleId = roleId;
        report.petList = [];

        const personal = await RolePetStatusStorage.load("P", roleId);
        RolePetStatusManager.mergeStatusReport(personal, report);

        const cage = await RolePetStatusStorage.load("C", roleId);
        RolePetStatusManager.mergeStatusReport(cage, report);

        const ranch = await RolePetStatusStorage.load("R", roleId);
        RolePetStatusManager.mergeStatusReport(ranch, report);

        report.petList = Pet.sortPetList(report.petList!);
        return report;
    }

    private static mergeStatusReport(source: RolePetStatus | undefined | null,
                                     target: RolePetStatusReport) {
        if (source === undefined || source === null) return;
        _.forEach(JSON.parse(source.json!) as string[])
            .map(it => Pet.parse(it))
            .forEach(it => target.petList!.push(it));
    }
}

export {RolePetStatusManager};