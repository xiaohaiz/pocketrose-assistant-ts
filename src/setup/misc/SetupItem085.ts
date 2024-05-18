import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem085 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "其他";
    }

    protected getCode(): string {
        return "085";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isProhibitSellingNonEmptyCastleEnabled();
    }

    protected getName(): string {
        return "禁售非空的城堡";
    }

}

export {SetupItem085};