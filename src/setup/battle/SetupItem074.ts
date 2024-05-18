import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem074 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "战斗";
    }

    protected getCode(): string {
        return "074";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isTraditionalBattleModeEnabled();
    }

    protected getName(): string {
        return "传统的战斗模式";
    }

}

export {SetupItem074};