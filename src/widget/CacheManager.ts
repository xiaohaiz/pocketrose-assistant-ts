import {CommonWidget, CommonWidgetFeature} from "./support/CommonWidget";
import Credential from "../util/Credential";
import LocationModeCastle from "../core/location/LocationModeCastle";
import LocationModeMap from "../core/location/LocationModeMap";
import LocationModeMetro from "../core/location/LocationModeMetro";
import LocationModeTown from "../core/location/LocationModeTown";
import TeamMemberLoader from "../core/team/TeamMemberLoader";
import LocalSettingManager from "../setup/LocalSettingManager";
import {RoleStatus, RoleStatusManager} from "../core/role/RoleStatus";
import NpcLoader from "../core/role/NpcLoader";
import MouseClickEventBuilder from "../util/MouseClickEventBuilder";
import {PocketFormatter} from "../pocket/PocketFormatter";

class CacheManager extends CommonWidget {

    readonly feature = new CacheManagerFeature();

    constructor(credential: Credential, locationMode: LocationModeCastle | LocationModeMap | LocationModeMetro | LocationModeTown) {
        super(credential, locationMode);
    }

    private sorter?: string;

    generateHTML() {
        return "<table style='background-color:#888888;margin:auto;width:100%;border-width:0'>" +
            "<tbody>" +
            "<tr>" +
            "<th style='background-color:navy;color:white;font-size:120%;vertical-align:top'>" +
            "缓<br>存" +
            "</th>" +
            "<td style='border-spacing:0;width:100%'>" +
            "<table style='background-color:transparent;margin:auto;width:100%;border-width:0;text-align:center'>" +
            "<thead style='background-color:wheat'>" +
            "<th style='width:64px'>头像</th>" +
            "<th>名字</th>" +
            "<th id='_CacheManagerTitle_Level' style='background-color:skyblue'>等级</th>" +
            "<th>分身</th>" +
            "<th>职业</th>" +
            "<th id='_CacheManagerTitle_AdditionalRP' style='background-color:skyblue'>额外RP</th>" +
            "<th id='_CacheManagerTitle_ConsecrateRP' style='background-color:skyblue'>祭奠RP</th>" +
            "<th id='_CacheManagerTitle_BattleCount' style='background-color:skyblue'>战数</th>" +
            "<th>城市</th>" +
            "<th>宠性别</th>" +
            "<th id='_CacheManagerTitle_PetLevel' style='background-color:skyblue'>宠等级</th>" +
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
        MouseClickEventBuilder.newInstance()
            .onElementClicked("_CacheManagerTitle_Level", async () => {
                this.sorter = "Level";
                await this.render();
            })
            .onElementClicked("_CacheManagerTitle_AdditionalRP", async () => {
                this.sorter = "AdditionalRP";
                await this.render();
            })
            .onElementClicked("_CacheManagerTitle_ConsecrateRP", async () => {
                this.sorter = "ConsecrateRP";
                await this.render();
            })
            .onElementClicked("_CacheManagerTitle_BattleCount", async () => {
                this.sorter = "BattleCount";
                await this.render();
            })
            .onElementClicked("_CacheManagerTitle_PetLevel", async () => {
                this.sorter = "PetLevel";
                await this.render();
            })
            .doBind();
    }

    async reload() {
    }

    async render() {
        $(".C_pocket_CacheManager_RoleStatus").remove();
        const table = $("#_pocket_CacheManagerTable");
        const statusList = await this.loadRoleStatusCacheObjects();
        for (const co of statusList) {
            const status = co.status;
            let html = "<tr class='C_pocket_CacheManager_RoleStatus'>";
            html += "<td style='width:64px;height:64px'>" + (status?.readImageHtml ?? NpcLoader.getNpcImageHtml("U_041")!) + "</td>";
            html += "<th>" + (status?.name ?? "-") + "</th>";
            html += "<th>" + (PocketFormatter.formatRoleLevelHTML(status?.readLevel)) + "</th>";
            html += "<td>" + (status?.mirrorCategory ?? "-") + "</td>";
            html += "<td>" + (status?.career ?? "-") + "</td>";
            html += "<td>" + (status?.readAdditionalRP?.toLocaleString() ?? "-") + "</td>";
            html += "<td>" + (status?.readConsecrateRP?.toLocaleString() ?? "-") + "</td>";
            html += "<td>" + (status?.battleCount?.toLocaleString() ?? "-") + "</td>";
            html += "<td>" + (status?.town?.name ?? "-") + "</td>";
            html += "<td>" + (status?.petGender ?? "-") + "</td>";
            html += "<th>" + (PocketFormatter.formatPetLevelHTML(status?.readPetLevel)) + "</th>";
            html += "<td>" + (status?.updateTimeLocalString ?? "-") + "</td>";
            html += "<td>" + (status?.revision ?? "-") + "</td>";
            html += "</tr>";
            table.append($(html));
        }
    }

    async dispose() {
    }

    private async loadRoleStatusCacheObjects() {
        let statusList: RoleStatusCacheObject[] = [];
        const includeExternal = LocalSettingManager.isIncludeExternal();
        for (const roleId of TeamMemberLoader.loadTeamMembersAsMap(includeExternal).keys()) {
            const status = (await new RoleStatusManager(roleId).load()) ?? undefined;
            statusList.push(new RoleStatusCacheObject(roleId, status));
        }
        if (this.sorter !== undefined) {
            if (this.sorter === "Level") {
                statusList = statusList.sort((a, b) => {
                    const v1 = a.status?.readLevel ?? -1;
                    const v2 = b.status?.readLevel ?? -1;
                    return v2 - v1;
                });
            } else if (this.sorter === "AdditionalRP") {
                statusList = statusList.sort((a, b) => {
                    const v1 = a.status?.readAdditionalRP ?? -1;
                    const v2 = b.status?.readAdditionalRP ?? -1;
                    return v2 - v1;
                });
            } else if (this.sorter === "ConsecrateRP") {
                statusList = statusList.sort((a, b) => {
                    const v1 = a.status?.readConsecrateRP ?? -1;
                    const v2 = b.status?.readConsecrateRP ?? -1;
                    return v2 - v1;
                });
            } else if (this.sorter === "BattleCount") {
                statusList = statusList.sort((a, b) => {
                    const v1 = a.status?.battleCount ?? -1;
                    const v2 = b.status?.battleCount ?? -1;
                    return v2 - v1;
                });
            } else if (this.sorter === "PetLevel") {
                statusList = statusList.sort((a, b) => {
                    const v1 = a.status?.readPetLevel ?? -1;
                    const v2 = b.status?.readPetLevel ?? -1;
                    return v2 - v1;
                });
            }
            this.sorter = undefined;
        }
        return statusList;
    }
}

class CacheManagerFeature extends CommonWidgetFeature {
}

class RoleStatusCacheObject {

    readonly roleId: string;
    readonly status?: RoleStatus;

    constructor(roleId: string, status?: RoleStatus) {
        this.roleId = roleId;
        this.status = status;
    }

}

export {CacheManager, CacheManagerFeature};