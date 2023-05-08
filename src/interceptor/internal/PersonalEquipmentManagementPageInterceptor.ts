import PageInterceptor from "../PageInterceptor";
import SetupLoader from "../../pocket/SetupLoader";
import LocationStateMachine from "../../core/LocationStateMachine";
import PersonalEquipmentManagementPageProcessor_Map
    from "../../processor/internal/PersonalEquipmentManagementPageProcessor_Map";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PersonalEquipmentManagementPageProcessor
    from "../../processor/internal/PersonalEquipmentManagementPageProcessor";

class PersonalEquipmentManagementPageInterceptor implements PageInterceptor {

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
        LocationStateMachine.currentLocationStateMachine()
            .load()
            .whenInTown(() => {
                new PersonalEquipmentManagementPageProcessor().process();
            })
            .whenInCastle(() => {
                new PersonalEquipmentManagementPageProcessor().process();
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