import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem078 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "其他";
    }

    protected getCode(): string {
        return "078";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isDebugModeEnabled();
    }

    protected getName(): string {
        return "开发和调试模式";
    }

}

export {SetupItem078};