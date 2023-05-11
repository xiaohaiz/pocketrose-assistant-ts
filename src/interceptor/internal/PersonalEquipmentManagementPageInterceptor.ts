import LocationStateMachine from "../../core/LocationStateMachine";
import SetupLoader from "../../core/SetupLoader";
import PersonalEquipmentManagementPageProcessor
    from "../../processor/internal/PersonalEquipmentManagementPageProcessor";
import PersonalEquipmentManagementPageProcessor_Castle
    from "../../processor/internal/PersonalEquipmentManagementPageProcessor_Castle";
import PersonalEquipmentManagementPageProcessor_Map
    from "../../processor/internal/PersonalEquipmentManagementPageProcessor_Map";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class PersonalEquipmentManagementPageInterceptor implements PageInterceptor {

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
            .whenInTown(() => {
                new PersonalEquipmentManagementPageProcessor().process();
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