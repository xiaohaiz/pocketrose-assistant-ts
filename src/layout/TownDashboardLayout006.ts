import TownDashboardPage from "../pocketrose/TownDashboardPage";
import Credential from "../util/Credential";
import TownDashboardLayout from "./TownDashboardLayout";
import TownDashboardLayout003 from "./TownDashboardLayout003";

class TownDashboardLayout006 extends TownDashboardLayout {

    readonly #layout003: TownDashboardLayout = new TownDashboardLayout003();

    id(): number {
        return 6;
    }

    render(credential: Credential, page: TownDashboardPage): void {
        this.#layout003.render(credential, page);
    }

}

export = TownDashboardLayout006;