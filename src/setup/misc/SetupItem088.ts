import {AbstractBooleanValueSetupItem} from "../SetupSupport";
import SetupLoader from "../SetupLoader";

class SetupItem088 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "其他";
    }

    protected getCode(): string {
        return "088";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isAutoTriggerPersonalChampionEnabled();
    }

    protected getName(): string {
        return "个天的自动触发";
    }

}

export {SetupItem088};