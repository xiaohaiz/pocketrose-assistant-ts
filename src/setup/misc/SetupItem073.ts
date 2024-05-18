import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem073 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "其他";
    }

    protected getCode(): string {
        return "073";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isAutoEquipmentExperience();
    }

    protected getName(): string {
        return "自动开启练装备";
    }

}

export {SetupItem073};