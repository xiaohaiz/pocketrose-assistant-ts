import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem087 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "战斗";
    }

    protected getCode(): string {
        return "087";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isAutoRefreshTimeLimitationEnabled();
    }

    protected getName(): string {
        return "限时启动自动刷";
    }

}

export {SetupItem087};