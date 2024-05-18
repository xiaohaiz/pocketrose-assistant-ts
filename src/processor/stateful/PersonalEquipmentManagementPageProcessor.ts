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
import SetupLoader from "../../setup/SetupLoader";
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
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import {RoleManager} from "../../widget/RoleManager";
import LocationModeCastle from "../../core/location/LocationModeCastle";
import LocationModeMetro from "../../core/location/LocationModeMetro";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("EQUIPMENT");

class PersonalEquipmentManagementPageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown | LocationModeCastle | LocationModeMap | LocationModeMetro;
    private roleManager?: RoleManager;
    private readonly equipmentManager: EquipmentManager;
    private equipmentSetPanelOpened = false;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode()!;

        if (!(this.location instanceof LocationModeMap)) {
            this.roleManager = new RoleManager(credential, this.location);
            this.roleManager.feature.enableBankAccount = true;
            this.roleManager.feature.onRefresh = () => {
                this.equipmentManager.renderRoleStatus(this.roleManager?.role);
            };
        }

        this.equipmentManager = new EquipmentManager(credential, this.location);
        this.equipmentManager.feature.enableExperienceConfig = true;
        this.equipmentManager.feature.enableRecoverItem = true;
        this.equipmentManager.feature.enableGemTransfer = true;
        this.equipmentManager.feature.enableFullAutoSetExperience = true;
        this.equipmentManager.feature.onRefresh = async () => {
            await this.roleManager?.reload();
            await this.roleManager?.render();
            this.equipmentManager.renderRoleStatus(this.roleManager?.role);
        }
    }

    async doProcess(): Promise<void> {
        this.equipmentManager.equipmentPage = PersonalEquipmentManagementPageParser.parsePage(PageUtils.currentPageHtml());

        await this.generateHTML()
        await this.resetMessageBoard();
        await this.bindButtons();

        this.roleManager?.bindButtons();
        this.equipmentManager.bindButtons();
        await this.roleManager?.reload();
        await this.roleManager?.render();
        await this.equipmentManager.render();
        this.equipmentManager.renderRoleStatus(this.roleManager?.role);

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
            .doBind()
    }

    private async generateHTML() {
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
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜ 装 备 管 理 ＞＞", this.roleLocation);
            });
        $("#_pocket_page_command").html(() => {
            return "" +
                "<span style='display:none'> <button role='button' class='C_pocket_StatelessElement' id='itemShopButton' disabled>" + ButtonUtils.createTitle("商店", "s") + "</button></span>" +
                "<span style='display:none'> <button role='button' class='C_pocket_StatelessElement' id='gemFuseButton' disabled>" + ButtonUtils.createTitle("宝石", "y") + "</button></span>" +
                "<span style='display:none'> <button role='button' class='C_pocket_StatelessElement' id='updateButton' style='color:red' disabled>" + ButtonUtils.createTitle("统计", "u") + "</button></span>" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='refreshButton'>" + ButtonUtils.createTitle("刷新", "r") + "</button></span>" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='returnButton'>" + ButtonUtils.createTitle("退出", "Esc") + "</button></span>";
        });

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

        $("#roleImage").next().html(() => {
            return this.roleManager?.generateHTML() ?? "";
        });

        $("#tr1")
            .next()
            .attr("id", "tr2")
            .find("td:first")
            .attr("id", "messageBoardContainer")
            .removeAttr("height");
        MessageBoard.createMessageBoardStyleB("messageBoardContainer", NpcLoader.randomNpcImageHtml());
        $("#messageBoard")
            .css("background-color", "black")
            .css("color", "white");

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
        html += "</td>";
        html += "</tr>";
        html += "<tr id='tr6'>";
        html += "<td id='equipmentList'></td>";
        html += "</tr>";
        $("#tr2").after($(html));

        $("#equipmentList").html(this.equipmentManager.generateHTML());

        if (this.location instanceof LocationModeTown) {
            CommentBoard.createCommentBoard(NpcLoader.getNpcImageHtml("饭饭")!);
            CommentBoard.writeMessage("我就要一键祭奠，就要，就要！");
            CommentBoard.writeMessage("<input type='button' id='consecrateButton' value='祭奠选择的装备' style='display:none'>");

            new MouseClickEventBuilder()
                .bind($("#p_3139"), () => {
                    new TownDashboard(this.credential).open().then(dashboardPage => {
                        if (dashboardPage.role!.canConsecrate) {
                            $("#consecrateButton").show();
                        } else {
                            logger.warn("祭奠还在冷却中！");
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
                        logger.warn("没有选择可祭奠的装备，忽略！");
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

    private async resetMessageBoard() {
        MessageBoard.initializeManager();
        MessageBoard.initializeWelcomeMessage();
    }

    private async bindButtons() {
        new MouseClickEventBuilder()
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

        $("#_pocket_page_extension_0").html(() => {
            return new PocketFormGenerator(this.credential, this.location).generateReturnFormHTML();
        });
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.dispose().then(() => {
                PageUtils.triggerClick("_pocket_ReturnSubmit");
            });
        });

        $("#refreshButton").on("click", () => {
            PocketPage.scrollIntoTitle();
            PocketPage.disableStatelessElements();
            this.refresh().then(() => {
                MessageBoard.publishMessage("装备管理刷新完成。")
                PocketPage.enableStatelessElements();
            })
        });

        if (this.location instanceof LocationModeTown) {
            $("#_pocket_page_extension_1").html(PageUtils.generateItemShopForm(this.credential, this.townId!));
            $("#itemShopButton")
                .prop("disabled", false)
                .on("click", () => {
                    PageUtils.disablePageInteractiveElements();
                    this.dispose().then(() => {
                        PageUtils.triggerClick("openItemShop");
                    });
                })
                .parent().show();
        }

        if (this.location instanceof LocationModeTown) {
            $("#_pocket_page_extension_2").html(PageUtils.generateGemHouseForm(this.credential, this.townId));
            $("#gemFuseButton")
                .prop("disabled", false)
                .on("click", () => {
                    PageUtils.disablePageInteractiveElements();
                    this.dispose().then(() => {
                        PageUtils.triggerClick("openGemHouse");
                    });
                })
                .parent().show();
        }

        if (!(this.location instanceof LocationModeMap)) {
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

        new MouseClickEventBuilder().bind($("#messageBoardManager"), async () => {
            await this.resetMessageBoard();
        });
    }

    private async refresh() {
        await this.roleManager?.reload();
        await this.roleManager?.render();
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        this.equipmentManager.renderRoleStatus(this.roleManager?.role);
    }

    private async dispose() {
        await this.equipmentManager.dispose();
        if (this.createLocationMode() instanceof LocationModeTown) {
            await new BattleFieldTrigger(this.credential)
                .withRole(this.roleManager?.role)
                .triggerUpdate();
        }
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