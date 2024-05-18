import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem081 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "界面";
    }

    protected getCode(): string {
        return "081";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isRemindTownRevenueCollectableEnabled();
    }

    protected getName(): string {
        return "提示城市可收益";
    }

}

export {SetupItem081};