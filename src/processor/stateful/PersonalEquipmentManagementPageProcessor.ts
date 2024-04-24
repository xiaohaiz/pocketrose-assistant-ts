import BattleFieldTrigger from "../../core/trigger/BattleFieldTrigger";
import ButtonUtils from "../../util/ButtonUtils";
import CommentBoard from "../../util/CommentBoard";
import Credential from "../../util/Credential";
import EquipmentConsecrateManager from "../../core/equipment/EquipmentConsecrateManager";
import EquipmentSetConfig from "../../core/equipment/EquipmentSetConfig";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import LocationModeMap from "../../core/location/LocationModeMap";
import LocationModeTown from "../../core/location/LocationModeTown";
import MessageBoard from "../../util/MessageBoard";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import NpcLoader from "../../core/role/NpcLoader";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import PersonalEquipmentManagementPageParser from "../../core/equipment/PersonalEquipmentManagementPageParser";
import SetupLoader from "../../core/config/SetupLoader";
import StatefulPageProcessor from "../StatefulPageProcessor";
import StorageUtils from "../../util/StorageUtils";
import StringUtils from "../../util/StringUtils";
import TownBank from "../../core/bank/TownBank";
import TownDashboard from "../../core/dashboard/TownDashboard";
import TreasureBag from "../../core/equipment/TreasureBag";
import TreasureBagPage from "../../core/equipment/TreasureBagPage";
import _ from "lodash";
import {EquipmentManager} from "../../widget/EquipmentManager";
import {EquipmentStatusTrigger} from "../../core/trigger/EquipmentStatusTrigger";
import {Equipment} from "../../core/equipment/Equipment";
import {PocketFormGenerator} from "../../pocket/PocketPage";
import {RoleManager} from "../../widget/RoleManager";

class PersonalEquipmentManagementPageProcessor extends StatefulPageProcessor {

    private readonly formGenerator: PocketFormGenerator;
    private roleManager?: RoleManager;
    private readonly equipmentManager: EquipmentManager;
    private equipmentSetPanelOpened = false;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        const locationMode = this.createLocationMode()!;

        this.formGenerator = new PocketFormGenerator(credential, locationMode);

        if (!(locationMode instanceof LocationModeMap)) {
            this.roleManager = new RoleManager(credential, locationMode);
            this.roleManager.feature.onRefresh = () => {
                this.equipmentManager.renderHitStatus(this.roleManager?.role);
            };
        }

