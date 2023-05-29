import TownDashboardLayout from "./TownDashboardLayout";
import TownDashboardLayout001 from "./TownDashboardLayout001";
import TownDashboardLayout002 from "./TownDashboardLayout002";

class TownDashboardLayoutManager {

    readonly #buffer: Map<number, TownDashboardLayout>;

    constructor() {
        this.#buffer = new Map<number, TownDashboardLayout>();
        const list: TownDashboardLayout[] = [
            new TownDashboardLayout001(),
            new TownDashboardLayout002(),
        ];
        list.forEach(it => {
            const id = it.id();
            this.#buffer.set(id, it);
        });
    }

    getLayout(id: number) {
        return this.#buffer.get(id);
    }
}

export = TownDashboardLayoutManager;