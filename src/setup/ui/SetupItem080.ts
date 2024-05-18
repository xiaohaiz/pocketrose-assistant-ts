import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem080 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "界面";
    }

    protected getCode(): string {
        return "080";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isAutoScrollTopEnabled();
    }

    protected getName(): string {
        return "战斗后自动置顶";
    }

}

export {SetupItem080};