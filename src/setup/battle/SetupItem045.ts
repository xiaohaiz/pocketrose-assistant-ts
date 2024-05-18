import {BattleConfigManager} from "../ConfigManager";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem045 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "战斗";
    }

    protected getCode(): string {
        return "045";
    }

    protected getCurrentSetupValue(): boolean {
        return BattleConfigManager.isSafeBattleButtonEnabled();
    }

    protected getName(): string {
        return "安全的战斗按钮";
    }

}

export {SetupItem045};