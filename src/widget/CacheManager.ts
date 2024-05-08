import {CommonWidget, CommonWidgetFeature} from "./support/CommonWidget";
import Credential from "../util/Credential";
import LocationModeCastle from "../core/location/LocationModeCastle";
import LocationModeMap from "../core/location/LocationModeMap";
import LocationModeMetro from "../core/location/LocationModeMetro";
import LocationModeTown from "../core/location/LocationModeTown";
import TeamMemberLoader from "../core/team/TeamMemberLoader";
import LocalSettingManager from "../core/config/LocalSettingManager";
import {RoleStatusManager} from "../core/role/RoleStatus";
import NpcLoader from "../core/role/NpcLoader";

class CacheManager extends CommonWidget {

    readonly feature = new CacheManagerFeature();

    constructor(credential: Credential, locationMode: LocationModeCastle | LocationModeMap | LocationModeMetro | LocationModeTown) {
        super(credential, locationMode);
    }

    generateHTML() {
        return "" +
            "<table style='background-color:#888888;margin:auto;width:100%;border-width:0'>" +
            "<tbody>" +
            "<tr>" +
            "<th style='writing-mode:vertical-rl;text-orientation:mixed;" +
            "background-color:navy;color:white;font-size:120%;text-align:left'>" +
            "缓 存" +
            "</th>" +
            "<td style='border-spacing:0;width:100%'>" +
            "<table style='background-color:transparent;margin:auto;width:100%;border-width:0;text-align:center'>" +
            "<thead style='background-color:wheat'>" +
            "<th style='width:64px'>头像</th>" +
            "<th>名字</th>" +
            "<th>等级</th>" +
            "<th>分身</th>" +
            "<th>职业</th>" +
            "<th>额外RP</th>" +
            "<th>祭奠RP</th>" +
            "<th>战数</th>" +
            "<th>城市</th>" +
            "<th>宠性别</th>" +
            "<th>宠等级</th>" +
            "<th>更新时间</th>" +
            "<th>版本</th>" +
            "</thead>" +
            "<tbody style='background-color:#F8F0E0' id='_pocket_CacheManagerTable'></tbody>" +
            "</table>" +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "";
    }

    bindButtons() {
    }

    async reload() {
    }

    async render() {
        $(".C_pocket_CacheManager_RoleStatus").remove();
        const table = $("#_pocket_CacheManagerTable");
        const includeExternal = LocalSettingManager.isIncludeExternal();
        for (const roleId of TeamMemberLoader.loadTeamMembersAsMap(includeExternal).keys()) {
            const status = await new RoleStatusManager(roleId).load();
            let html = "<tr class='C_pocket_CacheManager_RoleStatus'>";
            html += "<td style='width:64px;height:64px'>" + (status?.readImageHtml ?? NpcLoader.getNpcImageHtml("U_041")!) + "</td>";
            html += "<td>" + (status?.name ?? "-") + "</td>";
            html += "<td>" + (status?.readLevel ?? "-") + "</td>";
            html += "<td>" + (status?.mirrorCategory ?? "-") + "</td>";
            html += "<td>" + (status?.career ?? "-") + "</td>";
            html += "<td>" + (status?.readAdditionalRP ?? "-") + "</td>";
            html += "<td>" + (status?.readConsecrateRP ?? "-") + "</td>";
            html += "<td>" + (status?.battleCount ?? "-") + "</td>";
            html += "<td>" + (status?.town?.name ?? "-") + "</td>";
            html += "<td>" + (status?.petGender ?? "-") + "</td>";
            html += "<td>" + (status?.readPetLevel ?? "-") + "</td>";
            html += "<td>" + (status?.updateTimeLocalString ?? "-") + "</td>";
            html += "<td>" + (status?.revision ?? "-") + "</td>";
            html += "</tr>";
            table.append($(html));
        }
    }

    async dispose() {
    }
}

class CacheManagerFeature extends CommonWidgetFeature {
}

export {CacheManager, CacheManagerFeature};