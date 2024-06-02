import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem082 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "界面";
    }

    protected getCode(): string {
        return "082";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isBattleAdditionalNotificationLeftPanelEnabled();
    }

    protected getName(): string {
        return "战斗收获放左边";
    }

    protected doGetDescription(): string {
        return "在左侧战斗结果报告上方显示战斗收获情况。";
    }
}

export {SetupItem082};