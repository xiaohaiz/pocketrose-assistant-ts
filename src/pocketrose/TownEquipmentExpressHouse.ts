import TownEquipmentExpressHousePage from "./TownEquipmentExpressHousePage";

class TownEquipmentExpressHouse {

    static parsePage(html: string): TownEquipmentExpressHousePage {
        const page = new TownEquipmentExpressHousePage();
        return page;
    }
}

export = TownEquipmentExpressHouse;