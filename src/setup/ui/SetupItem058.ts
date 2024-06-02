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

    protected doGetDescription(): string {
        return "战斗报告中胜利者的位置，方便快速感知前次战斗胜利与否。";
    }
}

export {SetupItem058};