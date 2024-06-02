import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem057 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "界面";
    }

    protected getCode(): string {
        return "057";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isQuietBattleModeEnabled();
    }

    protected getName(): string {
        return "上班悄悄的摸鱼";
    }

    protected doGetDescription(): string {
        return "用极简风格展现战斗结果报告。";
    }

}

export {SetupItem057};