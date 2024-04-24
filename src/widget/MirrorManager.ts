import {CommonWidget, CommonWidgetFeature} from "./support/CommonWidget";
import Credential from "../util/Credential";
import LocationModeTown from "../core/location/LocationModeTown";
import Mirror from "../core/role/Mirror";
import MouseClickEventBuilder from "../util/MouseClickEventBuilder";
import OperationMessage from "../util/OperationMessage";
import PersonalMirror from "../core/role/PersonalMirror";
import PersonalMirrorPage from "../core/role/PersonalMirrorPage";
import {PersonalStatus} from "../core/role/PersonalStatus";
import Role from "../core/role/Role";
import SetupLoader from "../core/config/SetupLoader";
import StorageUtils from "../util/StorageUtils";
import StringUtils from "../util/StringUtils";
import TownInn from "../core/inn/TownInn";
import _ from "lodash";

class MirrorManager extends CommonWidget {

    readonly feature = new MirrorManagerFeature();

    constructor(credential: Credential, locationMode: LocationModeTown) {
        super(credential, locationMode);
    }

    mirrorPage?: PersonalMirrorPage;

    private _role?: Role;

    generateHTML(): string {
        return "" +
            "<table style='background-color:#888888;margin:auto;width:100%;border-width:0'>" +
            "<tbody>" +
            "<tr>" +
            "<th style='writing-mode:vertical-rl;text-orientation:mixed;" +
            "background-color:navy;color:white;font-size:120%;text-align:left'>" +
            "分 身" +
            "</th>" +
            "<td style='border-spacing:0;width:100%'>" +
            this._generateHTML() +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "";
    }

    private _generateHTML(): string {
        let html = "";
        html += "<table style='text-align:center;border-width:0;margin:auto;width:100%;background-color:#888888'>";
        html += "<tbody id='_pocket_mirrorTable'>";
        html += "<tr style='background-color:wheat'>";
        html += "<th>切换</th>";
        html += "<th>类别</th>";
        html += "<th>头像</th>";
        html += "<th>姓名</th>";
        html += "<th>定型</th>";
        html += "<th>性别</th>";
        html += "<th>等级</th>";
        html += "<th>ＨＰ</th>";
        html += "<th>ＭＰ</th>";
        html += "<th>属性</th>";
        html += "<th>攻击</th>";
        html += "<th>防御</th>";
        html += "<th>智力</th>";
        html += "<th>精神</th>";
        html += "<th>速度</th>";
        html += "<th>职业</th>";
        html += "<th>技能</th>";
        html += "<th>经验</th>";
        html += "</tr>";
        html += "</tbody>";
        return html;
    }

    bindButtons() {
    }

    async reload() {
        this.mirrorPage = await new PersonalMirror(this.credential, this.townId).open();
    }

    async render(role: Role) {
        this._role = await this.reInitializeRole(
            role,
            role => role.mirrorIndex !== undefined && role.mirrorCount !== undefined
        );

        $(".C_pocket_mirrorButton").off("click").off("dblclick");
        $(".C_pocket_mirror").remove();

        const allMirrors: Mirror[] = [];
        allMirrors.push(this.mirrorPage!.currentMirror!);
        _.forEach(this.mirrorPage!.mirrorList!, it => allMirrors.push(it));
        const mirrorList = allMirrors.sort((a, b) => a.index! - b.index!);
        for (const mirror of mirrorList) {
            let html = "<tr class='C_pocket_mirror'>";
            html += "<td style='background-color:#E8E8D0'>";
            if (mirror.index === this._role!.mirrorIndex) {
                html += "<button role='button' disabled>切换</button>";
            } else {
                html += "<button role='button' " +
                    "class='C_pocket_mirrorButton C_pocket_mirrorChangeButton' " +
                    "id='_pocket_changeMirror_" + mirror.index + "'>切换</button>";
            }
            html += "</td>";
            html += "<td style='background-color:#E8E8D0'>";
            if (mirror.index === this._role!.mirrorIndex) {
                html += "<span style='color:red;font-weight:bold'>" + mirror.category + "</span>";
            } else {
                html += mirror.category;
            }
            html += "</td>";
            html += "<td style='background-color:#E8E8D0;width:64px;height:64px' " +
                "class='C_pocket_mirrorButton C_pocket_mirrorImageButton' " +
                "id='_pocket_mirrorImage_" + mirror.index + "'>" + mirror.imageHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.name + "</td>";
            html += "<td style='background-color:#E8E8D0'>";
            if (SetupLoader.isCareerFixed(this.credential.id, mirror.index!)) {
                html += "★";
            }
            html += "</td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.gender + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.level + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.healthHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.manaHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.attribute + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.attackHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.defenseHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.specialAttackHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.specialDefenseHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.speedHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.career + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.spell + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.experienceHtml + "</td>";
            html += "</tr>";
            $("#_pocket_mirrorTable").append($(html));
        }

        $(".C_pocket_mirrorChangeButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            $(".C_pocket_mirrorChangeButton").prop("disabled", true);
            new TownInn(this.credential, this.townId).recovery().then(() => {
                new PersonalMirror(this.credential, this.townId).changeMirror(index).then(() => {
                    const message = OperationMessage.success();
                    this._refresh(message).then();
                });
            });
        });

        $(".C_pocket_mirrorImageButton")
            .each((_idx, e) => {
                const td = $(e);
                const btnId = td.attr("id") as string;
                const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
                new MouseClickEventBuilder(this.credential)
                    .bind(td, () => {
                        $(".C_pocket_mirrorChangeButton").prop("disabled", true);
                        const key = "_m_" + index;
                        const c: any = SetupLoader.loadMirrorCareerFixedConfig(this.credential.id);
                        c[key] = !c[key];
                        StorageUtils.set("_pa_070_" + this.credential.id, JSON.stringify(c));
                        const mirrorDesc = (index === 0) ? "本体" : "第" + index + "分身";
                        this.feature.publishMessage("【" + mirrorDesc + "】定型标识设置完成。");
                        this.render(this._role!).then();
                    });
            })
    }

    private async _refresh(message: OperationMessage) {
        const role = await new PersonalStatus(this.credential).load();
        message.extensions.set("role", role);
        await this.reload();
        await this.render(role);
        this.feature.publishRefresh(message);
    }

}

class MirrorManagerFeature extends CommonWidgetFeature {
}

export {MirrorManager, MirrorManagerFeature};