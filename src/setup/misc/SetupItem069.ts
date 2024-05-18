import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem069 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "其他";
    }

    protected getCode(): string {
        return "069";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isAutoChangePointToTown();
    }

    protected getName(): string {
        return "自动转移城据点";
    }

}

export {SetupItem069};