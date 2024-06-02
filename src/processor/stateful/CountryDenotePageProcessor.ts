import ButtonUtils from "../../util/ButtonUtils";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import LocationModeTown from "../../core/location/LocationModeTown";
import MessageBoard from "../../util/MessageBoard";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import NpcLoader from "../../core/role/NpcLoader";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import StatefulPageProcessor from "../StatefulPageProcessor";
import StringUtils from "../../util/StringUtils";
import TownBank from "../../core/bank/TownBank";
import TownDashboard from "../../core/dashboard/TownDashboard";
import _ from "lodash";
import {BankManager} from "../../widget/BankManager";
import {CountryDenotePage, CountryDenotePageParser} from "../../core/country/CountryDenotePage";
import {CountryDenote} from "../../core/country/CountryDenote";
import {PocketEvent} from "../../pocket/PocketEvent";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import {PocketLogger} from "../../pocket/PocketLogger";
import {RoleManager} from "../../widget/RoleManager";
import {TownDashboardPage} from "../../core/dashboard/TownDashboardPage";

const logger = PocketLogger.getLogger("COUNTRY");

class CountryDenotePageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown;
    private readonly roleManager: RoleManager;
    private readonly bankManager: BankManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeTown;
        this.roleManager = new RoleManager(credential, this.location);
        this.bankManager = new BankManager(credential, this.location);
        this.bankManager.feature.onRefresh = async () => {
            await this.roleManager.reload();
            await this.roleManager.render();
            await this.reload();
            await this.render();
        };
    }

    private denotePage?: CountryDenotePage;
    private dashboardPage?: TownDashboardPage;

    protected async doProcess(): Promise<void> {
        await this.initializeProcessor();
        await this.generateHTML();
        await this.resetMessageBoard();
        this.roleManager.bindButtons();
        this.bankManager.bindButtons();
        await this.bindButtons();
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.bankManager.reload();
        await this.bankManager.render();
        await this.render();
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .doBind();
    }

    private async initializeProcessor() {
        this.denotePage = CountryDenotePageParser.parse(PageUtils.currentPageHtml());
    }

    private async generateHTML() {
        const mainTable = $("body:first > table:first");
        mainTable.removeAttr("height");
        mainTable.find("> tbody:first")
            .find("> tr:first > td:first")
            .removeAttr("height")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜  资 金 捐 赠  ＞＞", this.roleLocation);
            });
        $("#_pocket_page_command").html(() => {
            const refreshButtonTitle = ButtonUtils.createTitle("刷新", "r");
            const returnButtonTitle = ButtonUtils.createTitle("退出", "Esc");
            return "<span> <button role='button' class='C_pocket_StableButton C_pocket_StatelessElement' id='refreshButton'>" + refreshButtonTitle + "</button></span>" +
                "<span> <button role='button' class='C_pocket_StableButton C_pocket_StatelessElement' id='returnButton'>" + returnButtonTitle + "</button></span>";
        });

        mainTable.find("> tbody:first")
            .find("> tr:eq(1) > td:first")
            .find("> table:first > tbody:first")
            .find("> tr:first > td:first")
            .attr("id", "roleInformationManager")
            .closest("tr")
            .find("> td:eq(1)")
            .html(() => {
                return this.roleManager.generateHTML();
            });

        mainTable.find("> tbody:first")
            .find("> tr:eq(2) > td:first")
            .removeAttr("height")
            .attr("id", "messageBoardContainer");
        MessageBoard.createMessageBoardStyleB("messageBoardContainer", NpcLoader.randomNpcImageHtml());
        $("#messageBoard").css("background-color", "black")
            .css("color", "white");

        mainTable.find("> tbody:first")
            .find("> tr:eq(3) > td:first")
            .attr("id", "countryDenotePanel")
            .css("text-align", "center")
            .find("> form:first")
            .remove();

        $("#countryDenotePanel").prepend($("" +
            "<table style='background-color:#888888;margin:auto;border-width:0' id='rapidDenote'>" +
            "<tbody style='background-color:#F8E0E0'>" +
            "<tr style='text-align:center'>" +
            "<th style='background-color:skyblue' colspan='10'>快 捷 捐 赠 通 道</th>" +
            "</tr>" +
            "<tr style='text-align:center'>" +
            "<td><button role='button' class='C_denoteButton' id='target_500'>五　百</button></td>" +
            "<td><button role='button' class='C_denoteButton' id='target_1000'>一　千</button></td>" +
            "<td><button role='button' class='C_denoteButton' id='target_1500'>一千五</button></td>" +
            "<td><button role='button' class='C_denoteButton' id='target_2000'>两　千</button></td>" +
            "<td><button role='button' class='C_denoteButton' id='target_2500'>两千五</button></td>" +
            "<td><button role='button' class='C_denoteButton' id='target_3000'>三　千</button></td>" +
            "<td><button role='button' class='C_denoteButton' id='target_3500'>三千五</button></td>" +
            "<td><button role='button' class='C_denoteButton' id='target_4000'>四　千</button></td>" +
            "<td><button role='button' class='C_denoteButton' id='target_4500'>四千五</button></td>" +
            "<td><button role='button' class='C_denoteButton' id='target_5000'>五　千</button></td>" +
            "</tr>" +
            "<tr style='text-align:center'>" +
            "<td><button role='button' class='C_denoteButton' id='target_5500'>五千五</button></td>" +
            "<td><button role='button' class='C_denoteButton' id='target_6000'>六　千</button></td>" +
            "<td><button role='button' class='C_denoteButton' id='target_6500'>六千五</button></td>" +
            "<td><button role='button' class='C_denoteButton' id='target_7000'>七　千</button></td>" +
            "<td><button role='button' class='C_denoteButton' id='target_7500'>七千五</button></td>" +
            "<td><button role='button' class='C_denoteButton' id='target_8000'>八　千</button></td>" +
            "<td><button role='button' class='C_denoteButton' id='target_8500'>八千五</button></td>" +
            "<td><button role='button' class='C_denoteButton' id='target_9000'>九　千</button></td>" +
            "<td><button role='button' class='C_denoteButton' id='target_9500'>九千五</button></td>" +
            "<td><button role='button' class='C_denoteButton' id='target_10000'>一　万</button></td>" +
            "</tr>" +
            "</tbody>" +
            "</table>"));

        mainTable.find("> tbody:first")
            .append($("<tr><td style='text-align:center'>" + this.bankManager.generateHTML() + "</td></tr>"));
    }

    private async resetMessageBoard() {
        MessageBoard.initializeManager();
        MessageBoard.initializeWelcomeMessage();
    }

    private async bindButtons() {
        $("#_pocket_page_extension_0").html(() => {
            return new PocketFormGenerator(this.credential, this.location).generateReturnFormHTML();
        });
        $("#returnButton").on("click", async () => {
            PageUtils.disablePageInteractiveElements();
            await this.dispose();
            PageUtils.triggerClick("_pocket_ReturnSubmit");
        });
        $("#refreshButton").on("click", async () => {
            PocketPage.scrollIntoTitle();
            PocketPage.disableStatelessElements();
            await this.resetMessageBoard();
            await this.refresh();
            logger.info("刷新操作执行完成。");
            PocketPage.enableStatelessElements();
        });
        const roleImageHandler = PocketEvent.newMouseClickHandler();
        MouseClickEventBuilder.newInstance()
            .onElementClicked("roleInformationManager", async () => {
                await roleImageHandler.onMouseClicked();
            })
            .onElementClicked("messageBoardManager", async () => {
                await this.resetMessageBoard();
            })
            .doBind();

        $(".C_denoteButton").on("click", async (event) => {
            const buttonId = $(event.target).attr("id") as string;
            const target = _.parseInt(StringUtils.substringAfterLast(buttonId, "_"));
            const delta = target - this.dashboardPage!.role!.contribution!;
            if (delta <= 0) return;
            if (delta < 10) {
                logger.warn("最小捐赠10万！你还是想办法靠收益凑整吧。");
                return;
            }
            await new TownBank(this.credential, this.townId).withdraw(delta);
            $("#rapidDenote").hide();
            const panel = $("#countryDenotePanel");
            panel.find("> center:first").html(() => {
                return "<span style='color:red;font-weight:bold;font-size:300%'>请耐心等待右上角读秒结束！</span>";
            });
            this.dashboardPage = (await new TownDashboard(this.credential).open())!;
            this.dashboardPage!.executeWhenActionTimeout(async () => {
                await new CountryDenote(this.credential, this.townId).denote(delta);
                await new TownBank(this.credential, this.townId).depositAll();
                await this.refresh();
            });
        });
    }

    private async reload() {
        this.denotePage = await new CountryDenote(this.credential, this.townId).open();
        this.dashboardPage = (await new TownDashboard(this.credential).open()) ?? undefined;
    }

    private async render() {
        $("#rapidDenote").hide();
        this.dashboardPage = (await new TownDashboard(this.credential).open())!;
        this.dashboardPage!.executeWhenActionTimeout(
            async () => {
                await this._renderDenote();
            },
            () => {
                const panel = $("#countryDenotePanel");
                panel.find("> center:first").html(() => {
                    return "<span style='color:red;font-weight:bold;font-size:300%'>请耐心等待右上角读秒结束！</span>";
                });
            }
        );
    }

    private async _renderDenote() {
        $("#rapidDenote").show();
        const panel = $("#countryDenotePanel");
        panel.find("> center:first").html(() => {
            return this.denotePage!.centerHTML!;
        });
        $(".C_denoteButton").each((_idx, e) => {
            const button = $(e);
            const buttonId = button.attr("id") as string;
            const target = _.parseInt(StringUtils.substringAfterLast(buttonId, "_"));
            if (target <= this.dashboardPage!.role!.contribution!) {
                button.prop("disabled", true);
            } else {
                button.prop("disabled", false);
            }
        });
    }

    private async refresh() {
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.bankManager.reload();
        await this.bankManager.render();
        await this.reload();
        await this.render();
    }

    private async dispose() {
        await this.roleManager.dispose();
        await this.bankManager.dispose();
    }
}

export {CountryDenotePageProcessor};