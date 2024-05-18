import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem001 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "界面";
    }

    protected getCode(): string {
        return "001";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isPokemonWikiEnabled();
    }

    protected getName(): string {
        return "宝可梦百科超链";
    }
}

export {SetupItem001};