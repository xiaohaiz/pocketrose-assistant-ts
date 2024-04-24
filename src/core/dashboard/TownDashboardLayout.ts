import Credential from "../../util/Credential";
import TownDashboardPage from "./TownDashboardPage";
import {ValidationCodeTrigger} from "../trigger/ValidationCodeTrigger";

abstract class TownDashboardLayout {

    abstract id(): number;

    abstract battleMode(): boolean;

    async render(credential: Credential, page: TownDashboardPage, validationCodeTrigger?: ValidationCodeTrigger): Promise<void> {
    }
}

export = TownDashboardLayout;