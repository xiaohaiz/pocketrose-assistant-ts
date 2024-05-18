import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem086 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "战斗";
    }

    protected getCode(): string {
        return "086";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isAutoRefreshWhenBattleSessionExpiredEnabled();
    }

    protected getName(): string {
        return "会话过期自动刷";
    }

}

export {SetupItem086};