import Credential from "../util/Credential";
import TownDashboardPage from "./TownDashboardPage";

class TownDashboard {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async open(): Promise<TownDashboardPage> {
        const action = () => {
            return new Promise<TownDashboardPage>(resolve => {
            });
        };
        return await action();
    }
}

export = TownDashboard;