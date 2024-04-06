import PersonalEquipmentManagementPageParser from "../../core/equipment/PersonalEquipmentManagementPageParser";
import PageUtils from "../../util/PageUtils";
import MessageBoard from "../../util/MessageBoard";
import NpcLoader from "../../core/role/NpcLoader";
import PersonalEquipmentManagementPage from "../../core/equipment/PersonalEquipmentManagementPage";
import PersonalEquipmentManagement from "../../core/equipment/PersonalEquipmentManagement";
import TreasureBag from "../../core/equipment/TreasureBag";
import TreasureBagPage from "../../core/equipment/TreasureBagPage";
import CastleWarehousePage from "../../core/equipment/CastleWarehousePage";
import CastleWarehouse from "../../core/equipment/CastleWarehouse";
import Equipment from "../../core/equipment/Equipment";
import _ from "lodash";
import StringUtils from "../../util/StringUtils";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import SetupLoader from "../../core/config/SetupLoader";
import StorageUtils from "../../util/StorageUtils";
import Role from "../../core/role/Role";
import PersonalStatus from "../../core/role/PersonalStatus";
import Castle from "../../core/castle/Castle";
import CastleInformation from "../../core/dashboard/CastleInformation";
import StatefulPageProcessor from "../StatefulPageProcessor";
import PageProcessorContext from "../PageProcessorContext";
import Credential from "../../util/Credential";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import EquipmentSetConfig from "../../core/equipment/EquipmentSetConfig";
import EquipmentSet from "../../core/equipment/EquipmentSet";
import EquipmentSetLoader from "../../core/equipment/EquipmentSetLoader";
import EquipmentSpaceTrigger from "../../core/trigger/EquipmentSpaceTrigger";
import EquipmentGrowthTrigger from "../../core/trigger/EquipmentGrowthTrigger";
import ButtonUtils from "../../util/ButtonUtils";
import EquipmentStatusTrigger from "../../core/trigger/EquipmentStatusTrigger";
import LocalSettingManager from "../../core/config/LocalSettingManager";
import TeamMemberLoader from "../../core/team/TeamMemberLoader";
import RoleEquipmentStatusStorage from "../../core/equipment/RoleEquipmentStatusStorage";
import Constants from "../../util/Constants";
import EquipmentUsingTrigger from "../../core/trigger/EquipmentUsingTrigger";
import RoleUsingEquipmentStorage from "../../core/role/RoleUsingEquipmentStorage";
import PocketPageRenderer from "../../util/PocketPageRenderer";
import LocationModeTown from "../../core/location/LocationModeTown";
import LocationModeCastle from "../../core/location/LocationModeCastle";
import PeopleFinderComponent from "../../component/PeopleFinderComponent";

abstract class PersonalEquipmentManagementPageProcessor extends StatefulPageProcessor {

    #equipmentPage?: PersonalEquipmentManagementPage;
    #treasureBagIndex?: number;
    #bagPage?: TreasureBagPage;
    #warehousePage?: CastleWarehousePage;

    treasureBagOpened = false;
    warehouseOpened = false;
    equipmentSetPanelOpened = false;

    #autoTransferGemTimer?: any;
    #autoPutGemIntoBagTimer?: any;

    peopleFinder?: PeopleFinderComponent;

