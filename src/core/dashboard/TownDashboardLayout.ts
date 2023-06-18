import Credential from "../../util/Credential";
import TownDashboardPage from "./TownDashboardPage";

abstract class TownDashboardLayout {

    abstract id(): number;

    abstract battleMode(): boolean;

    async render(credential: Credential, page: TownDashboardPage): Promise<void> {
    }
}

export = TownDashboardLayout;