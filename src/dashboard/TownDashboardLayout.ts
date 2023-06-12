import TownDashboardPage from "../core/dashboard/TownDashboardPage";
import Credential from "../util/Credential";

abstract class TownDashboardLayout {

    abstract id(): number;

    abstract render(credential: Credential, page: TownDashboardPage): void;
}

export = TownDashboardLayout;