import {AbstractBooleanValueSetupItem} from "../SetupSupport";
import SetupLoader from "../SetupLoader";

class SetupItem094 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "其他";
    }

    protected getCode(): string {
        return "094";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isAutoSellBattleTrashEnabled();
    }

    protected getName(): string {
        return "自动卖战斗垃圾";
    }

    protected doGetDescription(): string {
        return "如果战斗中有垃圾入手（包括龙珠、初森和中塔）则自动卖出。";
    }
}

export {SetupItem094};