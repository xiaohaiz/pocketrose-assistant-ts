import {AbstractSetupItem} from "../SetupSupport";
import {TownDashboardShortcutManager} from "../../core/dashboard/TownDashboardShortcutManager";
import _ from "lodash";
import StorageUtils from "../../util/StorageUtils";
import {PocketLogger} from "../../pocket/PocketLogger";
import StringUtils from "../../util/StringUtils";

const logger = PocketLogger.getLogger("SETUP");

class ComplexSetupItem083 extends AbstractSetupItem {

    private readonly name: string = "城市的快捷按钮";

    protected getCategory(): string {
        return "界面";
    }

    protected getCode(): string {
        return "083";
    }

    protected doRender(): void {
        const buttonClass = "C_" + this.getCode() + "_Button";
        $("." + buttonClass).off("click");
        const selectClass = "C_" + this.getCode() + "_Select";
        $("." + selectClass).off("change");

        let html = "<tr>";
        html += "<th style='background-color:#E8E8D0' class='C_setupItemName' id='_s_" + this.getCode() + "'>" + this.name + "</th>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "<td style='background-color:#EFE0C0'>";
        html += "<button role='button' " +
            "class='dynamic_button C_pocket_StatelessElement " + buttonClass + "' " +
            "id='_reset_" + this.getCode() + "_button'>重置</button>";
        html += "</td>";
        html += "<td style='background-color:#F8F0E0;text-align:left' colspan='2'>";
        for (let i = 1; i <= 8; i++) {
            html += "<span style='background-color:green;color:white;font-weight:bold'> " + i + " </span>";
            html += "<span> </span>";
            html += "<select id='_" + this.getCode() + "_shortcut_" + i + "' class='" + selectClass + "'>";
            html += "<option value='禁用'>禁用</option>";
            _.forEach(TownDashboardShortcutManager.getAvailableShortcutMappingIds(), it => {
                html += "<option value='" + it + "'>" + it + "</option>";
            });
            html += "</select>";
            html += "<span> </span>";
        }
        html += "</td>";
        html += "</tr>";

        $("#setup_item_table").append($(html));

        const config = TownDashboardShortcutManager.loadTownDashboardShortcutConfig();
        $("#_" + this.getCode() + "_shortcut_1")
            .find("> option[value='" + config.actualId1 + "']")
            .prop("selected", true);
        $("#_" + this.getCode() + "_shortcut_2")
            .find("> option[value='" + config.actualId2 + "']")
            .prop("selected", true);
        $("#_" + this.getCode() + "_shortcut_3")
            .find("> option[value='" + config.actualId3 + "']")
            .prop("selected", true);
        $("#_" + this.getCode() + "_shortcut_4")
            .find("> option[value='" + config.actualId4 + "']")
            .prop("selected", true);
        $("#_" + this.getCode() + "_shortcut_5")
            .find("> option[value='" + config.actualId5 + "']")
            .prop("selected", true);
        $("#_" + this.getCode() + "_shortcut_6")
            .find("> option[value='" + config.actualId6 + "']")
            .prop("selected", true);
        $("#_" + this.getCode() + "_shortcut_7")
            .find("> option[value='" + config.actualId7 + "']")
            .prop("selected", true);
        $("#_" + this.getCode() + "_shortcut_8")
            .find("> option[value='" + config.actualId8 + "']")
            .prop("selected", true);

        this.bindButtons();
    }

    private bindButtons() {
        $("#_reset_" + this.getCode() + "_button").on("click", async () => {
            StorageUtils.remove("_pa_" + this.code());
            logger.info("<b style='color:red'>" + this.name + "</b>已经重置。");
            $("#refreshSetupButton").trigger("click");
        });
        $(".C_" + this.getCode() + "_Select").on("change", async (event) => {
            const selectId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(selectId, "_"));
            const value = $("#" + selectId).val() as string;

            const config = TownDashboardShortcutManager.loadTownDashboardShortcutConfig();
            const document = config.asDocument();
            document["id" + index] = value;

            StorageUtils.set("_pa_" + this.code(), JSON.stringify(document));
            logger.info("<b style='color:red'>" + this.name + "</b>已经设置。");
        })
    }
}

export {ComplexSetupItem083};