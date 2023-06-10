import TownDashboardPage from "../pocketrose/TownDashboardPage";
import Credential from "../util/Credential";
import TownDashboardLayout from "./TownDashboardLayout";
import TownDashboardLayout005 from "./TownDashboardLayout005";

class TownDashboardLayout007 extends TownDashboardLayout {

    readonly #layout005: TownDashboardLayout = new TownDashboardLayout005();

    id(): number {
        return 7;
    }

    render(credential: Credential, page: TownDashboardPage): void {
        this.#layout005.render(credential, page);
    }


}

export = TownDashboardLayout007;