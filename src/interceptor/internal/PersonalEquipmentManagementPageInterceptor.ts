import LocationStateMachine from "../../core/LocationStateMachine";
import PersonalEquipmentManagementPageProcessor_Castle
    from "../../processor/internal/PersonalEquipmentManagementPageProcessor_Castle";
import PersonalEquipmentManagementPageProcessor_Map
    from "../../processor/internal/PersonalEquipmentManagementPageProcessor_Map";
import PersonalEquipmentManagementPageProcessor_Town
    from "../../processor/internal/PersonalEquipmentManagementPageProcessor_Town";
import PageProcessorContext from "../../processor/PageProcessorContext";
import SetupLoader from "../../setup/SetupLoader";
import PageInterceptor from "../PageInterceptor";

class PersonalEquipmentManagementPageInterceptor implements PageInterceptor {

    readonly #inTownProcessor = new PersonalEquipmentManagementPageProcessor_Town();
    readonly #inCastleProcessor = new PersonalEquipmentManagementPageProcessor_Castle();
    readonly #inMapProcessor = new PersonalEquipmentManagementPageProcessor_Map();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("＜＜　|||　物品使用．装备　|||　＞＞");
        }
        return false;
    }

    intercept(): void {
        if (!SetupLoader.isEquipmentManagementUIEnabled()) {
            return;
        }
        LocationStateMachine.create()
            .load()
            .whenInTown(townId => {
                const context = new PageProcessorContext();
                context.set("townId", townId!);
                this.#inTownProcessor.process(context);
            })
            .whenInCastle(castleName => {
                const context = new PageProcessorContext();
                context.set("castleName", castleName!);
                this.#inCastleProcessor.process(context);
            })
            .whenInMap(coordinate => {
                const context = new PageProcessorContext();
                context.set("coordinate", coordinate!.asText());
                this.#inMapProcessor.process(context);
            })
            .fork();
    }


}

export = PersonalEquipmentManagementPageInterceptor;