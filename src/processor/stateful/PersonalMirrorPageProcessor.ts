import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import LocationModeTown from "../../core/location/LocationModeTown";
import MirrorManager from "../../widget/MirrorManager";
import PersonalMirrorPageParser from "../../core/role/PersonalMirrorPageParser";
import PageUtils from "../../util/PageUtils";
import _ from "lodash";
import ButtonUtils from "../../util/ButtonUtils";
import MessageBoard from "../../util/MessageBoard";
import Role from "../../core/role/Role";
import PersonalStatus from "../../core/role/PersonalStatus";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import {EquipmentManager} from "../../widget/EquipmentManager";
import {BankManager} from "../../widget/BankManager";

class PersonalMirrorPageProcessor extends StatefulPageProcessor {

    private readonly mirrorManager: MirrorManager;
    private readonly equipmentManager: EquipmentManager;
    private readonly bankManager: BankManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        const locationMode = this.createLocationMode() as LocationModeTown;
        this.mirrorManager = new MirrorManager(credential, locationMode);
        this.mirrorManager.onRefresh = (message) => {
            this.role = message.extensions.get("role") as Role;
            this.equipmentManager.reload().then(() => {
                this.equipmentManager.render().then();
            });
        };
        this.equipmentManager = new EquipmentManager(credential, locationMode);
        this.equipmentManager.feature.enableStatusTriggerOnDispose = true;
        this.equipmentManager.feature.enableGrowthTriggerOnDispose = true;
        this.equipmentManager.feature.enableSpaceTriggerOnDispose = true;
        this.equipmentManager.feature.enableStatusTriggerOnDispose = true;
        this.equipmentManager.feature.enableUsingTriggerOnDispose = true;
        this.equipmentManager.feature.onMessage = s => MessageBoard.publishMessage(s);
        this.equipmentManager.feature.onWarning = s => MessageBoard.publishWarning(s);
        this.equipmentManager.feature.onRefresh = () => {
            this.equipmentManager.renderHitStatus(this.role);
        };
        this.bankManager = new BankManager(credential, locationMode);
        this.bankManager.feature.enableWriteRecordOnDispose = true;
        this.bankManager.feature.onMessage = s => MessageBoard.publishMessage(s);
        this.bankManager.feature.onWarning = s => MessageBoard.publishWarning(s);
        this.bankManager.feature.onRefresh = () => {
            this._reloadRole().then();
        };
    }

    private role?: Role;

    protected async doProcess(): Promise<void> {
        this.mirrorManager.mirrorPage = PersonalMirrorPageParser.parsePage(PageUtils.currentPageHtml());

        await this._reformatPage();
        await this._reloadRole();
        await this.mirrorManager.reload();
        await this.mirrorManager.render(this.role!);
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        this.equipmentManager.renderHitStatus(this.role);
        await this.bankManager.reload();
        await this.bankManager.render();
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .bind();
    }

    private async _reformatPage() {
        $("table[height='100%']").removeAttr("height");
        $("td:first")
            .attr("id", "pageTitle")
            .removeAttr("width")
            .removeAttr("height")
            .removeAttr("bgcolor")
            .css("background-color", "navy")
            .html(() => {
                return "" +
                    "<table style='background-color:transparent;margin:auto;width:100%;border-spacing:0;border-width:0'>" +
                    "<tbody>" +
                    "<tr>" +
                    "<td style='text-align:left;width:100%;font-size:150%;font-weight:bold;color:yellowgreen'>" +
                    "＜＜  分 身 试 管  ＞＞" +
                    "</td>" +
                    "<td style='text-align:right;white-space:nowrap'>" +
                    "<span> <button role='button' class='C_commandButton' id='refreshButton'>" + ButtonUtils.createTitle("刷新", "r") + "</button></span>" +
                    "<span> <button role='button' class='C_commandButton' id='returnButton'>" + ButtonUtils.createTitle("退出", "Esc") + "</button></span>" +
                    "</td>" +
                    "</tr>" +
                    "<tr style='display:none'>" +
                    "<td colspan='2'>" +
                    "<div id='extension_1'></div>" +
                    "<div id='extension_2'></div>" +
                    "<div id='extension_3'></div>" +
                    "<div id='extension_4'></div>" +
                    "<div id='extension_5'></div>" +
                    "</td>" +
                    "</tr>" +
                    "</tbody>" +
                    "</table>" +
                    "";
            });

        const table = $("table:first");

        table.find("> tbody:first")
            .find("> tr:eq(2)")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .attr("id", "messageBoard")
            .css("color", "wheat");

        const mirrorPanel = table.find("> tbody:first")
            .find("> tr:eq(3)")
            .find("> td:first")
            .attr("id", "mirrorPanel")
            .css("background-color", "#888888");

        if (_.includes(mirrorPanel.html(), "消耗5kw Gold(请带在身上，获取时直接从身上扣除)")) {
            // New mirror available
            const noticeHTML = mirrorPanel.find("> center:first")
                .find("> font:first")
                .html();
            mirrorPanel.parent()
                .after($("" +
                    "<tr>" +
                    "<td style='background-color:#F8F0E0;color:red;text-align:center'>" +
                    noticeHTML +
                    "</td>" +
                    "</tr>" +
                    "<tr style='background-color:#F8F0E0;text-align:center'>" +
                    "<td>" +
                    "<form action='mydata.cgi' method='post'>" +
                    "<input type='hidden' name='id' value='" + this.credential.id + "'>" +
                    "<input type='hidden' name='pass' value='" + this.credential.pass + "'>" +
                    "<input type='hidden' name='mode' value='FENSHENGETNEW'>" +
                    "<input type='submit' value='获取新分身'>" +
                    "</form>" +
                    "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color:#F8F0E0;text-align:center' id='equipmentPanel'></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color:#F8F0E0;text-align:center' id='bankPanel'></td>" +
                    "</tr>" +
                    ""));
        }
        mirrorPanel.html(this.mirrorManager.generateHTML());
        $("#equipmentPanel").html(this.equipmentManager.generateHTML());
        $("#bankPanel").html(this.bankManager.generateHTML());

        $("#extension_1").html(PageUtils.generateReturnTownForm(this.credential));
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this._beforeReturn().then(() => {
                PageUtils.triggerClick("returnTown");
            });
        });
        $("#refreshButton").on("click", () => {
            $(".C_commandButton").prop("disabled", true);
            this._refresh().then(() => {
                $(".C_commandButton").prop("disabled", false);
            });
        });

        this.mirrorManager.bindButtons();
        this.equipmentManager.bindButtons();
        this.bankManager.bindButtons();
    }

    private async _resetMessageBoard() {
        const welcomeMessage = this.mirrorManager.mirrorPage!.welcomeMessage!;
        MessageBoard.resetMessageBoard(welcomeMessage);
    }

    private async _refresh() {
        PageUtils.scrollIntoView("pageTitle");
        await this._resetMessageBoard();
        await this._reloadRole();
        await this.mirrorManager.reload();
        await this.mirrorManager.render(this.role!);
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        await this.bankManager.reload();
        await this.bankManager.render();
        MessageBoard.publishMessage("刷新完成。");
    }

    private async _beforeReturn() {
        await this.equipmentManager.dispose();
        await this.bankManager.dispose();
    }

    private async _reloadRole() {
        this.role = await new PersonalStatus(this.credential).load();
    }
}

export = PersonalMirrorPageProcessor;