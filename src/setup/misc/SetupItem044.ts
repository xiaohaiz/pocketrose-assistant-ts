import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem044 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "其他";
    }

    protected getCode(): string {
        return "044";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isOnlyConsecrateInitialPetEnabled();
    }

    protected getName(): string {
        return "只封印初始宠物";
    }

    protected doGetDescription(): string {
        return "只能封印等级为１的宠物。";
    }
}

export {SetupItem044};