import BankAccount from "../core/bank/BankAccount";
import CastleBank from "../core/bank/CastleBank";
import Credential from "../util/Credential";
import LocationModeCastle from "../core/location/LocationModeCastle";
import LocationModeMetro from "../core/location/LocationModeMetro";
import LocationModeTown from "../core/location/LocationModeTown";
import {PersonalStatus} from "../core/role/PersonalStatus";
import Role from "../core/role/Role";
import TownBank from "../core/bank/TownBank";
import _ from "lodash";
import {CommonWidget, CommonWidgetFeature} from "./support/CommonWidget";
import SetupLoader from "../core/config/SetupLoader";

class RoleManager extends CommonWidget {

    readonly feature = new RoleManagerFeature();

    constructor(credential: Credential, locationMode: LocationModeCastle | LocationModeMetro | LocationModeTown) {
        super(credential, locationMode);
    }

    role?: Role;
    account?: BankAccount;

    generateHTML(): string {
        let html = "";
        html += "<table style='background-color:#888888;margin:auto;border-width:0;display:none' id='_pocket_RoleInformationTable'>";
        html += "<thead style='background-color:skyblue;text-align:center'>";
        html += "<tr>";
        html += "<th>姓名</th>";
        if (this.feature.enableCareerFixedFlag) {
            html += "<th>定型</th>";
        }
        html += "<th>ＬＶ</th>";
        html += "<th>ＨＰ</th>";
        html += "<th>ＭＰ</th>";
        html += "<th>攻击</th>";
        html += "<th>防御</th>";
        html += "<th>智力</th>";
        html += "<th>精神</th>";
        html += "<th>速度</th>";
        html += "<th>属性</th>";
        html += "<th>职业</th>";
        html += "<th>技能</th>";
        html += "<th>现金</th>";
        if (this.feature.enableBankAccount && (this.isTownMode || this.isCastleMode)) {
            html += "<th>存款</th>";
        }
        html += "</tr>";
        html += "</thead>";
        html += "<tbody style='background-color:#F8F0E0;text-align:center'>";
        html += "<tr id='_pocket_RoleInformation'>";
        html += "<td></td>";
        if (this.feature.enableCareerFixedFlag) {
            html += "<th></th>";
        }
        html += "<td></td>";
        html += "<td></td>";
        html += "<td></td>";
        html += "<td></td>";
        html += "<td></td>";
        html += "<td></td>";
        html += "<td></td>";
        html += "<td></td>";
        html += "<td></td>";
        html += "<td></td>";
        html += "<td></td>";
        html += "<td></td>";
        if (this.feature.enableBankAccount && (this.isTownMode || this.isCastleMode)) {
            html += "<td></td>";
        }
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        return html;
    }

    bindButtons() {
    }

    async reload() {
        this.role = await new PersonalStatus(this.credential).load();
        if (this.feature.enableBankAccount) {
            if (this.isTownMode) {
                this.account = await new TownBank(this.credential, this.townId).load();
            } else if (this.isCastleMode) {
                this.account = await new CastleBank(this.credential).load();
            }
        }
    }

    async render() {
        const information = $("#_pocket_RoleInformation");
        information.find("> td:first").html(this.role!.name!);
        information.find("> td:eq(1)").html(_.toString(this.role!.level!));
        information.find("> td:eq(2)").html(this.role!.healthHtml);
        information.find("> td:eq(3)").html(this.role!.manaHtml);
        information.find("> td:eq(4)").html(this.role!.attackHtml);
        information.find("> td:eq(5)").html(this.role!.defenseHtml);
        information.find("> td:eq(6)").html(this.role!.specialAttackHtml);
        information.find("> td:eq(7)").html(this.role!.specialDefenseHtml);
        information.find("> td:eq(8)").html(this.role!.speedHtml);
        information.find("> td:eq(9)").html(this.role!.attribute!);
        information.find("> td:eq(10)").html(this.role!.career!);
        information.find("> td:eq(11)").html(this.role!.spell!);
        information.find("> td:eq(12)").html(() => {
            return "<span style='color:red;font-weight:bold'>" + this.role!.cash!.toLocaleString() + "</span> GOLD";
        });
        if (this.account !== undefined) {
            information.find("> td:eq(13)").html(() => {
                return "<span style='color:blue;font-weight:bold'>" + this.account!.saving!.toLocaleString() + "</span> GOLD";
            });
        }
        if (this.feature.enableCareerFixedFlag) {
            information.find("> th:first").html(() => {
                if (SetupLoader.isCareerFixed(this.credential.id, this.role!.mirrorIndex!)) {
                    return "★";
                } else {
                    return "";
                }
            });
        }
        $("#_pocket_RoleInformationTable").show();
    }

    async dispose() {
    }
}

class RoleManagerFeature extends CommonWidgetFeature {

    enableBankAccount: boolean = false;
    enableCareerFixedFlag: boolean = true;

}

export {RoleManager, RoleManagerFeature};