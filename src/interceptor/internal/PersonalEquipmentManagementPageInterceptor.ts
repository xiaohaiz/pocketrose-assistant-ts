import SetupLoader from "../../config/SetupLoader";
import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PersonalEquipmentManagementPageProcessor_Castle
    from "../../processor/internal/PersonalEquipmentManagementPageProcessor_Castle";
import PersonalEquipmentManagementPageProcessor_Map
    from "../../processor/internal/PersonalEquipmentManagementPageProcessor_Map";
import PersonalEquipmentManagementPageProcessor_Metro
    from "../../processor/internal/PersonalEquipmentManagementPageProcessor_Metro";
import PersonalEquipmentManagementPageProcessor_Town
    from "../../processor/internal/PersonalEquipmentManagementPageProcessor_Town";
import PageProcessor from "../../processor/PageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class PersonalEquipmentManagementPageInterceptor implements PageInterceptor {

    readonly #inTownProcessor: PageProcessor = new PersonalEquipmentManagementPageProcessor_Town();
    readonly #inCastleProcessor: PageProcessor = new PersonalEquipmentManagementPageProcessor_Castle();
    readonly #inMapProcessor: PageProcessor = new PersonalEquipmentManagementPageProcessor_Map();
    readonly #inMetroProcessor: PageProcessor = new PersonalEquipmentManagementPageProcessor_Metro();

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
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(state => {
                        const context = new PageProcessorContext();
                        context.set("townId", townId!);
                        this.#inTownProcessor.process(context);
                    })
                    .whenInCastle(state => {
                        const context = new PageProcessorContext();
                        context.set("castleName", castleName!);
                        this.#inCastleProcessor.process(context);
                    })
                    .whenInMap(state => {
                        const context = new PageProcessorContext();
                        context.set("coordinate", coordinate!.asText());
                        this.#inMapProcessor.process(context);
                    })
                    .whenInMetro(() => {
                        this.#inMetroProcessor.process();
                    })
                    .process();
            });
    }


}

export = PersonalEquipmentManagementPageInterceptor;