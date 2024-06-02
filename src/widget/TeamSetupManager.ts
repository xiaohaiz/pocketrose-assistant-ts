import {CommonWidget, CommonWidgetFeature} from "./support/CommonWidget";
import Credential from "../util/Credential";
import LocationModeCastle from "../core/location/LocationModeCastle";
import LocationModeTown from "../core/location/LocationModeTown";
import TeamMemberLoader from "../core/team/TeamMemberLoader";
import _ from "lodash";
import NpcLoader from "../core/role/NpcLoader";
import {RoleStatusStorage} from "../core/role/RoleStatus";
import StringUtils from "../util/StringUtils";
import {BattleConfigManager, MiscConfigManager, UIConfigManager} from "../setup/ConfigManager";
import PageUtils from "../util/PageUtils";
import OperationMessage from "../util/OperationMessage";

class TeamSetupManager extends CommonWidget {

    readonly feature = new TeamSetupManagerFeature();

    constructor(credential: Credential, locationMode: LocationModeCastle | LocationModeTown) {
        super(credential, locationMode);
    }

    generateHTML(): string {
        return "<table style='background-color:#888888;margin:auto;width:100%;border-width:0'>" +
            "<tbody>" +
            "<tr>" +
            "<th style='background-color:navy;color:white;font-size:120%;vertical-align:top'>" +
            "团<br>队<br>设<br>置" +
            "</th>" +
            "<td style='border-spacing:0;width:100%;text-align:center;background-color:#F8F0E0'>" +
            "<table style='background-color:#888888;margin:auto;border-width:0'>" +
            "<tbody style='background-color:#F8F0E0;text-align:center' id='TeamSetupTable'>" +
            "</tbody>" +
            "</table>" +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>";
    }

    bindButtons() {
    }

    async reload() {
    }

    async render() {
        $(".C_TeamSetupButton").off("click");
        $(".C_TeamSetupItem").remove();

        const members = TeamMemberLoader.loadTeamMembers();
        if (members.length === 0) return;

        const maxRowCount = _.ceil(members.length / 10);
        const table = $("#TeamSetupTable");
        for (let currentRow = 0; currentRow < maxRowCount; currentRow++) {
            let html = "<tr class='C_TeamSetupItem'>";
            html += "<th></th>";
            for (let i = 0; i < 10; i++) {
                html += "<td style='width:64px;height:64px;white-space:nowrap'>";
                const index = currentRow * 10 + i;
                if (index < members.length) {
                    const member = members[index];
                    const roleId = member.id!;
                    let name = member.name;
                    let imageHtml = NpcLoader.getNpcImageHtml("U_041")!;
                    const role = await RoleStatusStorage.load(roleId);
                    if (role !== null) {
                        name = role.name;
                        imageHtml = role.readImageHtml ?? imageHtml;
                    }
                    imageHtml = $("<div>" + imageHtml + "</div>")
                        .find("img:first")
                        .attr("title", name!)
                        .parent()
                        .html();
                    html += imageHtml;
                }
                html += "</td>"
            }
            html += "</tr>";
            html += "<tr class='C_TeamSetupItem'>";
            html += "<th style='white-space:nowrap;background-color:wheat'>智能战斗选战场</th>";
            for (let i = 0; i < 10; i++) {
                html += "<td style='white-space:nowrap'>";
                const index = currentRow * 10 + i;
                if (index < members.length) {
                    const member = members[index];
                    html += "<button role='button' style='color:grey;font-weight:bold' " +
                        "class='C_StatelessElement C_pocket_059 C_TeamSetupButton' " +
                        "id='_pocket_059_" + member.id + "'>启用</button>";
                }
                html += "</td>"
            }
            html += "</tr>";
            html += "<tr class='C_TeamSetupItem'>";
            html += "<th style='white-space:nowrap;background-color:wheat;vertical-align:middle'>战斗场快捷设置</th>";
            for (let i = 0; i < 10; i++) {
                html += "<td style='white-space:nowrap'>";
                const index = currentRow * 10 + i;
                if (index < members.length) {
                    const member = members[index];
                    html += "<button role='button' style='color:grey;font-weight:bold' " +
                        "class='C_StatelessElement C_pocket_012 C_TeamSetupButton' " +
                        "id='_pocket_012_1_" + member.id + "'>初森</button><br>";
                    html += "<button role='button' style='color:grey;font-weight:bold' " +
                        "class='C_StatelessElement C_pocket_012 C_TeamSetupButton' " +
                        "id='_pocket_012_2_" + member.id + "'>中塔</button><br>";
                    html += "<button role='button' style='color:grey;font-weight:bold' " +
                        "class='C_StatelessElement C_pocket_012 C_TeamSetupButton' " +
                        "id='_pocket_012_3_" + member.id + "'>上洞</button><br>";
                    html += "<button role='button' style='color:grey;font-weight:bold' " +
                        "class='C_StatelessElement C_pocket_012 C_TeamSetupButton' " +
                        "id='_pocket_012_4_" + member.id + "'>神殿</button>";
                }
                html += "</td>"
            }
            html += "</tr>";
            html += "<tr class='C_TeamSetupItem'>";
            html += "<th style='white-space:nowrap;background-color:wheat'>关闭收益的入口</th>";
            for (let i = 0; i < 10; i++) {
                html += "<td style='white-space:nowrap'>";
                const index = currentRow * 10 + i;
                if (index < members.length) {
                    const member = members[index];
                    html += "<button role='button' style='color:grey;font-weight:bold' " +
                        "class='C_StatelessElement C_pocket_030 C_TeamSetupButtons' " +
                        "id='_pocket_030_" + member.id + "'>关闭</button>";
                }
                html += "</td>"
            }
            html += "</tr>";
            table.append($(html));
        }

        for (const member of members) {
            const battleConfigManager = new BattleConfigManager(member.id!);
            const uiConfigManager = new UIConfigManager(member.id!);
            const miscConfigManager = new MiscConfigManager(member.id!);

            let btnId = "_pocket_059_" + member.id;
            if (battleConfigManager.isAutoSetBattleFieldEnabled) {
                PageUtils.changeColorBlue(btnId);
            } else {
                PageUtils.changeColorGrey(btnId);
            }

            PageUtils.changeColorGrey("_pocket_012_1_" + member.id);
            PageUtils.changeColorGrey("_pocket_012_2_" + member.id);
            PageUtils.changeColorGrey("_pocket_012_3_" + member.id);
            PageUtils.changeColorGrey("_pocket_012_4_" + member.id);
            const battleFieldConfig = battleConfigManager.loadPersonalBattleFieldConfig();
            if (battleFieldConfig.primary) PageUtils.changeColorBlue("_pocket_012_1_" + member.id);
            if (battleFieldConfig.junior) PageUtils.changeColorBlue("_pocket_012_2_" + member.id);
            if (battleFieldConfig.senior) PageUtils.changeColorBlue("_pocket_012_3_" + member.id);
            if (battleFieldConfig.zodiac) PageUtils.changeColorBlue("_pocket_012_4_" + member.id);

            btnId = "_pocket_030_" + member.id;
            if (miscConfigManager.isCollectTownTaxDisabled) {
                PageUtils.changeColorBlue(btnId);
            } else {
                PageUtils.changeColorGrey(btnId);
            }
        }

        if (BattleConfigManager.loadGlobalBattleFieldConfig().configured) {
            // Disable some setup options in case of global battlefield configured.
            $(".C_pocket_059").prop("disabled", true);
            $(".C_pocket_012").prop("disabled", true);
        }

        this.bindTeamSetupButtons();
    }

