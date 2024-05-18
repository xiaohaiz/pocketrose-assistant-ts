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

}

export {SetupItem057};