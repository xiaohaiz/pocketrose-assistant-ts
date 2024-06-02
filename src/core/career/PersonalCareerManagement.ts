import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import {PersonalStatus} from "../role/PersonalStatus";
import Role from "../role/Role";
import CareerChangeLog from "./CareerChangeLog";
import CareerChangeLogStorage from "./CareerChangeLogStorage";
import PersonalCareerManagementPage from "./PersonalCareerManagementPage";
import PersonalCareerManagementPageParser from "./PersonalCareerManagementPageParser";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import {PocketLogger} from "../../pocket/PocketLogger";
import OperationMessage from "../../util/OperationMessage";

const logger = PocketLogger.getLogger("CAREER");

class PersonalCareerManagement {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<PersonalCareerManagementPage> {
        const request = this.#credential.asRequest();
        if (this.#townId !== undefined) {
            request.set("town", this.#townId);
        }
        request.set("mode", "CHANGE_OCCUPATION");
        const response = await PocketNetwork.post("mydata.cgi", request);
        const page = PersonalCareerManagementPageParser.parse(response.html);
        response.touch();
        logger.debug("Career page loaded.", response.durationInMillis);
        return page;
    }

    async transfer(careerId: number): Promise<OperationMessage> {
        const before = await new PersonalStatus(this.#credential, this.#townId).load();
        const request = this.#credential.asRequest();
        request.set("chara", "1");
        request.set("mode", "JOB_CHANGE");
        request.set("syoku_no", careerId.toString());
        const response = await PocketNetwork.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response.html);
        // 不需要额外的清理RoleStatus缓存数据了
        const after = await new PersonalStatus(this.#credential, this.#townId).load();
        return await this.#postTransfer(before, after);
    }

    async #postTransfer(before: Role, after: Role): Promise<OperationMessage> {
        if (before.level! !== after.level! && after.level! === 1) {
            // 成功完成了转职操作
            // 否则没有转职，大概率是由于需要转职任务引发的
            const data = new CareerChangeLog();
            data.roleId = this.#credential.id;
            data.career_1 = before.career;
            data.level_1 = before.level;
            data.health_1 = before.maxHealth;
            data.mana_1 = before.maxMana;
            data.attack_1 = before.attack;
            data.defense_1 = before.defense;
            data.specialAttack_1 = before.specialAttack;
            data.specialDefense_1 = before.specialDefense;
            data.speed_1 = before.speed;
            data.career_2 = after.career;
            data.level_2 = after.level;
            data.health_2 = after.maxHealth;
            data.mana_2 = after.maxMana;
            data.attack_2 = after.attack;
            data.defense_2 = after.defense;
            data.specialAttack_2 = after.specialAttack;
            data.specialDefense_2 = after.specialDefense;
            data.speed_2 = after.speed;
            // 保存转职的记录
            await CareerChangeLogStorage.getInstance().insert(data);
            logger.debug("Career change log saved into IndexedDB.");
            return OperationMessage.success();
        }
        return OperationMessage.failure();
    }

}

export = PersonalCareerManagement;