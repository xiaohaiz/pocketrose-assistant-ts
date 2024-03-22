import Credential from "../../util/Credential";
import PersonalPetManagementPage from "./PersonalPetManagementPage";
import PersonalPetManagement from "./PersonalPetManagement";
import PersonalEquipmentManagementPage from "../equipment/PersonalEquipmentManagementPage";
import PersonalEquipmentManagement from "../equipment/PersonalEquipmentManagement";
import Pet from "./Pet";
import GoldenCage from "./GoldenCage";
import CastleInformation from "../dashboard/CastleInformation";
import CastleRanch from "./CastleRanch";
import _ from "lodash";
import RolePetStatusStorage from "./RolePetStatusStorage";

/**
 * ============================================================================
 * 宠物状态更新管理器。
 * ============================================================================
 */
class PetStatusManager {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    #equipmentPage?: PersonalEquipmentManagementPage;
    #petPage?: PersonalPetManagementPage;


    withEquipmentPage(value: PersonalEquipmentManagementPage | undefined): PetStatusManager {
        this.#equipmentPage = value;
        return this;
    }

    withPetPage(value: PersonalPetManagementPage | undefined): PetStatusManager {
        this.#petPage = value;
        return this;
    }

    async #initializeEquipmentPage() {
        if (!this.#equipmentPage) {
            this.#equipmentPage = await new PersonalEquipmentManagement(this.#credential).open();
        }
    }

    async #initializePetPage() {
        if (!this.#petPage) {
            this.#petPage = await new PersonalPetManagement(this.#credential).open();
        }
    }

    async updatePetStatus() {
        const allPetList: Pet[] = [];

        // 解析身上的宠物
        await this.#initializePetPage();
        for (const pet of this.#petPage!.petList!) {
            pet.location = "P";
            allPetList.push(pet);
        }

        // 解析黄金笼子中的宠物
        await this.#initializeEquipmentPage();
        const goldenCage = this.#equipmentPage!.findGoldenCage();
        if (goldenCage) {
            const cagePage = await new GoldenCage(this.#credential).open(goldenCage.index!);
            for (const pet of cagePage.petList!) {
                pet.location = "C";
                allPetList.push(pet);
            }
        }

        // 解析城堡牧场中的宠物
        const roleName = this.#equipmentPage!.role!.name!;
        const castlePage = await new CastleInformation().open();
        const castle = castlePage.findByRoleName(roleName);
        if (castle) {
            const ranchPage = await new CastleRanch(this.#credential).enter();
            for (const pet of ranchPage.ranchPetList!) {
                pet.location = "R";
                allPetList.push(pet);
            }
        }

        // 转换数据格式
        const petStatusList: string[] = [];
        for (const pet of allPetList) {
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
            s += pet.location;
            petStatusList.push(s);
        }

        // 写入数据库
        const storage = RolePetStatusStorage.getInstance();
        await storage.write(this.#credential.id, JSON.stringify(petStatusList));
    }
}

export = PetStatusManager;