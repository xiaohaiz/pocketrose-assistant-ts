import PersonalEquipmentManagementPageProcessor from "./PersonalEquipmentManagementPageProcessor";
import PageUtils from "../../util/PageUtils";
import {Equipment} from "../../core/equipment/Equipment";
import _ from "lodash";
import MessageBoard from "../../util/MessageBoard";
import TownBank from "../../core/bank/TownBank";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import CommentBoard from "../../util/CommentBoard";
import NpcLoader from "../../core/role/NpcLoader";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import TownDashboard from "../../core/dashboard/TownDashboard";
import EquipmentConsecrateManager from "../../core/equipment/EquipmentConsecrateManager";
import BattleFieldTrigger from "../../core/trigger/BattleFieldTrigger";
import Role from "../../core/role/Role";
import PersonalStatus from "../../core/role/PersonalStatus";

class PersonalEquipmentManagementPageProcessorTownImpl extends PersonalEquipmentManagementPageProcessor {

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
    }

    protected triggerLoadRole(handler: (role: (Role | undefined)) => void): void {
        new PersonalStatus(this.credential).load().then(role => {
            handler(role);
        });
    }

    async doPostReformatPage(): Promise<void> {
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


    async doBindReturnButton(): Promise<void> {
        $("#extension_1").html(PageUtils.generateReturnTownForm(this.credential));
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.doBeforeExit().then(() => {
                PageUtils.triggerClick("returnTown");
            });
        });
    }

    async doBindItemShopButton(): Promise<void> {
        if (this.townId === undefined) {
            return;
        }
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


    async doBindGemFuseButton(): Promise<void> {
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

    async doBeforeExit(): Promise<void> {
        await super.doBeforeExit();
        await new BattleFieldTrigger(this.credential)
            .withRole(this.role)
            .triggerUpdate();
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
        this.role = await new PersonalStatus(this.credential).load();
    }
}

export = PersonalEquipmentManagementPageProcessorTownImpl;