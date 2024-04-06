import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";
import PersonalEquipmentManagementPageProcessorTownImpl
    from "../../processor/stateful/PersonalEquipmentManagementPageProcessorTownImpl";
import PersonalEquipmentManagementPageProcessorMetroImpl
    from "../../processor/stateful/PersonalEquipmentManagementPageProcessorMetroImpl";
import PersonalEquipmentManagementPageProcessorMapImpl
    from "../../processor/stateful/PersonalEquipmentManagementPageProcessorMapImpl";
import Credential from "../../util/Credential";
import PersonalEquipmentManagementPageProcessorCastleImpl
    from "../../processor/stateful/PersonalEquipmentManagementPageProcessorCastleImpl";

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
                        new PersonalEquipmentManagementPageProcessorTownImpl(credential, context).process();
                    })
                    .whenInCastle(state => {
                        const context = PageProcessorContext.whenInCastle(state?.castleName);
                        new PersonalEquipmentManagementPageProcessorCastleImpl(credential, context).process();
                    })
                    .whenInMap(state => {
                        const context = PageProcessorContext.whenInMap(state?.asCoordinate())
                        new PersonalEquipmentManagementPageProcessorMapImpl(credential, context).process();
                    })
                    .whenInMetro(() => {
                        const context = PageProcessorContext.whenInMetro()
                        new PersonalEquipmentManagementPageProcessorMetroImpl(credential, context).process();
                    })
                    .process();
            });
    }


}

export = PersonalEquipmentManagementPageInterceptor;