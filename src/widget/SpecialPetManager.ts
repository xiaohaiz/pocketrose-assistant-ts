import Credential from "../util/Credential";
import LocationModeCastle from "../core/location/LocationModeCastle";
import LocationModeTown from "../core/location/LocationModeTown";
import MonsterProfileLoader from "../core/monster/MonsterProfileLoader";
import OperationMessage from "../util/OperationMessage";
import StringUtils from "../util/StringUtils";
import _ from "lodash";
import {CommonWidget, CommonWidgetFeature} from "./support/CommonWidget";
import {SpecialPet, SpecialPetStorage} from "../core/monster/SpecialPet";
import {PocketLogger} from "../pocket/PocketLogger";

const logger = PocketLogger.getLogger("PET");

class SpecialPetManager extends CommonWidget {

    readonly feature: SpecialPetManagerFeature;

    constructor(credential: Credential, locationMode: LocationModeCastle | LocationModeTown) {
        super(credential, locationMode);
        this.feature = new SpecialPetManagerFeature();
    }

    private specialPetList?: SpecialPet[];

    generateHTML() {
        const html = "<table style='background-color:#888888;margin:auto;width:100%;border-width:0'>" +
            "<thead style='background-color:skyblue;text-align:center'>" +
            "<tr>" +
            "<th>序号</th>" +
            "<th style='width:64px'>图鉴</th>" +
            "<th>名字</th>" +
            "<th>性别</th>" +
            "<th>等级</th>" +
            "<th>生命</th>" +
            "<th>攻击</th>" +
            "<th>防御</th>" +
            "<th>智力</th>" +
            "<th>精神</th>" +
            "<th>速度</th>" +
            "<th>能力</th>" +
            "<th>编号</th>" +
            "<th>删除</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody style='background-color:#F8F0E0;text-align:center' id='SpecialPetTable'></tbody>" +
            "</table>";
        return "<table style='background-color:#888888;margin:auto;width:100%;border-width:0'>" +
            "<tbody>" +
            "<tr>" +
            "<th style='writing-mode:vertical-rl;text-orientation:mixed;" +
            "background-color:navy;color:white;font-size:120%;text-align:left'>" +
            "特 宠" +
            "</th>" +
            "<td style='border-spacing:0;width:100%'>" +
            html +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>";
    }

    bindButtons() {
    }

    async reload() {
        const pets = await SpecialPetStorage.loadAll();
        this.specialPetList = pets.sort((a, b) => b.score - a.score);
    }

    async render() {
        $(".C_pocket_SPM_SpecialPetButton").off("click");
        $(".C_pocket_SPM_SpecialPet").remove();
        if (this.specialPetList === undefined) return;

        const table = $("#SpecialPetTable");
        let sequence = 0;
        for (const pet of this.specialPetList) {
            let html = "";
            html += "<tr class='C_pocket_SPM_SpecialPet'>";
            html += "<th>" + (++sequence) + "</th>";
            html += "<td style='width:64px;height:64px'>" + (pet.lookupProfile?.imageHtml ?? "") + "</td>";
            html += "<td>" + pet.name + "</td>";
            html += "<td>" + pet.gender + "</td>";
            html += "<td>" + pet.level + "</td>";
            html += "<td>" + pet.health + "</td>";
            html += "<td>" + pet.attack + "</td>";
            html += "<td>" + pet.defense + "</td>";
            html += "<td>" + pet.specialAttack + "</td>";
            html += "<td>" + pet.specialDefense + "</td>";
            html += "<td>" + pet.speed + "</td>";
            html += "<td style='color:blue;font-weight:bold'>" + pet.score + "</td>";
            html += "<td>";
            html += "<input type='text' spellcheck='false' size='3' maxlength='3' style='text-align:center' " +
                "class='C_pocket_StatelessElement' " +
                "id='SpecialPetCode_" + pet.id + "' value='" + (pet.code ?? "") + "'>";
            html += "<button role='button' " +
                "class='C_pocket_StatelessElement C_pocket_SPM_SpecialPetButton C_pocket_SPM_SetSpecialPetCodeButton' " +
                "id='SetSpecialPetCode_" + pet.id + "'>设置</button>";
            html += "</td>";
            html += "<td><button role='button' " +
                "class='C_pocket_StatelessElement C_pocket_SPM_SpecialPetButton C_pocket_SPM_RemoveSpecialPetButton' " +
                "id='RemoveSpecialPet_" + pet.id + "'>删除</button></td>";
            html += "</tr>";
            table.append($(html));
        }

        $(".C_pocket_SPM_SetSpecialPetCodeButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const petId = StringUtils.substringAfter(btnId, "SetSpecialPetCode_");
            const value = $(event.target).prev().val();
            if (value === undefined) return;
            const s = _.trim(value as string);
            if (s === "") return;
            const code = _.parseInt(s);
            if (MonsterProfileLoader.load(code) === null) {
                logger.warn("无效的编号：" + s);
                return;
            }
            const record = new SpecialPet();
            const a = _.split(petId, ".");
            record.gender = a[0];
            record.level = _.parseInt(a[1]);
            record.health = _.parseInt(a[2]);
            record.attack = _.parseInt(a[3]);
            record.defense = _.parseInt(a[4]);
            record.specialAttack = _.parseInt(a[5]);
            record.specialDefense = _.parseInt(a[6]);
            record.speed = _.parseInt(a[7]);
            record.code = code;
            SpecialPetStorage.upsert(record).then(() => {
                this.refresh().then();
            });
        });

        $(".C_pocket_SPM_RemoveSpecialPetButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const petId = StringUtils.substringAfter(btnId, "RemoveSpecialPet_");
            SpecialPetStorage.remove(petId).then(() => {
                this.refresh().then();
            });
        });
    }

    async dispose() {
    }

    private async refresh() {
        await this.reload();
        await this.render();
        this.feature.publishRefresh(OperationMessage.success());
    }

}

class SpecialPetManagerFeature extends CommonWidgetFeature {
}

export {SpecialPetManager, SpecialPetManagerFeature};