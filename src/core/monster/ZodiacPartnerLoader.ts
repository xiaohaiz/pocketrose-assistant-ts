import Credential from "../../util/Credential";
import ZodiacPartner from "./ZodiacPartner";
import SetupLoader from "../config/SetupLoader";
import Pet from "./Pet";
import OperationMessage from "../../util/OperationMessage";
import PersonalPetManagement from "./PersonalPetManagement";
import PersonalEquipmentManagement from "../equipment/PersonalEquipmentManagement";
import GoldenCage from "./GoldenCage";
import MessageBoard from "../../util/MessageBoard";
import PersonalPetManagementPage from "./PersonalPetManagementPage";

class ZodiacPartnerLoader {

    readonly #credential: Credential;
    readonly #partner?: ZodiacPartner;

    constructor(credential: Credential) {
        this.#credential = credential;
        this.#partner = SetupLoader.loadZodiacPartner(credential.id);
    }

    available() {
        return this.#partner !== undefined;
    }

    isZodiacPartner(pet: Pet | undefined) {
        if (!this.#partner) return false;
        if (!pet) return false;
        if (pet.name !== this.#partner.name) return false;
        if (pet.level !== this.#partner.level) return false;
        if (pet.maxHealth !== this.#partner.maxHealth) return false;
        if (pet.attack !== this.#partner.attack) return false;
        if (pet.defense !== this.#partner.defense) return false;
        if (pet.specialAttack !== this.#partner.specialAttack) return false;
        if (pet.specialDefense !== this.#partner.specialDefense) return false;
        if (pet.speed !== this.#partner.speed) return false;
        return true;
    }

    async load(initializePetPage?: PersonalPetManagementPage): Promise<OperationMessage> {
        if (!this.available()) {
            return OperationMessage.failure();
        }
        MessageBoard.publishMessage("自动召唤【十二宫战斗伴侣】......");
        let petPage = initializePetPage;
        if (petPage === undefined) {
            petPage = await new PersonalPetManagement(this.#credential).open();
        }
        let partnerPet = this.#findZodiacPet(petPage.petList);
        if (partnerPet) {
            MessageBoard.publishMessage("找到了【十二宫战斗伴侣】。");
            // 在身上找到了战斗伴侣
            if (partnerPet.using) {
                MessageBoard.publishWarning("【十二宫战斗伴侣】当前使用中，忽略。");
                // Zodiac partner is currently using, ignore and return.
                return OperationMessage.success();
            }
            await new PersonalPetManagement(this.#credential).set(partnerPet.index!);
            MessageBoard.publishMessage("【十二宫战斗伴侣】成功设置！");
            const message = OperationMessage.success();
            message.doRefresh = true;
            return message;
        }

        // 身上没有找到，试试从黄金笼子里面找
        if (petPage.petList && petPage.petList.length === 3) {
            MessageBoard.publishWarning("身上没有多余的宠物位，忽略。");
            // 身上已经满了，忽略。
            return OperationMessage.failure();
        }
        const equipmentPage = await new PersonalEquipmentManagement(this.#credential).open();
        const goldenCage = equipmentPage.findGoldenCage();
        if (!goldenCage) {
            MessageBoard.publishWarning("没有找到黄金笼子，忽略。");
            // 没有找到黄金笼子，忽略。
            return OperationMessage.failure();
        }
        const cagePage = await new GoldenCage(this.#credential).open(goldenCage.index!);
        partnerPet = this.#findZodiacPet(cagePage.petList);
        if (!partnerPet) {
            MessageBoard.publishWarning("黄金笼子中没有找到【十二宫战斗伴侣】，忽略。");
            // 黄金笼子中没有找到战斗伴侣，忽略
            return OperationMessage.failure();
        }
        // 从黄金笼子中取出
        await new GoldenCage(this.#credential).takeOut(partnerPet.index!);
        MessageBoard.publishMessage("【十二宫战斗伴侣】从黄金笼子中取出。");

        petPage = await new PersonalPetManagement(this.#credential).open();
        partnerPet = this.#findZodiacPet(petPage.petList);
        if (!partnerPet) {
            // Should not reach here.
            return OperationMessage.failure();
        }
        await new PersonalPetManagement(this.#credential).set(partnerPet.index!);
        MessageBoard.publishMessage("【十二宫战斗伴侣】成功设置！");
        const message = OperationMessage.success();
        message.doRefresh = true;
        return message;
    }

    #findZodiacPet(petList: Pet[] | undefined): Pet | null {
        if (!petList) return null;
        for (const pet of petList) {
            if (this.isZodiacPartner(pet)) {
                return pet;
            }
        }
        return null;
    }
}

export = ZodiacPartnerLoader;