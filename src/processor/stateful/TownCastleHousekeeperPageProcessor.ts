import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import LocationModeTown from "../../core/location/LocationModeTown";
import ButtonUtils from "../../util/ButtonUtils";
import PageUtils from "../../util/PageUtils";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import {TownCastleHousekeeperPage} from "../../core/castle/TownCastleHousekeeperPage";
import {TownCastleHousekeeperPageParser} from "../../core/castle/TownCastleHousekeeperPageParser";
import Castle from "../../core/castle/Castle";
import CastleInformation from "../../core/dashboard/CastleInformation";
import MessageBoard from "../../util/MessageBoard";
import CastleWarehousePage from "../../core/equipment/CastleWarehousePage";
import CastleRanchPage from "../../core/monster/CastleRanchPage";
import CastleWarehouse from "../../core/equipment/CastleWarehouse";
import CastleRanch from "../../core/monster/CastleRanch";
import {PocketPage} from "../../util/PocketPage";
import {RoleEquipmentStatusManager} from "../../core/equipment/RoleEquipmentStatusManager";

class TownCastleHousekeeperPageProcessor extends StatefulPageProcessor {

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
    }

    private housekeeperPage?: TownCastleHousekeeperPage;
    private castle?: Castle;
    private warehousePage?: CastleWarehousePage;
    private ranchPage?: CastleRanchPage;

    protected async doProcess(): Promise<void> {
        if (!(this.createLocationMode() instanceof LocationModeTown)) return;

        this.housekeeperPage = TownCastleHousekeeperPageParser.parsePage(PageUtils.currentPageHtml());

        await this.createPage();
        await this.bindButtons();

        await this.initializeCastle();
        if (this.castle === undefined) {
            // No castle found.
            MessageBoard.resetMessageBoard("<span style='font-weight:bold;color:yellow;font-size:120%'>" +
                "你说你连座城堡都没有的人，是谁给了你勇气来进入这个页面？是梁静茹么？麻利儿哪凉快哪歇着去，少来裹乱！</span>");
        } else {
            this.resetMessageBoard();
            $("#ID_castleWarehouse")
                .html(this.createCastleWarehouseHTML())
                .parent().show();
            $("#ID_castleRanch")
                .html(this.createCastleRanchHTML())
                .parent().show();

            await Promise.all([this.reloadCastleWarehouse(), this.reloadCastleRanch()]);
            await Promise.all([this.renderCastleWarehouse(), this.renderCastleRanch()]);
        }

        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .bind();
    }

    private async createPage() {
        $("body:first > center:first").remove();

        $("body:first > table:first")
            .removeAttr("height")
            .find("> tbody:first > tr:first > td:first")
            .removeAttr("bgcolor")
            .removeAttr("width")
            .removeAttr("height")
            .css("background-color", "navy")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜ 城 堡 管 家 ＞＞", this.roleLocation);
            });
        $("#_pocket_page_command").html(() => {
            return "" +
                "<span> <button role='button' id='refreshButton'>" + ButtonUtils.createTitle("刷新", "r") + "</button></span>" +
                "<span> <button role='button' id='returnButton'>" + ButtonUtils.createTitle("退出", "Esc") + "</button></span>" +
                "";
        });

        $("body:first > table:first > tbody:first > tr:eq(1) > td:first")
            .removeAttr("height")
            .find("> table:first > tbody:first > tr:first")
            .find("> td:first")
            .css("white-space", "nowrap")
            .next()
            .attr("id", "ID_roleStatus")
            .removeAttr("width")
            .removeAttr("align")
            .css("text-align", "center")
            .css("width", "100%")
            .next().remove();

        $("#ID_roleStatus")
            .find("> table:first")
            .removeAttr("width")
            .css("margin", "auto")
            .find("> tbody:first > tr:eq(2) > td:last")
            .attr("id", "ID_roleCash");

        $("body:first > table:first > tbody:first > tr:eq(2) > td:first")
            .removeAttr("height")
            .find("> table:first > tbody:first > tr:first > td:first")
            .attr("id", "messageBoard")
            .css("color", "white");

        $("body:first > table:first > tbody:first")
            .append($("" +
                "<tr style='display:none'>" +
                "<td id='ID_castleWarehouse' style='border-spacing:0'></td>" +
                "</tr>" +
                "<tr style='display:none'>" +
                "<td id='ID_castleRanch' style='border-spacing:0'></td>" +
                "</tr>" +
                ""));
    }

    private async bindButtons() {
        $("#_pocket_page_extension_0").html(() => {
            return PageUtils.generateReturnTownForm(this.credential);
        });
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.beforeReturn().then(() => {
                PageUtils.triggerClick("returnTown");
            });
        });
        $("#refreshButton").on("click", () => {
            PocketPage.scrollIntoTitle();
            if (this.castle === undefined) return;
            this.resetMessageBoard();
            this.refresh().then(() => {
                MessageBoard.publishMessage("城堡管家刷新完成。");
            });
        });
    }

    private resetMessageBoard(): void {
        MessageBoard.resetMessageBoard("<span style='color:wheat;font-size:120%;font-weight:bold'>" +
            "这里可以查看您的城堡仓库和牧场的存货，当然您的理解也没错，查看就是查看，仅仅也只是“查看”，别想多了。" +
            "</span>");
    }

    private async beforeReturn(): Promise<void> {
        const statusManager = new RoleEquipmentStatusManager(this.credential);
        await statusManager.updateCastleWarehouseEquipmentStatus(this.warehousePage);
    }

    private async refresh() {
        await Promise.all([this.reloadCastleWarehouse(), this.reloadCastleRanch()]);
        await Promise.all([this.renderCastleWarehouse(), this.renderCastleRanch()]);
    }

    private async initializeCastle() {
        const castlePage = await new CastleInformation().open();
        const castle = castlePage.findByRoleName(this.housekeeperPage!.role!.name!);
        if (castle !== null) this.castle = castle;
    }

    private createCastleWarehouseHTML(): string {
        return "" +
            "<table style='background-color:#888888;margin:auto;width:100%;text-align:center'>" +
            "<thead>" +
            "<tr style='background-color:skyblue'>" +
            "<th colspan='17'>城 堡 仓 库</th>" +
            "</tr>" +
            "<tr style='background-color:wheat'>" +
            "<th>序号</th>" +
            "<th>名字</th>" +
            "<th>种类</th>" +
            "<th>效果</th>" +
            "<th>重量</th>" +
            "<th>耐久</th>" +
            "<th>职业</th>" +
            "<th>攻需</th>" +
            "<th>防需</th>" +
            "<th>智需</th>" +
            "<th>精需</th>" +
            "<th>速需</th>" +
            "<th>威＋</th>" +
            "<th>重＋</th>" +
            "<th>幸＋</th>" +
            "<th>经验</th>" +
            "<th>属性</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody id='ID_castleWarehouseList'>" +
            "</tbody>" +
            "</table>" +
            "";
    }

    private createCastleRanchHTML(): string {
        return "" +
            "<table style='background-color:#888888;margin:auto;width:100%;text-align:center'>" +
            "<thead>" +
            "<tr style='background-color:skyblue'>" +
            "<th colspan='11'>城 堡 牧 场</th>" +
            "</tr>" +
            "<tr style='background-color:wheat'>" +
            "<th>序号</th>" +
            "<th>名字</th>" +
            "<th>性别</th>" +
            "<th>等级</th>" +
            "<th>生命</th>" +
            "<th>攻击</th>" +
            "<th>防御</th>" +
            "<th>智力</th>" +
            "<th>精神</th>" +
            "<th>速度</th>" +
            "<th>经验</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody id='ID_castleRanchList'>" +
            "</tbody>" +
            "</table>" +
            "";
    }

    private async reloadCastleWarehouse() {
        this.warehousePage = await new CastleWarehouse(this.credential).open();
    }

    private async reloadCastleRanch() {
        this.ranchPage = await new CastleRanch(this.credential).enter();
    }

    private async renderCastleWarehouse() {
        const table = $("#ID_castleWarehouseList");
        table.html("");

        const equipments = this.warehousePage!.sortStorageEquipmentList!;
        let sequence = 0;
        for (const equipment of equipments) {
            let html = "";
            html += "<tr style='background-color:#E8E8D0'>";
            html += "<th>" + (++sequence) + "</th>";
            html += "<td>" + equipment.nameHTML + "</td>";
            html += "<td>" + equipment.category + "</td>";
            html += "<td>" + equipment.power + "</td>";
            html += "<td>" + equipment.weight + "</td>";
            html += "<td>" + equipment.endureHtml + "</td>";
            html += "<td>" + equipment.requiredCareerHtml + "</td>";
            html += "<td>" + equipment.requiredAttackHtml + "</td>";
            html += "<td>" + equipment.requiredDefenseHtml + "</td>";
            html += "<td>" + equipment.requiredSpecialAttackHtml + "</td>";
            html += "<td>" + equipment.requiredSpecialDefenseHtml + "</td>";
            html += "<td>" + equipment.requiredSpeedHtml + "</td>";
            html += "<td>" + equipment.additionalPowerHtml + "</td>";
            html += "<td>" + equipment.additionalWeightHtml + "</td>";
            html += "<td>" + equipment.additionalLuckHtml + "</td>";
            html += "<td>" + equipment.experienceHTML + "</td>";
            html += "<td>" + equipment.attributeHtml + "</td>";
            html += "</tr>";
            table.append($(html));
        }
    }

    private async renderCastleRanch() {
        const table = $("#ID_castleRanchList");
        table.html("");

        const pets = this.ranchPage!.sortedRanchPetList!;
        let sequence = 0;
        for (const pet of pets) {
            let html = "";
            html += "<tr style='background-color:#E8E8D0'>";
            html += "<th>" + (++sequence) + "</th>";
            html += "<td>" + pet.nameHtml + "</td>";
            html += "<td>" + pet.gender + "</td>";
            html += "<td>" + pet.levelHtml + "</td>";
            html += "<td>" + pet.healthHtml + "</td>";
            html += "<td>" + pet.attackHtml + "</td>";
            html += "<td>" + pet.defenseHtml + "</td>";
            html += "<td>" + pet.specialAttackHtml + "</td>";
            html += "<td>" + pet.specialDefenseHtml + "</td>";
            html += "<td>" + pet.speedHtml + "</td>";
            html += "<td>" + pet.experienceHtml + "</td>";
            html += "</tr>";
            table.append($(html));
        }
    }
}

export {TownCastleHousekeeperPageProcessor};