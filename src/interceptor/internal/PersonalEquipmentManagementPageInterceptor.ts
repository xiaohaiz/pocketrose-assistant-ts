import PageInterceptor from "../PageInterceptor";
import SetupLoader from "../../pocket/SetupLoader";
import LocationStateMachine from "../../core/LocationStateMachine";
import MapPersonalEquipmentManagementProcessor from "../../processor/internal/MapPersonalEquipmentManagementProcessor";
import PersonalEquipmentManagementProcessor from "../../processor/personal/PersonalEquipmentManagementProcessor";

class PersonalEquipmentManagementPageInterceptor implements PageInterceptor {
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
                new PersonalEquipmentManagementProcessor().process();
            })
            .whenInCastle(() => {
                new PersonalEquipmentManagementProcessor().process();
            })
            .whenInMap(coordinate => {
                new MapPersonalEquipmentManagementProcessor().process(coordinate!);
            })
            .fork();
    }


}

export = PersonalEquipmentManagementPageInterceptor;