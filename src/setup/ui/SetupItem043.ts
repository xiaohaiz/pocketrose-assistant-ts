import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem043 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "界面";
    }

    protected getCode(): string {
        return "043";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isHideCountryInformationEnabled();
    }

    protected getName(): string {
        return "隐藏支配国情报";
    }

    protected doGetDescription(): string {
        return "隐藏城市界面中支配国的信息。";
    }

}

export {SetupItem043};