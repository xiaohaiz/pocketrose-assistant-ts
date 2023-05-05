import Credential from "../../util/Credential";
import EquipmentManagementPage from "./EquipmentManagementPage";
import NetworkUtils from "../../util/NetworkUtils";
import EquipmentParser from "../EquipmentParser";
import PageUtils from "../../util/PageUtils";

class EquipmentManagement {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async load(): Promise<EquipmentManagementPage> {
        const action = (credential: Credential) => {
            return new Promise<EquipmentManagementPage>(resolve => {
                const request = credential.asRequest();
                // @ts-ignore
                request.mode = "USE_ITEM";
                NetworkUtils.sendPostRequest("mydata.cgi", request, function (pageHtml) {
                    const credential = PageUtils.parseCredential(pageHtml);
                    const equipmentList = EquipmentParser.parsePersonalItemList(pageHtml);
                    const page = new EquipmentManagementPage(credential);
                    page.equipmentList = equipmentList;
                    resolve(page);
                });
            });
        };
        return await action(this.#credential);
    }
}

export = EquipmentManagement;