import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem079 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "界面";
    }

    protected getCode(): string {
        return "079";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isBattleAdditionalNotificationEnabled();
    }

    protected getName(): string {
        return "显示战斗的收获";
    }

}

export {SetupItem079};