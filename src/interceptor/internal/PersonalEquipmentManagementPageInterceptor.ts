import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PersonalEquipmentManagementPageProcessor_Castle
    from "../../processor/internal/PersonalEquipmentManagementPageProcessor_Castle";
import PersonalEquipmentManagementPageProcessor_Map
    from "../../processor/internal/PersonalEquipmentManagementPageProcessor_Map";
import PersonalEquipmentManagementPageProcessor_Metro
    from "../../processor/internal/PersonalEquipmentManagementPageProcessor_Metro";
import PersonalEquipmentManagementPageProcessor_Town
    from "../../processor/internal/PersonalEquipmentManagementPageProcessor_Town";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class PersonalEquipmentManagementPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("＜＜　|||　物品使用．装备　|||　＞＞");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(state => {
                        const context = new PageProcessorContext();
                        context.withTownId(state?.townId);
                        new PersonalEquipmentManagementPageProcessor_Town().process(context);
                    })
                    .whenInCastle(state => {
                        const context = new PageProcessorContext();
                        context.withCastleName(state?.castleName)
                        new PersonalEquipmentManagementPageProcessor_Castle().process(context);
                    })
                    .whenInMap(state => {
                        const context = new PageProcessorContext();
                        context.withCoordinate(state?.asCoordinate()?.asText());
                        new PersonalEquipmentManagementPageProcessor_Map().process(context);
                    })
                    .whenInMetro(() => {
                        new PersonalEquipmentManagementPageProcessor_Metro().process();
                    })
                    .process();
            });
    }


}

export = PersonalEquipmentManagementPageInterceptor;