import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";
import Credential from "../../util/Credential";
import PersonalEquipmentManagementPageProcessor
    from "../../processor/stateful/PersonalEquipmentManagementPageProcessor";

class PersonalEquipmentManagementPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("＜＜　|||　物品使用．装备　|||　＞＞");
        }
        return false;
    }

    intercept(): void {
        const credential = Credential.newInstance();
        if (credential === undefined) {
            return
        }
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(state => {
                        const context = PageProcessorContext.whenInTown(state?.townId)
                        new PersonalEquipmentManagementPageProcessor(credential, context).process();
                    })
                    .whenInCastle(state => {
                        const context = PageProcessorContext.whenInCastle(state?.castleName);
                        new PersonalEquipmentManagementPageProcessor(credential, context).process();
                    })
                    .whenInMap(state => {
                        const context = PageProcessorContext.whenInMap(state?.asCoordinate())
                        new PersonalEquipmentManagementPageProcessor(credential, context).process();
                    })
                    .whenInMetro(() => {
                        const context = PageProcessorContext.whenInMetro()
                        new PersonalEquipmentManagementPageProcessor(credential, context).process();
                    })
                    .process();
            });
    }


}

export = PersonalEquipmentManagementPageInterceptor;