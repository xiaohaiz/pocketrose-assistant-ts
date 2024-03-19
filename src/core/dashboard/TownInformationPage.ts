import TownStatus from "../town/TownStatus";

class TownInformationPage {

    statusList?: TownStatus[];
    groupByCountries?: Map<string, TownStatus[]>;

    initialize() {
        if (!this.statusList) {
            return;
        }
        this.groupByCountries = new Map<string, TownStatus[]>();
        for (const town of this.statusList!) {
            const c = town.country!
            if (!this.groupByCountries.has(c)) {
                this.groupByCountries.set(c, []);
            }
            this.groupByCountries.get(c)!.push(town);
        }
    }

    get countries(): string[] {
        if (!this.groupByCountries) {
            return [];
        }
        const cs: string[] = [];
        for (const c of this.groupByCountries.keys()) {
            cs.push(c);
        }
        return cs.sort();
    }

}

export = TownInformationPage;