    async dispose() {
    }

    private bindTeamSetupButtons() {
        $(".C_pocket_059").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const roleId = StringUtils.substringAfter(btnId, "_pocket_059_");
            const configManager = new BattleConfigManager(roleId);
            PageUtils.toggleColor(
                btnId,
                () => configManager.enableAutoSetBattleField(),
                () => configManager.disableAutoSetBattleField()
            );
            this.feature.publishRefresh(OperationMessage.success());
        });
        $(".C_pocket_012").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const roleId = this.extractRoleId(btnId);
            if (!roleId) return;
            PageUtils.toggleColor(btnId, undefined, undefined);
            const configManager = new BattleConfigManager(roleId);
            configManager.setPersonalBattleFieldConfig(
                PageUtils.isColorBlue("_pocket_012_1_" + roleId),
                PageUtils.isColorBlue("_pocket_012_2_" + roleId),
                PageUtils.isColorBlue("_pocket_012_3_" + roleId),
                PageUtils.isColorBlue("_pocket_012_4_" + roleId)
            );
            this.feature.publishRefresh(OperationMessage.success());
        });
        $(".C_pocket_030").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const roleId = StringUtils.substringAfter(btnId, "_pocket_030_");
            const configManager = new MiscConfigManager(roleId);
            PageUtils.toggleColor(
                btnId,
                () => configManager.disableCollectTownTax(),
                () => configManager.enableCollectTownTax()
            );
            this.feature.publishRefresh(OperationMessage.success());
        });
    }

    private extractRoleId(btnId: string) {
        const codes = ["1", "2", "3", "4"];
        for (const code of codes) {
            const prefix = "_pocket_012_" + code + "_";
            if (_.startsWith(btnId, prefix)) {
                return StringUtils.substringAfter(btnId, prefix);
            }
        }
        return undefined;
    }

    private async refresh(message: OperationMessage) {
        await this.reload();
        await this.render();
        this.feature.publishRefresh(message);
    }

}

class TeamSetupManagerFeature extends CommonWidgetFeature {
}

export {TeamSetupManager, TeamSetupManagerFeature};