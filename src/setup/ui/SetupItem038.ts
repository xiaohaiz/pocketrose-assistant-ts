import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem038 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "界面";
    }

    protected getCode(): string {
        return "038";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isEquipmentPetSortEnabled();
    }

    protected getName(): string {
        return "装备和宠物排序";
    }

}

export {SetupItem038};