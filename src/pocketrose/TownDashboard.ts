import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import TownDashboardPage from "./TownDashboardPage";

class TownDashboard {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async open(): Promise<TownDashboardPage> {
        return await (() => {
            return new Promise<TownDashboardPage>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("mode", "STATUS");
                NetworkUtils.post("status.cgi", request).then(html => {
                    const page = TownDashboardPage.parse(html);
                    resolve(page);
                });
            });
        })();
    }

}

export = TownDashboard;