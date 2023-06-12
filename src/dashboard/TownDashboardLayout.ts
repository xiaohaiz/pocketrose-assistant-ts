import TownDashboardPage from "../core/dashboard/TownDashboardPage";
import Credential from "../util/Credential";

abstract class TownDashboardLayout {

    abstract id(): number;

    abstract battleMode(): boolean;

    abstract render(credential: Credential, page: TownDashboardPage): void;
}

export = TownDashboardLayout;