        this.equipmentManager = new EquipmentManager(credential, locationMode);
        this.equipmentManager.feature.enableRecoverItem = true;
        this.equipmentManager.feature.enableGemTransfer = true;
        this.equipmentManager.feature.enableGrowthTriggerOnDispose = true;
        this.equipmentManager.feature.enableSpaceTriggerOnDispose = true;
        this.equipmentManager.feature.enableStatusTriggerOnDispose = true;
        this.equipmentManager.feature.enableUsingTriggerOnDispose = true;
        this.equipmentManager.feature.onRefresh = () => {
            this.equipmentManager.renderHitStatus(this.roleManager?.role);
        }
    }

    async refresh() {
        await this.roleManager?.reload();
        await this.roleManager?.render();
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        this.equipmentManager.renderHitStatus(this.roleManager?.role);
    }

    async doProcess(): Promise<void> {
        this.equipmentManager.equipmentPage = PersonalEquipmentManagementPageParser.parsePage(PageUtils.currentPageHtml());

        await this.doBeforeReformatPage()
        await this.createPage()
        await this.doPostReformatPage();

        this.roleManager?.bindButtons();
        this.equipmentManager.bindButtons();
        await this.roleManager?.reload();
        await this.roleManager?.render();
        await this.equipmentManager.render();
        this.equipmentManager.renderHitStatus(this.roleManager?.role);

        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onKeyPressed("s", () => PageUtils.triggerClick("itemShopButton"))
            .onKeyPressed("u", () => PageUtils.triggerClick("updateButton"))
            .onKeyPressed("y", () => PageUtils.triggerClick("gemFuseButton"))
            .onKeyPressed("z", () => {
                PageUtils.triggerClick("closeBagButton");
                PageUtils.triggerClick("closeWarehouseButton");
            })
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .bind()
    }

    async doBeforeReformatPage() {
    }

    private async createPage() {
        const t0 = $("table:first")
            .attr("id", "t0")
            .removeAttr("height");

        t0.find("tr:first")
            .attr("id", "tr0")
            .find("td:first")
            .attr("id", "pageTitle")
            .removeAttr("width")
            .removeAttr("height")
            .removeAttr("bgcolor")
            .css("background-color", "navy")
            .css("color", "yellowgreen")
            .html("" +
                "<table style='background-color:transparent;width:100%;margin:auto;border-width:0'>" +
                "<tbody>" +
                "<tr>" +
                "<td style='width:100%;font-size:150%;font-weight:bold;text-align:left;color:yellowgreen'>" +
                "＜＜ 装 备 管 理 （3.0） ＞＞" +
                "</td>" +
                "<td style='white-space:nowrap'>" +
                "<span style='display:none'> <button role='button' id='itemShopButton' disabled>" + ButtonUtils.createTitle("商店", "s") + "</button></span>" +
                "<span style='display:none'> <button role='button' id='gemFuseButton' disabled>" + ButtonUtils.createTitle("宝石", "y") + "</button></span>" +
                "<span style='display:none'> <button role='button' id='updateButton' style='color:red' disabled>" + ButtonUtils.createTitle("统计", "u") + "</button></span>" +
                "<span> <button role='button' id='refreshButton'>" + ButtonUtils.createTitle("刷新", "r") + "</button></span>" +
                "<span> <button role='button' id='returnButton'>" + ButtonUtils.createTitle("退出", "Esc") + "</button></span>" +
                "</td>" +
                "</tr>" +
                "</tbody>" +
                "</table>" +
                "");

        $("#tr0")
            .next()
            .attr("id", "tr1")
            .find("td:first")
            .find("table:first")
            .find("tr:first")
            .find("td:first")
            .attr("id", "roleImage")
            .next()
            .removeAttr("width")
            .css("width", "100%")
            .next().remove();

        const roleLocation = this.roleLocation;
        $("#roleImage")
            .next()
            .find("table:first")
            .find("tr:first")
            .next()
            .find("td:eq(2)")
            .attr("id", "roleHealth")
            .next()
            .attr("id", "roleMana")
            .parent()
            .next()
            .find("td:last")
            .attr("id", "roleCash")
            .parent()
            .after($("" +
                "<tr>" +
                "<td style='background-color:#E0D0B0'>坐标点</td>" +
                "<td style='background-color:#E8E8D0;text-align:right;font-weight:bold;color:red' " +
                "colspan='5' id='roleLocation'>" +
                (roleLocation === undefined ? "未知" : roleLocation) +
                "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='background-color:#E0D0B0;text-align:center;white-space:nowrap' " +
                "colspan='6' id='equipmentExperienceSetting'>" +
                "<button role='button' class='C_equipmentExperienceSetting' id='_ees_a' style='color:grey'>正在练武器</button>" +
                "<button role='button' class='C_equipmentExperienceSetting' id='_ees_b' style='color:grey'>正在练防具</button>" +
                "<button role='button' class='C_equipmentExperienceSetting' id='_ees_c' style='color:grey'>正在练饰品</button>" +
                "</td>" +
                "</tr>" +
                ""));

        $("#tr1")
            .next()
            .attr("id", "tr2")
            .find("td:first")
            .attr("id", "messageBoardContainer")
            .removeAttr("height");
        MessageBoard.createMessageBoardStyleB("messageBoardContainer", NpcLoader.randomNpcImageHtml());
        $("#messageBoard")
            .css("background-color", "black")
            .css("color", "wheat");

        let html = "";
        html += "<tr id='tr3' style='display:none'>";
        html += "<td id='equipmentSetPanel' style='background-color:#F8F0E0;text-align:center'>";
        html += "</td>";
        html += "</tr>";
        html += "<tr id='tr4' style='display:none'>";
        html += "<td style='background-color:#F8F0E0;text-align:center'></td>";
        html += "</tr>";
        html += "<tr id='tr4_0' style='display:none'>";
        html += "<td style='background-color:#F8F0E0;text-align:center'></td>";
        html += "</tr>"
        html += "<tr id='tr4_1' style='display:none'>";
        html += "<td style='background-color:#F8F0E0;text-align:center'></td>";
        html += "</tr>"
        html += "<tr id='tr4_2' style='display:none'>";
        html += "<td style='background-color:#F8F0E0;text-align:center'></td>";
        html += "</tr>";
        html += "<tr id='tr5' style='display:none'>";
        html += "<td>";
        html += "<div id='extension_1'></div>";
        html += "<div id='extension_2'></div>";
        html += "<div id='extension_3'></div>";
        html += "<div id='extension_4'></div>";
        html += "<div id='extension_5'></div>";
        html += "</td>";
        html += "</tr>";
        html += "<tr id='tr6'>";
        html += "<td id='equipmentList'></td>";
        html += "</tr>";
        $("#tr2").after($(html));

        await this.doResetMessageBoard();

        await this.doBindEquipmentExperienceSettingButton()
        await this.bindEquipmentSetButton();
        await this.doBindReturnButton()
        await this.doBindRefreshButton()
        await this.doBindItemShopButton();
        await this.doBindGemFuseButton();
        await this.doBindUpdateButton();

        $("#equipmentList").html(this.equipmentManager.generateHTML());
        $("#roleCash").html("-");
    }

    async doResetMessageBoard() {
        let msg = "<b style='font-size:120%;color:wheat'>又来管理您的装备来啦？就这点破烂折腾来折腾去的，您累不累啊。</b>";
        MessageBoard.resetMessageBoard(msg);
    }

    async doBindEquipmentExperienceSettingButton() {
        const config = SetupLoader.loadEquipmentExperienceConfig(this.credential.id)
        if (config.weapon) PageUtils.changeColorBlue("_ees_a")
        if (config.armor) PageUtils.changeColorBlue("_ees_b")
        if (config.accessory) PageUtils.changeColorBlue("_ees_c")

        $(".C_equipmentExperienceSetting").on("click", event => {
            const btnId = $(event.target).attr("id") as string
            const mode = StringUtils.substringAfterLast(btnId, "_")
            PageUtils.toggleColor(
                btnId,
                () => this._changeEquipmentExperienceSetting(mode, true),
                () => this._changeEquipmentExperienceSetting(mode, false)
            )
        })
    }

    async doBindReturnButton() {
        $("#extension_1").html(() => {
            return this.formGenerator.generateReturnFormHTML();
        });
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.doBeforeExit().then(() => {
                PageUtils.triggerClick("_pocket_ReturnSubmit");
            });
        });
    }

    async doBindRefreshButton() {
        $("#refreshButton").on("click", () => {
            PageUtils.disableElement("refreshButton")
            PageUtils.scrollIntoView("messageBoard");
            this.refresh().then(() => {
                MessageBoard.publishMessage("装备管理刷新完成。")
                PageUtils.enableElement("refreshButton")
            })
        })
    }

    async doBindItemShopButton() {
        if (this.createLocationMode() instanceof LocationModeTown) {
            $("#extension_2").html(PageUtils.generateItemShopForm(this.credential, this.townId!));
            $("#itemShopButton")
                .prop("disabled", false)
                .on("click", () => {
                    PageUtils.disablePageInteractiveElements();
                    this.doBeforeExit().then(() => {
                        PageUtils.triggerClick("openItemShop");
                    });
                })
                .parent().show();
        }
    }

    async doBindGemFuseButton() {
        if (this.createLocationMode() instanceof LocationModeTown) {
            $("#extension_3").html(PageUtils.generateGemHouseForm(this.credential, this.townId));
            $("#gemFuseButton")
                .prop("disabled", false)
                .on("click", () => {
                    PageUtils.disablePageInteractiveElements();
                    this.doBeforeExit().then(() => {
                        PageUtils.triggerClick("openGemHouse");
                    });
                })
                .parent().show();
        }
    }

    async doBindUpdateButton() {
        if (!(this.createLocationMode() instanceof LocationModeMap)) {
            $("#updateButton")
                .prop("disabled", false)
                .on("click", () => {
                    PageUtils.disableElement("updateButton");
                    MessageBoard.publishMessage("开始更新装备数据......");
                    new EquipmentStatusTrigger(this.credential)
                        .withEquipmentPage(this.equipmentManager.equipmentPage)
                        .triggerUpdate()
                        .then(() => {
                            MessageBoard.publishMessage("装备数据（百宝袋|城堡仓库）更新完成。");
                            PageUtils.enableElement("updateButton");
                        });
                })
                .parent().show();
        }
    }

    async doPostReformatPage() {
        if (this.createLocationMode() instanceof LocationModeTown) {
            CommentBoard.createCommentBoard(NpcLoader.getNpcImageHtml("饭饭")!);
            CommentBoard.writeMessage("我就要一键祭奠，就要，就要！");
            CommentBoard.writeMessage("<input type='button' id='consecrateButton' value='祭奠选择的装备' style='display:none'>");

            new MouseClickEventBuilder(this.credential)
                .bind($("#p_3139"), () => {
                    new TownDashboard(this.credential).open().then(dashboardPage => {
                        if (dashboardPage.role!.canConsecrate) {
                            $("#consecrateButton").show();
                        } else {
                            MessageBoard.publishWarning("祭奠还在冷却中！");
                            PageUtils.scrollIntoView("messageBoard");
                        }
                    });
                });
            $("#consecrateButton")
                .on("click", () => {
                    const candidate = _.forEach(this.equipmentManager._calculateEquipmentSelection())
                        .map(it => this.equipmentManager.equipmentPage!.findEquipment(it))
                        .filter(it => it !== null)
                        .map(it => it!)
                        .filter(it => !it.using)
                        .filter(it => it.isWeapon || it.isArmor || it.isAccessory);
                    if (candidate.length === 0) {
                        MessageBoard.publishWarning("没有选择可祭奠的装备，忽略！");
                        PageUtils.scrollIntoView("messageBoard");
                        return;
                    }
                    const consecrateCandidateNames = _.forEach(candidate)
                        .map(it => it.fullName)
                        .join("、");
                    if (!confirm("请务必确认你将要祭奠的这些装备：" + consecrateCandidateNames)) {
                        return;
                    }
                    this.consecrateEquipment(candidate).then(() => {
                        $("#consecrateButton").hide();
                        PageUtils.scrollIntoView("messageBoard");
                    });
                });
        }
    }

    async doBeforeExit() {
        await this.equipmentManager.dispose();
        if (this.createLocationMode() instanceof LocationModeTown) {
            await new BattleFieldTrigger(this.credential)
                .withRole(this.roleManager?.role)
                .triggerUpdate();
        }
    }

    _changeEquipmentExperienceSetting(mode: string, value: boolean) {
        const config = SetupLoader.loadEquipmentExperienceConfig(this.credential.id);
        switch (mode) {
            case "a":
                config.weapon = value
                break
            case "b":
                config.armor = value
                break
            case "c":
                config.accessory = value
                break
        }
        const document = config.asDocument();
        StorageUtils.set("_pa_065_" + this.credential.id, JSON.stringify(document));
    }

    // ========================================================================
    // 装备套装相关的设置，点击左上角的头像激活。
    // ========================================================================

    private async bindEquipmentSetButton() {
        new MouseClickEventBuilder(this.credential)
            .bind($("#roleImage"), () => {
                if (this.equipmentSetPanelOpened) {
                    $(".C_equipmentSetButton").off("click");
                    $("#equipmentSetPanel").html("");
                    $("#tr3").hide();
                    this.equipmentSetPanelOpened = false;
                } else {
                    this.renderEquipmentSetPanel().then(() => {
                        this.equipmentSetPanelOpened = true;
                    });
                }
            });
    }

    private async renderEquipmentSetPanel() {
        let bagPage: TreasureBagPage | undefined = undefined;
        const bag = this.equipmentManager.equipmentPage!.findTreasureBag();
        if (bag !== null) {
            bagPage = await new TreasureBag(this.credential).open(bag.index!);
        }

        const weaponCandidate = EquipmentSetConfig.generateCandidates(
            "WEA", this.equipmentManager.equipmentPage!.equipmentList!, bagPage?.equipmentList
        );
        const armorCandidate: string[] = EquipmentSetConfig.generateCandidates(
            "ARM", this.equipmentManager.equipmentPage!.equipmentList!, bagPage?.equipmentList
        );
        const accessoryCandidate: string[] = EquipmentSetConfig.generateCandidates(
            "ACC", this.equipmentManager.equipmentPage!.equipmentList!, bagPage?.equipmentList
        );

        let html = "";
        html += "<table style='background-color:#888888;margin:auto;text-align:center'>";
        html += "<tbody style='background-color:#F8F0E0'>";
        html += "<tr style='background-color:skyblue'>";
        html += "<th>编号</th>";
        html += "<th>别名</th>";
        html += "<th>武器</th>";
        html += "<th>防具</th>";
        html += "<th>饰品</th>";
        html += "<th>重置</th>";
        html += "</tr>";

        const codes = ["A", "B", "C", "D", "E"];
        for (const code of codes) {
            html += "<tr id='_equipmentSet_" + code + "'>";
            html += "<th>" + code + "</th>";
            html += "<td><input type='text' size='4' maxlength='6' spellcheck='false'></td>";
            html += "<td>";
            html += EquipmentSetConfig.generateSelectHTML(weaponCandidate);
            html += "</td>";
            html += "<td>";
            html += EquipmentSetConfig.generateSelectHTML(armorCandidate);
            html += "</td>";
            html += "<td>";
            html += EquipmentSetConfig.generateSelectHTML(accessoryCandidate);
            html += "</td>";
            html += "<td>";
            html += "<button role='button' class='C_equipmentSetButton C_resetEquipmentSet' " +
                "id='_resetEquipmentSet_" + code + "'>重置</button>";
            html += "</td>";
            html += "</tr>";
        }
        html += "<tr>";
        html += "<td style='text-align:right' colspan='6'>";
        html += "<button role='button' id='saveEquipmentSetButton' " +
            "class='C_equipmentSetButton'>保存套装设置</button>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("#equipmentSetPanel").html(html);
        $("#tr3").show();

        for (const code of codes) {
            const config = SetupLoader.loadEquipmentSetConfig(this.credential.id, code);
            const tr = $("#_equipmentSet_" + code);
            if (config.alias !== undefined) {
                tr.find("input:text:first").val(config.alias);
            }
            if (config.weaponName !== undefined) {
                tr.find("select:first")
                    .find("> option[value='" + config.weaponName + "']")
                    .prop("selected", true);
            }
            if (config.armorName !== undefined) {
                tr.find("select:eq(1)")
                    .find("> option[value='" + config.armorName + "']")
                    .prop("selected", true);
            }
            if (config.accessoryName !== undefined) {
                tr.find("select:eq(2)")
                    .find("> option[value='" + config.accessoryName + "']")
                    .prop("selected", true);
            }
        }

        const mapping: any = {
            "A": "_pa_019_",
            "B": "_pa_020_",
            "C": "_pa_021_",
            "D": "_pa_022_",
            "E": "_pa_023_"
        };
        $(".C_resetEquipmentSet").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const code = StringUtils.substringAfterLast(btnId, "_");
            const tr = $("#_equipmentSet_" + code);
            tr.find("input:text:first").val("");
            tr.find("select:first")
                .find("> option[value='NONE']")
                .prop("selected", true);
            tr.find("select:eq(1)")
                .find("> option[value='NONE']")
                .prop("selected", true);
            tr.find("select:eq(2)")
                .find("> option[value='NONE']")
                .prop("selected", true);
        });
        $("#saveEquipmentSetButton").on("click", () => {
            const codes = ["A", "B", "C", "D", "E"];
            for (const code of codes) {
                const config = new EquipmentSetConfig();
                config.index = code;

                const tr = $("#_equipmentSet_" + code);
                let s = tr.find("input:text:first").val() as string;
                if (s !== "" && _.trim(s) !== "") {
                    config.alias = _.trim(s);
                }
                s = tr.find("select:first").val() as string;
                if (s !== "NONE") {
                    config.weaponName = s;
                }
                s = tr.find("select:eq(1)").val() as string;
                if (s !== "NONE") {
                    config.armorName = s;
                }
                s = tr.find("select:eq(2)").val() as string;
                if (s !== "NONE") {
                    config.accessoryName = s;
                }

                const key = mapping[code] + this.credential.id;
                StorageUtils.set(key, JSON.stringify(config));
            }
            MessageBoard.publishMessage("套装设置已经保存。");
            this.equipmentManager.reload().then(() => {
                this.equipmentManager.render().then();
            });
        });
    }

    private async consecrateEquipment(candidate: Equipment[]) {
        const indexList = _.forEach(candidate).map(it => it.index!);
        const nameList = _.forEach(candidate).map(it => it.fullName);
        await new TownBank(this.credential, this.townId).withdraw(100);
        await new EquipmentConsecrateManager(this.credential).consecrate(indexList, nameList);
        await new TownBank(this.credential, this.townId).deposit();
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        // 祭奠完成后会造成角色额外RP数值变化，必须修正这里，否则会造成无法正确切换战斗场所。
        // 祭奠只允许在城市的时候执行，因此这个时候重新加载角色是安全的。
        await this.roleManager?.reload();
    }
}

export = PersonalEquipmentManagementPageProcessor;