    protected constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        const locationMode = this.createLocationMode();
        if (locationMode instanceof LocationModeTown || locationMode instanceof LocationModeCastle) {
            this.peopleFinder = new PeopleFinderComponent(credential, locationMode);
        }
    }

    get equipmentPage(): PersonalEquipmentManagementPage {
        return this.#equipmentPage!;
    }

    get treasureBagIndex(): number {
        return this.#treasureBagIndex!;
    }

    set treasureBagIndex(value: number) {
        this.#treasureBagIndex = value;
    }

    get hasTreasureBag(): boolean {
        return this.treasureBagIndex !== -99;
    }

    get bagPage(): TreasureBagPage | undefined {
        return this.#bagPage;
    }

    get warehousePage(): CastleWarehousePage | undefined {
        return this.#warehousePage;
    }

    #role?: Role
    #castle: Castle | null | undefined = undefined

    async #initializeRole() {
        if (!this.#role) this.#role = await new PersonalStatus(this.credential).load()
    }

    protected async reloadRole() {
        this.#role = await new PersonalStatus(this.credential).load();
    }

    async #initializeCastle() {
        if (this.#castle === undefined) {
            const castlePage = await new CastleInformation().open();
            this.#castle = castlePage.findByRoleName(this.equipmentPage.role!.name!);
        }
    }

    async doCheckCastleExistence(): Promise<boolean> {
        if (this.context?.get("_LOCATION") === "C") return true
        if (this.context?.get("castleName") !== undefined) return true;
        await this.#initializeCastle()
        return this.#castle !== undefined && this.#castle !== null
    }

    async loadRole(): Promise<Role> {
        await this.#initializeRole();
        return this.#role!;
    }

    async doInitializeTreasureBag() {
        const bag = this.equipmentPage.findTreasureBag();
        if (bag === null) {
            const bagOwned = (await this.loadRole()).masterCareerList!.includes("剑圣") || this.#role!.hasMirror!
            this.#treasureBagIndex = bagOwned ? -1 : -99;
        } else {
            this.#treasureBagIndex = bag.index!;
        }
    }

    async reloadEquipmentPage() {
        this.#equipmentPage = await new PersonalEquipmentManagement(this.credential, this.townId).open();
        await this.doInitializeTreasureBag();
        $("#roleCash").html(this.equipmentPage.role!.cash + " GOLD");
    }

    async reloadBagPage() {
        if (!this.treasureBagOpened || this.treasureBagIndex < 0) return;
        this.#bagPage = await new TreasureBag(this.credential).open(this.treasureBagIndex);
    }

    async reloadWarehousePage() {
        if (!(await this.doCheckCastleExistence())) return;
        this.#warehousePage = await new CastleWarehouse(this.credential).open();
    }

    async refresh() {
        await this.doResetMessageBoard();
        await this.reloadEquipmentPage();
        await this.doRenderPersonalEquipmentList();
        await this.reloadBagPage();
        await this.doRenderBagEquipmentList();
        await this.reloadWarehousePage();
        await this.doRenderWarehouseEquipmentList();
    }

    async doProcess(): Promise<void> {
        this.#equipmentPage = PersonalEquipmentManagementPageParser.parsePage(PageUtils.currentPageHtml());
        await this.doInitializeTreasureBag();
        await this.doBeforeReformatPage()
        await this.#reformatPage()
        await this.doPostReformatPage()
        await this.doRenderPersonalEquipmentList();
        await this.reloadBagPage();
        await this.doRenderBagEquipmentList();
        await this.reloadWarehousePage();
        await this.doRenderWarehouseEquipmentList();
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

    async #reformatPage() {
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
        html += "<tr id='tr6_0''><td id='commandPanel_1' style='background-color:#F8F0E0'>"
        html += "<table style='background-color:transparent;width:100%;margin:auto;border-width:0'>"
        html += "<tbody>"
        html += "<tr>"
        html += "<td style='width:100%'>"
        html += "<button role='button' id='useButton' class='C_selectPersonalEquipmentRequired' disabled>使用装备</button>"
        html += "<button role='button' id='putIntoBagButton' class='C_selectPersonalEquipmentRequired' disabled style='display:none'>放入百宝袋</button>"
        html += "<button role='button' id='putIntoWarehouseButton' class='C_selectPersonalEquipmentRequired' disabled style='display:none'>放入仓库</button>"
        html += "</td>"
        html += "<td id='bagCommandPanel' style='display:none;white-space:nowrap'>"
        html += "<button role='button' id='openBagButton' style='display:none'>打开百宝袋</button>"
        html += "<button role='button' id='closeBagButton' style='display:none'>" + ButtonUtils.createTitle("关闭百宝袋", "z") + "</button>"
        html += "<button role='button' id='blindBagButton' style='display:none'>从百宝袋盲取</button>"
        html += "</td>"
        html += "<td id='warehouseCommandPanel' style='display:none;white-space:nowrap'>"
        html += "<button role='button' id='openWarehouseButton' style='display:none'>打开仓库</button>"
        html += "<button role='button' id='closeWarehouseButton' style='display:none'>" + ButtonUtils.createTitle("关闭仓库", "z") + "</button>"
        html += "</td>"
        html += "</tr>"
        html += "</tbody>"
        html += "</table>"
        html += "</td></tr>"
        html += "<tr id='tr6_1' style='display:none'><td id='commandPanel_2' style='background-color:#F8F0E0;text-align:right'>"
        if (this.peopleFinder !== undefined) {
            html += this.peopleFinder.generateHTML();
            html += PocketPageRenderer.GO();
            html += "<button role='button' id='sendButton' class='C_selectPersonalEquipmentRequired' disabled>发送</button>";
        }
        html += "</td></tr>"
        html += "<tr id='tr6_2' style='display:none'><td id='commandPanel_3' style='background-color:#F8F0E0;text-align:right'>";
        html += "<select id='_transferGemCategory'>";
        html += "<option value='ALL'>所有宝石</option>";
        html += "<option value='POWER' style='color:blue'>威力宝石</option>";
        html += "<option value='LUCK' style='color:red'>幸运宝石</option>";
        html += "<option value='WEIGHT' style='color:green'>重量宝石</option>";
        html += "</select>";
        html += "<span> <span style='background-color:green;color:white;font-weight:bold'>AND</span> </span>";
        html += "<select id='_transferGemCount'>";
        html += "<option value='0'>传输数量（自动）</option>";
        for (let i = 1; i <= 20; i++) {
            html += "<option value='" + i + "'>" + i + "</option>";
        }
        html += "</select>";
        html += "<span> <span style='background-color:red;color:white;font-weight:bold'>GO</span> </span>";
        html += "<button role='button' id='transferGemButton' disabled>发送宝石</button>";
        html += "<span> <span style='background-color:blue;color:white;font-weight:bold'>OR</span> </span>";
        html += "<button role='button' id='autoTransferGemButton' " +
            "style='color:grey' disabled class='C_daemonButton'>开始自动传输宝石</button>";
        html += "</td></tr>";
        html += "<tr id='tr6_3' style='display:none'>" +
            "<td id='commandPanel_4' style='background-color:#F8F0E0;text-align:left'>";
        html += PocketPageRenderer.createGemCategorySelection("_bagGemCategory");
        html += PocketPageRenderer.AND();
        html += "<select id='_bagGemCount'>";
        html += "<option value='0'>宝石数量（自动）</option>";
        for (let i = 1; i <= 20; i++) {
            html += "<option value='" + i + "'>" + i + "</option>";
        }
        html += "</select>";
        html += "<span> <span style='background-color:red;color:white;font-weight:bold'>GO</span> </span>";
        html += "<button role='button' id='putGemIntoBagButton' style='display:none' disabled>宝石放入袋子</button>";
        html += "<span style='display:none'> <span style='background-color:blue;color:white;font-weight:bold'>OR</span> </span>";
        html += "<button role='button' id='takeGemOutBagButton' style='display:none' disabled>袋子取出宝石</button>";
        html += "<span style='display:none'> <span style='background-color:blue;color:white;font-weight:bold'>OR</span> </span>";
        html += "<button role='button' id='autoPutGemIntoBagButton' style='display:none;color:grey' class='C_daemonButton' disabled>开始宝石自动入袋</button>";
        html += "</td></tr>";
        html += "<tr id='tr6_4' style='display:none'>" +
            "<td id='commandPanel_5' style='background-color:#F8F0E0;text-align:left'>";
        html += PocketPageRenderer.createGemCategorySelection("_warehouseGemCategory");
        html += "<span> <span style='background-color:green;color:white;font-weight:bold'>AND</span> </span>"
        html += "<select id='_warehouseGemCount'>";
        html += "<option value='0'>宝石数量（自动）</option>";
        for (let i = 1; i <= 20; i++) {
            html += "<option value='" + i + "'>" + i + "</option>";
        }
        html += "</select>";
        html += "<span> <span style='background-color:red;color:white;font-weight:bold'>GO</span> </span>";
        html += "<button role='button' id='putGemIntoWarehouseButton' style='display:none' disabled>宝石放入仓库</button>";
        html += "<span style='display:none'> <span style='background-color:blue;color:white;font-weight:bold'>OR</span> </span>";
        html += "<button role='button' id='takeGemOutWarehouseButton' style='display:none' disabled>仓库取出宝石</button>";
        html += "<span style='display:none'> <span style='background-color:blue;color:white;font-weight:bold'>OR</span> </span>";
        html += "<button role='button' id='autoPutGemIntoWarehouseButton' style='display:none;color:grey' class='C_daemonButton' disabled>开始宝石自动入库</button>";
        html += "</td></tr>";
        html += "<tr id='tr6_5'><td id='commandPanel_6' style='background-color:#F8F0E0'>";
        html += "<table style='background-color:transparent;margin:auto;border-width:0;width:100%'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;text-align:left;white-space:nowrap'>";
        html += "<button role='button' id='restoreButton' disabled style='display:none'>恢复最后使用的装备</button>";
        html += "</td>";
        html += "<td style='background-color:#F8F0E0;text-align:right;width:100%'>";
        html += "<button role='button' id='luckCharmButton' style='color:blue'>千与千寻</button>";
        html += "<button role='button' id='rememberMeButton' style='color:red'>勿忘我</button>";
        html += "<button role='button' id='magicBallButton' style='color:green'>魔法使的闪光弹</button>";
        html += "<button role='button' id='chocolateButton' style='color:brown'>巧克力套装</button>";
        html += "<button role='button' disabled class='C_useEquipmentSet' id='useEquipmentSet_A'>套装Ａ</button>";
        html += "<button role='button' disabled class='C_useEquipmentSet' id='useEquipmentSet_B'>套装Ｂ</button>";
        html += "<button role='button' disabled class='C_useEquipmentSet' id='useEquipmentSet_C'>套装Ｃ</button>";
        html += "<button role='button' disabled class='C_useEquipmentSet' id='useEquipmentSet_D'>套装Ｄ</button>";
        html += "<button role='button' disabled class='C_useEquipmentSet' id='useEquipmentSet_E'>套装Ｅ</button>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</td></tr>";
        html += "<tr id='tr7' style='display:none'>";
        html += "<td id='bagList'></td>";
        html += "</tr>";
        html += "<tr id='tr8' style='display:none'>";
        html += "<td id='warehouseList'></td>";
        html += "</tr>";
        $("#tr2").after($(html));

        await this.#renderEquipmentSetButton();

        if (this.hasTreasureBag) {
            $("#putIntoBagButton").show()
            $("#bagCommandPanel").show()
        }
        if ((await this.doCheckCastleExistence())) {
            $("#warehouseCommandPanel").show()
        }

        await this.doResetMessageBoard();

        await this.doCreatePersonalEquipmentList()
        await this.doCreateBagEquipmentList()
        await this.doCreateWarehouseEquipmentList()

        await this.doBindEquipmentExperienceSettingButton()
        await this.#bindEquipmentSetButton();
        await this.doBindReturnButton()
        await this.doBindRefreshButton()
        await this.doBindItemShopButton();
        await this.doBindGemFuseButton();
        await this.doBindUpdateButton();
        await this.doBindUseButton()
        await this.doBindPutIntoBagButton()
        await this.doBindPutIntoWarehouseButton();
        await this.doBindOpenBagButton()
        await this.doBindCloseBagButton()
        await this.doBindBlinkBagButton()
        await this.doBindOpenWarehouseButton()
        await this.doBindCloseWarehouseButton()
        await this.doBindSearchTargetButton()
        await this.doBindSendButton()
        await this.#bindUseEquipmentSetButton();
        await this.#bindRestoreButton();
        await this.#bindLuckCharmButton();
        await this.#bindRememberMeButton();
        await this.#bindMagicBallButton();
        await this.#bindChocolateButton();

        await this.doBindTransferGemButton();
        await this.doBindTreasureBagGemButtons();
        await this.doBindWarehouseGemButtons();
    }

    async doResetMessageBoard() {
        let msg = "<b style='font-size:120%;color:wheat'>又来管理您的装备来啦？就这点破烂折腾来折腾去的，您累不累啊。</b>";
        if (SetupLoader.isGemCountVisible(this.credential.id)) {
            const roleIdList: string[] = [];
            const includeExternal = LocalSettingManager.isIncludeExternal();
            for (const roleId of TeamMemberLoader.loadTeamMembersAsMap(includeExternal).keys()) {
                roleIdList.push(roleId);
            }
            const storage = RoleEquipmentStatusStorage.getInstance();
            const data = await storage.loads(roleIdList);
            let powerGemCount = 0;
            let luckGemCount: number = 0;
            let weightGemCount = 0;
            data.forEach(it => {
                (it.powerGemCount !== undefined) && (powerGemCount += it.powerGemCount);
                (it.luckGemCount !== undefined) && (luckGemCount += it.luckGemCount);
                (it.weightGemCount !== undefined) && (weightGemCount += it.weightGemCount);
            });

            const pp = "<img src='" + Constants.POCKET_DOMAIN + "/image/item/PowerStone.gif' alt='威力宝石' title='威力宝石'>";
            const lp = "<img src='" + Constants.POCKET_DOMAIN + "/image/item/LuckStone.gif' alt='幸运宝石' title='幸运宝石'>";
            const wp = "<img src='" + Constants.POCKET_DOMAIN + "/image/item/WeightStone.gif' alt='重量宝石' title='重量宝石'>";
            msg += "<br>团队当前的宝石库存情况：" + pp + powerGemCount + " " + lp + luckGemCount + " " + wp + weightGemCount + "</b>";
        }
        MessageBoard.resetMessageBoard(msg);
    }

    async doCreatePersonalEquipmentList() {
    }

    async doCreateBagEquipmentList() {
        if (!this.hasTreasureBag) return;

        let html = "";
        html += "<table style='border-width:0;background-color:#888888;text-align:center;width:100%;margin:auto'>";
        html += "<tbody id='bagEquipmentListTable'>";
        html += "<tr>";
        html += "<td style='background-color:skyblue;font-weight:bold;font-size:120%;text-align:center' colspan='12'>＜ 百 宝 袋 ＞</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:#E0D0B0'>序号</th>"
        html += "<th style='background-color:#E8E8D0'>选择</th>"
        html += "<th style='background-color:#E0D0B0'>名字</th>"
        html += "<th style='background-color:#EFE0C0'>种类</th>"
        html += "<th style='background-color:#E0D0B0'>效果</th>"
        html += "<th style='background-color:#EFE0C0'>重量</th>"
        html += "<th style='background-color:#EFE0C0'>耐久</th>"
        html += "<th style='background-color:#EFE0C0'>威＋</th>"
        html += "<th style='background-color:#EFE0C0'>重＋</th>"
        html += "<th style='background-color:#EFE0C0'>幸＋</th>"
        html += "<th style='background-color:#E0D0B0'>经验</th>"
        html += "<th style='background-color:#E8E8D0'>取出</th>"
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("#bagList").html(html);
    }

    async doCreateWarehouseEquipmentList() {
        if (!(await this.doCheckCastleExistence())) return;

        let html = "";
        html += "<table style='border-width:0;background-color:#888888;margin:auto;width:100%'>";
        html += "<tbody style='background-color:#F8F0E0;text-align:center' id='warehouseEquipmentListTable'>";
        html += "<tr>";
        html += "<td style='background-color:skyblue;font-weight:bold;font-size:120%' colspan='17'>";
        html += "＜ 城 堡 仓 库 ＞";
        html += "</td>";
        html += "<tr>";
        html += "<th style='background-color:#E0D0B0'>序号</th>";
        html += "<th style='background-color:#E8E8D0'>名字</th>";
        html += "<th style='background-color:#EFE0C0'>种类</th>";
        html += "<th style='background-color:#E0D0B0'>效果</th>";
        html += "<th style='background-color:#EFE0C0'>重量</th>";
        html += "<th style='background-color:#E0D0B0'>耐久</th>";
        html += "<th style='background-color:#EFE0C0'>职业</th>";
        html += "<th style='background-color:#E0D0B0'>攻击</th>";
        html += "<th style='background-color:#E0D0B0'>防御</th>";
        html += "<th style='background-color:#E0D0B0'>智力</th>";
        html += "<th style='background-color:#E0D0B0'>精神</th>";
        html += "<th style='background-color:#E0D0B0'>速度</th>";
        html += "<th style='background-color:#EFE0C0'>威力</th>";
        html += "<th style='background-color:#EFE0C0'>重量</th>";
        html += "<th style='background-color:#EFE0C0'>幸运</th>";
        html += "<th style='background-color:#E0D0B0'>经验</th>";
        html += "<th style='background-color:#E0D0B0'>属性</th>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("#warehouseList").html(html);
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
    }

    async doBindGemFuseButton() {
    }

    async doBindUpdateButton() {
        $("#updateButton")
            .prop("disabled", false)
            .on("click", () => {
                PageUtils.disableElement("updateButton");
                MessageBoard.publishMessage("开始更新装备数据......");
                new EquipmentStatusTrigger(this.credential)
                    .withEquipmentPage(this.equipmentPage)
                    .triggerUpdate()
                    .then(() => {
                        MessageBoard.publishMessage("装备数据（百宝袋|城堡仓库）更新完成。");
                        PageUtils.enableElement("updateButton");
                    });
            })
            .parent().show();
    }

    async doBindOpenBagButton() {
        if (!this.hasTreasureBag) return;
        if (this.treasureBagIndex === -1) return;
        $("#openBagButton")
            .show()
            .on("click", () => {
                PageUtils.disableElement("openBagButton");
                this.treasureBagOpened = true;
                this.reloadBagPage().then(() => {
                    this.doRenderBagEquipmentList().then(() => PageUtils.enableElement("closeBagButton"));
                });
            });
        if (this.treasureBagOpened) PageUtils.disableElement("openBagButton");
    }

    async doBindCloseBagButton() {
        if (!this.hasTreasureBag) return;
        if (this.treasureBagIndex === -1) return;
        $("#closeBagButton")
            .show()
            .on("click", () => {
                PageUtils.disableElement("closeBagButton");
                this.treasureBagOpened = false;
                $(".C_bagEquipmentButton").off("click");
                $(".C_bagEquipment").remove();
                $("#tr7").hide();
                PageUtils.enableElement("openBagButton");
            });
        if (!this.treasureBagOpened) PageUtils.disableElement("closeBagButton");
    }

    async doBindBlinkBagButton() {
        if (!this.hasTreasureBag) return;
        if (this.treasureBagIndex !== -1) return;
        $("#blindBagButton")
            .show()
            .on("click", () => {
                if (this.equipmentPage.spaceCount === 0) {
                    MessageBoard.publishWarning("当前您身上没有多余的空间了，忽略。");
                    return;
                }
                PageUtils.disableElement("blindBagButton");
                new TreasureBag(this.credential).tryTakeOut(this.equipmentPage.spaceCount).then(() => {
                    this.reloadEquipmentPage().then(() => {
                        this.doRenderPersonalEquipmentList().then(() => {
                            PageUtils.enableElement("blindBagButton");
                        });
                    });
                });
            });
    }

    async doBindUseButton() {
        $("#useButton").on("click", () => {
            const selected = this._calculateSelectedPersonalEquipment()
            if (selected.length === 0) {
                MessageBoard.publishWarning("没有选择要使用的装备，忽略！")
                PageUtils.scrollIntoView("messageBoard")
                return
            }
            this._useEquipment(selected).then();
        })
    }

    async doBindPutIntoBagButton() {
        $("#putIntoBagButton").on("click", () => {
            const selected = this._calculateSelectedPersonalEquipment()
            if (selected.length === 0) {
                MessageBoard.publishWarning("没有选择要放入百宝袋的装备，忽略！")
                PageUtils.scrollIntoView("messageBoard")
                return
            }
            this._putIntoBag(selected).then();
        })
    }

    protected async doBindPutIntoWarehouseButton() {
    }

    async doBindOpenWarehouseButton() {
        if (!(await this.doCheckCastleExistence())) return;
        $("#openWarehouseButton")
            .show()
            .on("click", () => {
                PageUtils.disableElement("openWarehouseButton");
                this.warehouseOpened = true;
                this.reloadWarehousePage().then(() => {
                    this.doRenderWarehouseEquipmentList().then(() => PageUtils.enableElement("closeWarehouseButton"));
                });
            });
        if (this.warehouseOpened) PageUtils.disableElement("openWarehouseButton");
    }

    async doBindCloseWarehouseButton() {
        if (!(await this.doCheckCastleExistence())) return;
        $("#closeWarehouseButton")
            .show()
            .on("click", () => {
                PageUtils.disableElement("closeWarehouseButton");
                this.warehouseOpened = false;
                $(".C_warehouseEquipmentButton").off("click");
                $(".C_warehouseEquipment").remove();
                $("#tr8").hide();
                PageUtils.enableElement("openWarehouseButton");
            });
        if (!this.warehouseOpened) PageUtils.disableElement("closeWarehouseButton");
    }

    async doBindSearchTargetButton() {
        this.peopleFinder?.bindButtons();
    }

    async doBindSendButton() {
        $("#sendButton").on("click", () => {
            const indexList = _.forEach(this._calculateSelectedPersonalEquipment())
                .map(it => this.equipmentPage.findEquipment(it))
                .filter(it => it !== null)
                .filter(it => it!.canSend)
                .map(it => it!.index!)
            if (indexList.length === 0) {
                MessageBoard.publishWarning("没有可以发送的装备，忽略！")
                PageUtils.scrollIntoView("messageBoard")
                return
            }
            const target = this.peopleFinder?.targetPeople;
            if (target === undefined || target === "") {
                MessageBoard.publishWarning("没有选择发送的对象，忽略！")
                PageUtils.scrollIntoView("messageBoard")
                return
            }
            if (target === this.credential.id) {
                MessageBoard.publishWarning("不能发送给自己，忽略！")
                PageUtils.scrollIntoView("messageBoard")
                return
            }
            this._sendItem(target, indexList).then();
        })
    }

    async doPostReformatPage() {
    }

    async doRenderPersonalEquipmentList() {
    }

    async doRenderPersonalEquipment(equipment: Equipment) {
    }

    async doRenderBagEquipmentList() {
        if (!this.treasureBagOpened || !this.hasTreasureBag || this.treasureBagIndex === -1) return;

        $(".C_bagEquipmentButton").off("click");
        $(".C_bagEquipment").remove();

        const table = $("#bagEquipmentListTable");
        const equipmentList = this.bagPage!.sortedEquipmentList

        let sequence = 1;
        for (const equipment of equipmentList) {
            let html = "";
            html += "<tr class='C_bagEquipment' id='_bagEquipment_" + equipment.index + "'>";
            html += "<th style='background-color:#E0D0B0'>" + (sequence++) + "</th>";
            html += "<td style='background-color:#E8E8D0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#E8E8D0'></td>";
            html += "</tr>";
            table.append($(html));
        }
        let html = "";
        html += "<tr class='C_bagEquipment' style='background-color:lightblue'>"
        html += "<td style='text-align:left' id='bagEquipmentLog' colspan='12'></td>"
        html += "</tr>"
        html += "<tr class='C_bagEquipment' style='background-color:#F8F0E0'>";
        html += "<td style='text-align:right' colspan='12'>"
        html += "<table style='background-color:transparent;width:100%;margin:auto;border-width:0'>"
        html += "<tbody><tr>"
        html += "<td style='text-align:left'>"
        html += "<button role='button' class='C_bagEquipmentButton C_selectBagEquipmentRequired' " +
            "id='takeOutFromBagButton' disabled>从百宝袋中取出</button>"
        html += "</td>"
        html += "<td style='text-align:right'>"
        html += "<button role='button' class='C_bagEquipmentButton' id='innerCloseBagButton'>关闭百宝袋</button>"
        html += "</td>"
        html += "</tr></tbody>"
        html += "</table>"
        html += "</td>"
        html += "</tr>";
        table.append($(html));
        for (const equipment of equipmentList) {
            await this.doRenderBagEquipment(equipment)
        }
        $("#tr7").show()

        MessageBoard.resetMessageBoard(
            "<span style='font-size:120%'>当前百宝袋内剩余空间：" +
            "<span style='color:red;font-weight:bold'>" + this.bagPage!.spaceCount + "</span></span>",
            "bagEquipmentLog")

        $("#takeOutFromBagButton").on("click", () => {
            const indexList = this._calculateSelectedBagEquipment()
            if (indexList.length > this.equipmentPage.spaceCount) {
                MessageBoard.publishWarning("身上剩余空间不足！", "bagEquipmentLog")
                PageUtils.scrollIntoView("bagEquipmentLog")
                return
            }
            this._takeOutFromBag(indexList).then()
        })
        $("#innerCloseBagButton").on("click", () => PageUtils.triggerClick("closeBagButton"))

        if (this._calculateSelectedBagEquipment().length === 0) {
            $(".C_selectBagEquipmentRequired").prop("disabled", true);
        }
    }

    async doRenderBagEquipment(equipment: Equipment) {
        const equipmentIndex = equipment.index!;
        $(".C_bagEquipmentButton_" + equipmentIndex).off("click");

        const tr = $("#_bagEquipment_" + equipmentIndex);

        let html = "<button role='button' style='color:grey' " +
            "class='C_bagEquipmentButton C_bagEquipmentSelectButton C_bagEquipmentButton_" + equipmentIndex + "' " +
            "id='_bagEquipmentSelect_" + equipmentIndex + "'>选择</button>";
        tr.find("> td:first").html(html);
        tr.find("> td:eq(1)").html(equipment.nameHTML!);
        tr.find("> td:eq(2)").html(equipment.category!);
        tr.find("> td:eq(3)").html(_.toString(equipment.power));
        tr.find("> td:eq(4)").html(_.toString(equipment.weight));
        tr.find("> td:eq(5)").html(equipment.endureHtml);
        tr.find("> td:eq(6)").html(equipment.additionalPowerHtml);
        tr.find("> td:eq(7)").html(equipment.additionalWeightHtml);
        tr.find("> td:eq(8)").html(equipment.additionalLuckHtml);
        tr.find("> td:eq(9)").html(equipment.experienceHTML);
        html = "<button role='button' " +
            "class='C_bagEquipmentButton C_bagEquipmentButton_" + equipmentIndex + "' " +
            "id='_bagEquipmentFetch_" + equipmentIndex + "'>取出</button>";
        tr.find("> td:eq(10)").html(html)

        $("#_bagEquipmentSelect_" + equipmentIndex).on("click", () => {
            PageUtils.toggleBlueOrGrey("_bagEquipmentSelect_" + equipmentIndex)
            if (this._calculateSelectedBagEquipment().length > 0) {
                $(".C_selectBagEquipmentRequired").prop("disabled", false);
            } else {
                $(".C_selectBagEquipmentRequired").prop("disabled", true);
            }
        })
        $("#_bagEquipmentFetch_" + equipmentIndex).on("click", () => {
            this._cancelBagEquipmentSelection();
            if (this._clickBagEquipmentSelectButton(equipmentIndex)) {
                PageUtils.triggerClick("takeOutFromBagButton");
            }
        })
    }

    async doRenderWarehouseEquipmentList() {
        if (!this.warehouseOpened || !(await this.doCheckCastleExistence())) return;

        $(".C_warehouseEquipmentButton").off("click");
        $(".C_warehouseEquipment").remove();

        const table = $("#warehouseEquipmentListTable");
        const equipmentList = Equipment.sortEquipmentList(this.warehousePage!.storageEquipmentList!);

        let sequence = 1;
        for (const equipment of equipmentList) {
            let html = "";
            html += "<tr class='C_warehouseEquipment' id='_warehouseEquipment_" + equipment.index + "'>";
            html += "<th style='background-color:#E0D0B0'>" + (sequence++) + "</th>";
            html += "<td style='background-color:#E8E8D0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "</tr>";
            table.append($(html));
        }
        let html = "";
        html += "<tr class='C_warehouseEquipment' style='background-color:#F8F0E0'>";
        html += "<td style='text-align:right' colspan='17'>"
        html += "<button role='button' class='C_warehouseEquipmentButton' id='innerCloseWarehouseButton'>关闭仓库</button>"
        html += "</td>"
        html += "</tr>";
        table.append($(html));

        for (const equipment of equipmentList) {
            await this.doRenderWarehouseEquipment(equipment);
        }

        $("#tr8").show();

        $("#innerCloseWarehouseButton")
            .on("click", () => PageUtils.triggerClick("closeWarehouseButton"))
    }

    async doRenderWarehouseEquipment(equipment: Equipment) {
        const equipmentIndex = equipment.index!;
        const tr = $("#_warehouseEquipment_" + equipmentIndex);

        tr.find("> td:first").html(equipment.nameHTML!);
        tr.find("> td:eq(1)").html(equipment.category!);
        tr.find("> td:eq(2)").html(_.toString(equipment.power));
        tr.find("> td:eq(3)").html(_.toString(equipment.weight));
        tr.find("> td:eq(4)").html(equipment.endureHtml);
        tr.find("> td:eq(5)").html(equipment.requiredCareerHtml);
        tr.find("> td:eq(6)").html(equipment.requiredAttackHtml);
        tr.find("> td:eq(7)").html(equipment.requiredDefenseHtml);
        tr.find("> td:eq(8)").html(equipment.requiredSpecialAttackHtml);
        tr.find("> td:eq(9)").html(equipment.requiredSpecialDefenseHtml);
        tr.find("> td:eq(10)").html(equipment.requiredSpeedHtml);
        tr.find("> td:eq(11)").html(equipment.additionalPowerHtml);
        tr.find("> td:eq(12)").html(equipment.additionalWeightHtml);
        tr.find("> td:eq(13)").html(equipment.additionalLuckHtml);
        tr.find("> td:eq(14)").html(equipment.experienceHTML);
        tr.find("> td:eq(15)").html(equipment.attributeHtml);
    }

    async doBindSelectPersonalEquipment(index: number) {
        $("#_personalEquipmentSelect_" + index).on("click", () => {
            PageUtils.toggleBlueOrGrey("_personalEquipmentSelect_" + index)
            const selected = this._calculateSelectedPersonalEquipment()
            if (selected.length > 0) {
                $(".C_selectPersonalEquipmentRequired").prop("disabled", false);
            } else {
                $(".C_selectPersonalEquipmentRequired").prop("disabled", true);
            }
        });
    }

    async doBindUsePersonalEquipment(index: number) {
        $("#_personalEquipmentUse_" + index).on("click", () => {
            this._cancelPersonalEquipmentSelection()
            if (this._clickPersonalEquipmentSelectButton(index)) {
                PageUtils.triggerClick("useButton")
            }
        });
    }

    async doBindRepairPersonalEquipment(index: number) {
    }

    async doBindStorePersonalEquipment(index: number) {
        $("#_personalEquipmentStore_" + index).on("click", () => {
            this._cancelPersonalEquipmentSelection()
            if (this._clickPersonalEquipmentSelectButton(index)) {
                PageUtils.triggerClick("putIntoBagButton")
            }
        });
    }

    async doBindSendPersonalEquipment(index: number) {
        $("#_personalEquipmentSend_" + index).on("click", () => {
            this._cancelPersonalEquipmentSelection()
            if (this._clickPersonalEquipmentSelectButton(index)) {
                PageUtils.triggerClick("sendButton")
            }
        })
    }

    async doBeforeExit() {
        await new EquipmentSpaceTrigger(this.credential).withEquipmentPage(this.equipmentPage).triggerUpdate();
        await new EquipmentGrowthTrigger(this.credential).withEquipmentPage(this.equipmentPage).triggerUpdate();
        await new EquipmentUsingTrigger(this.credential).withEquipmentPage(this.equipmentPage).triggerUpdate();
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

    _calculateSelectedPersonalEquipment(): number[] {
        const indexList: number[] = []
        $(".C_personalEquipmentSelectButton")
            .each((_idx, btn) => {
                const btnId = $(btn).attr("id") as string
                if (PageUtils.isColorBlue(btnId)) {
                    const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"))
                    indexList.push(index)
                }
            })
        return indexList
    }

    _calculateSelectedBagEquipment(): number[] {
        const indexList: number[] = []
        $(".C_bagEquipmentSelectButton")
            .each((_idx, btn) => {
                const btnId = $(btn).attr("id") as string
                if (PageUtils.isColorBlue(btnId)) {
                    const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"))
                    indexList.push(index)
                }
            })
        return indexList
    }

    _calculateSelectedWarehouseEquipment(): number[] {
        const indexList: number[] = []
        $(".C_warehouseEquipmentSelectButton")
            .each((_idx, btn) => {
                const btnId = $(btn).attr("id") as string
                if (PageUtils.isColorBlue(btnId)) {
                    const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"))
                    indexList.push(index)
                }
            })
        return indexList
    }

    async _useEquipment(indexList: number[]) {
        await new PersonalEquipmentManagement(this.credential, this.townId).use(indexList)
        await this.reloadEquipmentPage()
        await this.doRenderPersonalEquipmentList()
    }

    async _putIntoBag(indexList: number[]) {
        await new TreasureBag(this.credential).putInto(indexList)
        await this.reloadEquipmentPage()
        await this.doRenderPersonalEquipmentList()
        await this.reloadBagPage()
        await this.doRenderBagEquipmentList()
    }

    async _takeOutFromBag(indexList: number[]) {
        await new TreasureBag(this.credential).takeOut(indexList)
        await this.reloadEquipmentPage()
        await this.doRenderPersonalEquipmentList()
        await this.reloadBagPage()
        await this.doRenderBagEquipmentList()
    }

    async _sendItem(target: string, indexList: number[]) {
    }

    _cancelPersonalEquipmentSelection() {
        $(".C_personalEquipmentSelectButton")
            .each((_idx, btn) => {
                const btnId = $(btn).attr("id") as string
                if (PageUtils.isColorBlue(btnId)) PageUtils.triggerClick(btnId)
            })
    }

    _cancelBagEquipmentSelection() {
        $(".C_bagEquipmentSelectButton")
            .each((_idx, btn) => {
                const btnId = $(btn).attr("id") as string
                if (PageUtils.isColorBlue(btnId)) PageUtils.triggerClick(btnId)
            })
    }

    _cancelWarehouseEquipmentSelection() {
        $(".C_warehouseEquipmentSelectButton")
            .each((_idx, btn) => {
                const btnId = $(btn).attr("id") as string
                if (PageUtils.isColorBlue(btnId)) PageUtils.triggerClick(btnId)
            })
    }

    _clickPersonalEquipmentSelectButton(index: number): boolean {
        const btnId = "_personalEquipmentSelect_" + index
        PageUtils.triggerClick(btnId)
        return PageUtils.isColorBlue(btnId)
    }

    _clickBagEquipmentSelectButton(index: number): boolean {
        const btnId = "_bagEquipmentSelect_" + index
        PageUtils.triggerClick(btnId)
        return PageUtils.isColorBlue(btnId)
    }

    _clickWarehouseEquipmentSelectButton(index: number): boolean {
        const btnId = "_warehouseEquipmentSelect_" + index
        PageUtils.triggerClick(btnId)
        return PageUtils.isColorBlue(btnId)
    }

    // ========================================================================
    // 装备套装相关的设置，点击左上角的头像激活。
    // ========================================================================

    async #bindEquipmentSetButton() {
        new MouseClickEventBuilder(this.credential)
            .bind($("#roleImage"), () => {
                if (this.equipmentSetPanelOpened) {
                    $(".C_equipmentSetButton").off("click");
                    $("#equipmentSetPanel").html("");
                    $("#tr3").hide();
                    this.equipmentSetPanelOpened = false;
                } else {
                    this.#renderEquipmentSetPanel().then(() => {
                        this.equipmentSetPanelOpened = true;
                    });
                }
            });
    }

    async #renderEquipmentSetPanel() {
        await this.reloadEquipmentPage();
        await this.doRenderPersonalEquipmentList();
        await this.#_openTreasureBagIfNecessary();

        const weaponCandidate = EquipmentSetConfig.generateCandidates(
            "WEA", this.equipmentPage.equipmentList!, this.bagPage?.equipmentList
        );
        const armorCandidate: string[] = EquipmentSetConfig.generateCandidates(
            "ARM", this.equipmentPage.equipmentList!, this.bagPage?.equipmentList
        );
        const accessoryCandidate: string[] = EquipmentSetConfig.generateCandidates(
            "ACC", this.equipmentPage.equipmentList!, this.bagPage?.equipmentList
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
            this.#renderEquipmentSetButton().then(() => {
                MessageBoard.publishMessage("套装设置已经保存。");
            });
        });
    }

    async #renderEquipmentSetButton() {
        const codes = ["A", "B", "C", "D", "E"];
        for (const code of codes) {
            const btnId = "useEquipmentSet_" + code;
            const btn = $("#" + btnId);
            const config = SetupLoader.loadEquipmentSetConfig(this.credential.id, code);
            if (config.alias !== undefined && config.alias !== "") {
                btn.text(config.alias);
            }
            btn.prop("disabled", !config.available);
        }
    }

    async #bindUseEquipmentSetButton() {
        $(".C_useEquipmentSet").on("click", event => {
            if ($(event.target).prop("disabled")) return;
            const btnId = $(event.target).attr("id") as string;
            const code = StringUtils.substringAfterLast(btnId, "_");
            const config = SetupLoader.loadEquipmentSetConfig(this.credential.id, code);
            if (!config.available) return;

            const set = new EquipmentSet();
            set.initialize();
            set.weaponName = config.weaponName;
            set.armorName = config.armorName;
            set.accessoryName = config.accessoryName;
            this.#_loadEquipmentSet(set).then();
        });
    }

    async #bindRestoreButton() {
        const data = await RoleUsingEquipmentStorage.load(this.credential.id);
        if (data === null || !data.available) return;
        $("#restoreButton")
            .prop("disabled", false)
            .show()
            .on("click", () => {
                const set = new EquipmentSet();
                set.initialize();
                set.weaponName = data.usingWeapon;
                set.armorName = data.usingArmor;
                set.accessoryName = data.usingAccessory;
                this.#_loadEquipmentSet(set).then();
            });
    }

    async #bindLuckCharmButton() {
        $("#luckCharmButton").on("click", () => {
            const set = new EquipmentSet();
            set.initialize();
            set.accessoryName = "千与千寻";
            this.#_loadEquipmentSet(set).then();
        });
    }

    async #bindRememberMeButton() {
        $("#rememberMeButton").on("click", () => {
            const set = new EquipmentSet();
            set.initialize();
            set.accessoryName = "勿忘我";
            this.#_loadEquipmentSet(set).then();
        });
    }

    async #bindMagicBallButton() {
        $("#magicBallButton").on("click", () => {
            const set = new EquipmentSet();
            set.initialize();
            set.accessoryName = "魔法使的闪光弹";
            this.#_loadEquipmentSet(set).then();
        });
    }

    async #bindChocolateButton() {
        $("#chocolateButton").on("click", () => {
            const set = new EquipmentSet();
            set.initialize();
            set.weaponName = "2015.02.14情人节巧克力";
            set.armorName = "2015.01.29十周年纪念";
            set.accessoryName = "2015.02.14情人节玫瑰";
            this.#_loadEquipmentSet(set).then();
        });
    }

    async #_loadEquipmentSet(set: EquipmentSet) {
        await new EquipmentSetLoader(this.credential, this.equipmentPage.equipmentList!).load(set);
        await this.reloadEquipmentPage();
        await this.doRenderPersonalEquipmentList();
        await this.reloadBagPage();
        await this.doRenderBagEquipmentList();
    }

    // ========================================================================
    // 宝石传输相关支持的功能。
    // ========================================================================

    async doBindTransferGemButton() {
        $("#transferGemButton").on("click", () => {
            this.#_transferGem();
        });
        $("#autoTransferGemButton").on("click", () => {
            if (PageUtils.isColorGrey("autoTransferGemButton")) {
                const target = this.peopleFinder?.targetPeople;
                if (target === undefined || target === "") {
                    MessageBoard.publishWarning("必须选择传输的目标！")
                    PageUtils.scrollIntoView("messageBoard")
                    return;
                }
                ButtonUtils.clickBlueButtons($(".C_daemonButton"), "autoTransferGemButton");
                if (this.#autoTransferGemTimer === undefined) {
                    this.#autoTransferGemTimer = setInterval(() => {
                        this.reloadEquipmentPage().then(() => {
                            this.doRenderPersonalEquipmentList().then(() => {
                                this.#_transferGem(true);
                            });
                        });
                    }, 2000);
                }
                PageUtils.changeColorBlue("autoTransferGemButton");
            } else if (PageUtils.isColorBlue("autoTransferGemButton")) {
                if (this.#autoTransferGemTimer !== undefined) {
                    clearInterval(this.#autoTransferGemTimer);
                    this.#autoTransferGemTimer = undefined;
                }
                PageUtils.changeColorGrey("autoTransferGemButton");
            }
        });
    }

    #_transferGem(silence?: boolean) {
        const target = this.peopleFinder?.targetPeople;
        if (target === undefined || target === "") {
            if (!silence) {
                MessageBoard.publishWarning("没有选择发送的对象，忽略！")
                PageUtils.scrollIntoView("messageBoard")
            }
            return
        }
        if (target === this.credential.id) {
            if (!silence) {
                MessageBoard.publishWarning("不能发送给自己，忽略！")
                PageUtils.scrollIntoView("messageBoard")
            }
            return
        }
        const category = $("#_transferGemCategory").val() as string;
        const count = _.parseInt($("#_transferGemCount").val() as string);
        const gems = _.forEach(this.equipmentPage.equipmentList!)
            .filter(it => it.isGem)
            .filter(it => {
                if (category === "POWER") {
                    return it.name === "威力宝石";
                } else if (category === "LUCK") {
                    return it.name === "幸运宝石";
                } else if (category === "WEIGHT") {
                    return it.name === "重量宝石";
                } else {
                    return true;
                }
            });
        const maxCount = (count === 0) ? gems.length : _.min([gems.length, count])!;
        const candidates: Equipment[] = [];
        for (let i = 0; i < maxCount; i++) {
            candidates.push(gems[i]);
        }
        if (candidates.length === 0) {
            if (!silence) {
                MessageBoard.publishWarning("没有发现能传输的宝石，忽略！");
                PageUtils.scrollIntoView("messageBoard");
            }
            return;
        }
        this._cancelPersonalEquipmentSelection();
        _.forEach(candidates)
            .map(it => it.index!)
            .forEach(it => this._clickPersonalEquipmentSelectButton(it));
        PageUtils.triggerClick("sendButton");
    }

    // ========================================================================
    // 宝石与百宝袋相关的功能。
    // ========================================================================

    async doBindTreasureBagGemButtons() {
        if (this.treasureBagIndex === -99) return;
        $("#tr6_3").show();
        $("#putGemIntoBagButton")
            .prop("disabled", false)
            .show()
            .on("click", () => {
                const category = $("#_bagGemCategory").val() as string;
                const count = _.parseInt($("#_bagGemCount").val() as string);
                const gems = this.equipmentPage.findGems(category);
                let candidates: Equipment[];
                if (count === 0) {
                    candidates = gems;
                } else {
                    const len = _.min([gems.length, count])!;
                    candidates = _.slice(gems, 0, len);
                }
                let selectionCount = 0;
                this._cancelPersonalEquipmentSelection();
                _.forEach(candidates)
                    .map(it => it.index!)
                    .forEach(it => {
                        if (this._clickPersonalEquipmentSelectButton(it)) {
                            selectionCount++;
                        }
                    });
                if (selectionCount > 0) {
                    PageUtils.triggerClick("putIntoBagButton");
                }
            });
        if (this.treasureBagIndex >= 0) {
            const takeGemOutBagButton = $("#takeGemOutBagButton");
            takeGemOutBagButton.prev().show();
            takeGemOutBagButton
                .prop("disabled", false)
                .show()
                .on("click", () => {
                    const category = $("#_bagGemCategory").val() as string;
                    const count = _.parseInt($("#_bagGemCount").val() as string);
                    this.#_openTreasureBagIfNecessary().then(() => {
                        const gems = this.bagPage!.findGems(category);
                        let candidates: Equipment[];
                        if (count === 0) {
                            const space = this.equipmentPage.spaceCount;
                            const len = _.min([gems.length, space])!;
                            candidates = _.slice(gems, 0, len);
                        } else {
                            const len = _.min([gems.length, count])!;
                            candidates = _.slice(gems, 0, len);
                        }
                        let selectionCount = 0;
                        this._cancelBagEquipmentSelection();
                        _.forEach(candidates)
                            .map(it => it.index!)
                            .forEach(it => {
                                if (this._clickBagEquipmentSelectButton(it)) {
                                    selectionCount++;
                                }
                            });
                        if (selectionCount > 0) {
                            PageUtils.triggerClick("takeOutFromBagButton");
                        }
                    });
                });
        }
        const autoPutGemIntoBagButton = $("#autoPutGemIntoBagButton");
        autoPutGemIntoBagButton.prev().show();
        autoPutGemIntoBagButton
            .prop("disabled", false)
            .show()
            .on("click", () => {
                if (PageUtils.isColorGrey("autoPutGemIntoBagButton")) {
                    ButtonUtils.clickBlueButtons($(".C_daemonButton"), "autoPutGemIntoBagButton");
                    PageUtils.changeColorBlue("autoPutGemIntoBagButton");
                    if (this.#autoPutGemIntoBagTimer === undefined) {
                        this.#autoPutGemIntoBagTimer = setInterval(() => {
                            this.reloadEquipmentPage().then(() => {
                                this.doRenderPersonalEquipmentList().then(() => {
                                    PageUtils.triggerClick("putGemIntoBagButton");
                                });
                            });
                        }, 2000);
                    }
                } else if (PageUtils.isColorBlue("autoPutGemIntoBagButton")) {
                    if (this.#autoPutGemIntoBagTimer !== undefined) {
                        clearInterval(this.#autoPutGemIntoBagTimer);
                        this.#autoPutGemIntoBagTimer = undefined;
                    }
                    PageUtils.changeColorGrey("autoPutGemIntoBagButton");
                }
            });
    }

    async #_openTreasureBagIfNecessary() {
        if (this.treasureBagIndex < 0) return;
        if (this.treasureBagOpened) return;
        this.treasureBagOpened = true;
        await this.reloadBagPage();
        await this.doRenderBagEquipmentList();
        PageUtils.disableElement("openBagButton");
        PageUtils.enableElement("closeBagButton");
    }

    // ========================================================================
    // 宝石与仓库相关的功能。
    // ========================================================================

    async doBindWarehouseGemButtons() {
    }

}

export = PersonalEquipmentManagementPageProcessor;