import Credential from "../../util/Credential";
import TownDashboardPage from "./TownDashboardPage";

abstract class TownDashboardLayout {

    abstract id(): number;

    abstract battleMode(): boolean;

    abstract render(credential: Credential, page: TownDashboardPage): void;
}

export = TownDashboardLayout;