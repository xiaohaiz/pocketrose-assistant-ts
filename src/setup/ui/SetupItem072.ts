import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem072 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "界面";
    }

    protected getCode(): string {
        return "072";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isRenameHistoriesHidden();
    }

    protected getName(): string {
        return "隐藏改名的历史";
    }

}

export {SetupItem072};