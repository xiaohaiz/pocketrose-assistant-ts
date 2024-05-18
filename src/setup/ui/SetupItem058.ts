import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem058 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "界面";
    }

    protected getCode(): string {
        return "058";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isWinnerLeftEnabled();
    }

    protected getName(): string {
        return "胜利者站在左边";
    }

}

export {SetupItem058};