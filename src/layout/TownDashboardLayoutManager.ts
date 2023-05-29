import Credential from "../util/Credential";
import StorageUtils from "../util/StorageUtils";
import TownDashboardLayout from "./TownDashboardLayout";
import TownDashboardLayout001 from "./TownDashboardLayout001";
import TownDashboardLayout002 from "./TownDashboardLayout002";
import TownDashboardLayout003 from "./TownDashboardLayout003";
import TownDashboardLayout004 from "./TownDashboardLayout004";

class TownDashboardLayoutManager {

    readonly #buffer: Map<number, TownDashboardLayout>;

    constructor() {
        this.#buffer = new Map<number, TownDashboardLayout>();
        const list: TownDashboardLayout[] = [
            new TownDashboardLayout001(),
            new TownDashboardLayout002(),
            new TownDashboardLayout003(),
            new TownDashboardLayout004(),
        ];
        list.forEach(it => {
            const id = it.id();
            this.#buffer.set(id, it);
        });
    }

    getLayout(id: number) {
        return this.#buffer.get(id);
    }

    static loadDashboardLayoutConfigId(credential: Credential) {
        let value = StorageUtils.getInt("_pa_053_" + credential.id, 0);
        if (value !== 0) {
            return value;
        }
        return StorageUtils.getFloat("_pa_052", 1);
    }
}

export = TownDashboardLayoutManager;