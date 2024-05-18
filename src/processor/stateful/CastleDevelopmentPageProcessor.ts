import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import LocationModeCastle from "../../core/location/LocationModeCastle";
import {RoleManager} from "../../widget/RoleManager";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import ButtonUtils from "../../util/ButtonUtils";
import PageUtils from "../../util/PageUtils";
import {PocketLogger} from "../../pocket/PocketLogger";
import MessageBoard from "../../util/MessageBoard";
import {PocketEvent} from "../../pocket/PocketEvent";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import {CastleDevelopmentPage, CastleDevelopmentPageParser} from "../../core/castle/CastleDevelopmentPage";
import {CastleDevelopment} from "../../core/castle/CastleDevelopment";
import _ from "lodash";
import CastleBank from "../../core/bank/CastleBank";
import TimeoutUtils from "../../util/TimeoutUtils";

const logger = PocketLogger.getLogger("DEVELOPMENT");

class CastleDevelopmentPageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeCastle;
    private readonly roleManager: RoleManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeCastle;
        this.roleManager = new RoleManager(credential, this.location);
    }

    private developmentPage?: CastleDevelopmentPage;

    protected async doProcess(): Promise<void> {
        this.developmentPage = CastleDevelopmentPageParser.parse(PageUtils.currentPageHtml());
        await this.generateHTML();
        await this.resetMessageBoard();
        this.roleManager.bindButtons();
        await this.bindButtons();
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.render();
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .doBind();
    }

    private async generateHTML() {
        const table = $("body:first > table:first");
        table.removeAttr("height");

        table.find("> tbody:first")
            .find("> tr:first > td:first")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜ 城 堡 开 发 ＞＞", this.roleLocation);
            });
        $("#_pocket_page_command").html(() => {
            const refreshButtonTitle = ButtonUtils.createTitle("刷新", "r");
            const returnButtonTitle = ButtonUtils.createTitle("退出", "Esc");
            return "<span> <button role='button' class='C_pocket_StatelessElement' id='refreshButton'>" + refreshButtonTitle + "</button></span>" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='returnButton'>" + returnButtonTitle + "</button></span>";
        });

        table.find("> tbody:first")
            .find("> tr:eq(1) > td:first")
            .find("> table:first > tbody:first")
            .find("> tr:first > td:first")
            .attr("id", "roleInformationManager")
            .closest("tr")
            .find("> td:last")
            .html(() => {
                return this.roleManager.generateHTML();
            });

        table.find("> tbody:first")
            .find("> tr:eq(2) > td:first")
            .find("> table:first > tbody:first")
            .find("> tr:first > td:first")
            .attr("id", "messageBoard")
            .css("color", "white")
            .closest("tr")
            .find("> td:last")
            .attr("id", "messageBoardManager");

        table.find("> tbody:first")
            .find("> tr:eq(3) > td:first")
            .attr("id", "CastleDevelopmentStatus")
            .html("");
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
            logger.info("城堡开发页面刷新完成。");
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
    }

    private async reload() {
        this.developmentPage = await new CastleDevelopment(this.credential).open();
    }

    private async render() {
        $(".C_CastleDevelopmentButton").off("click");
        $(".C_AutoDevelopmentButton").off("click");
        const status = $("#CastleDevelopmentStatus");

        let html = "<table style='background-color:#888888;margin:auto;border-width:0'>";
        html += "<tbody style='text-align:center;background-color:#F8F0E0'>";
        html += "<tr style='background-color:skyblue'>";
        html += "<th>内容</th>";
        html += "<th>当前值</th>";
        html += "<th>最大值</th>";
        html += "<th>开发</th>";
        html += "</tr>";

        html += "<tr>";
        html += "<th style='background-color:wheat'>城堡开发度</th>";
        html += "<td style='text-align:right'>" + this.developmentPage!.development!.toLocaleString() + "</td>";
        html += "<td style='text-align:right'>" + this.developmentPage!.maxDevelopment!.toLocaleString() + "</td>";
        html += "<td>";
        if (this.developmentPage!.development! >= this.developmentPage!.maxDevelopment!) {
            html += "<button role='button' disabled>开发</button>";
        } else {
            html += "<button role='button' class='C_CastleDevelopmentButton C_pocket_StatelessElement' " +
                "id='developmentButton'>开发</button>";
        }
        html += "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<th style='background-color:wheat'>城堡商业度</th>";
        html += "<td style='text-align:right'>" + this.developmentPage!.commerce!.toLocaleString() + "</td>";
        html += "<td style='text-align:right'>" + this.developmentPage!.maxCommerce!.toLocaleString() + "</td>";
        html += "<td>";
        if (this.developmentPage!.commerce! >= this.developmentPage!.maxCommerce!) {
            html += "<button role='button' disabled>开发</button>";
        } else {
            html += "<button role='button' class='C_CastleDevelopmentButton C_pocket_StatelessElement' " +
                "id='commerceButton'>开发</button>";
        }
        html += "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<th style='background-color:wheat'>城堡工业度</th>";
        html += "<td style='text-align:right'>" + this.developmentPage!.industry!.toLocaleString() + "</td>";
        html += "<td style='text-align:right'>" + this.developmentPage!.maxIndustry!.toLocaleString() + "</td>";
        html += "<td>";
        if (this.developmentPage!.industry! >= this.developmentPage!.maxIndustry!) {
            html += "<button role='button' disabled>开发</button>";
        } else {
            html += "<button role='button' class='C_CastleDevelopmentButton C_pocket_StatelessElement' " +
                "id='industryButton'>开发</button>";
        }
        html += "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<th style='background-color:wheat'>城堡矿产度</th>";
        html += "<td style='text-align:right'>" + this.developmentPage!.mineral!.toLocaleString() + "</td>";
        html += "<td style='text-align:right'>" + this.developmentPage!.maxMineral!.toLocaleString() + "</td>";
        html += "<td>";
        if (this.developmentPage!.mineral! >= this.developmentPage!.maxMineral!) {
            html += "<button role='button' disabled>开发</button>";
        } else {
            html += "<button role='button' class='C_CastleDevelopmentButton C_pocket_StatelessElement' " +
                "id='mineralButton'>开发</button>";
        }
        html += "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<th style='background-color:wheat'>城堡防御度</th>";
        html += "<td style='text-align:right'>" + this.developmentPage!.defense!.toLocaleString() + "</td>";
        html += "<td style='text-align:right'>" + this.developmentPage!.maxDefense!.toLocaleString() + "</td>";
        html += "<td>";
        if (this.developmentPage!.defense! >= this.developmentPage!.maxDefense!) {
            html += "<button role='button' disabled>开发</button>";
        } else {
            html += "<button role='button' class='C_CastleDevelopmentButton C_pocket_StatelessElement' " +
                "id='defenseButton'>开发</button>";
        }
        html += "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td style='text-align:left' colspan='4'>";
        html += "<button role='button' class='C_pocket_StatelessElement C_AutoDevelopmentButton' " +
            "id='autoDevelopmentButton'>自动全城堡开发</button>";
        html += "</td>";
        html += "</tr>";

        html += "</tbody>";
        html += "</table>";
        status.html(html);

        $("#developmentButton").on("click", async () => {
            await this.developCastle(
                this.developmentPage!.development!,
                this.developmentPage!.maxDevelopment!,
                "1"
            );
        });
        $("#commerceButton").on("click", async () => {
            await this.developCastle(
                this.developmentPage!.commerce!,
                this.developmentPage!.maxCommerce!,
                "2"
            );
        });
        $("#industryButton").on("click", async () => {
            await this.developCastle(
                this.developmentPage!.industry!,
                this.developmentPage!.maxIndustry!,
                "3"
            );
        });
        $("#mineralButton").on("click", async () => {
            await this.developCastle(
                this.developmentPage!.mineral!,
                this.developmentPage!.maxMineral!,
                "4"
            );
        });
        $("#defenseButton").on("click", async () => {
            await this.developCastle(
                this.developmentPage!.defense!,
                this.developmentPage!.maxDefense!,
                "5"
            );
        });
        $("#autoDevelopmentButton").on("click", async () => {
            await this.autoDevelopCastle();
        });
    }

    private async refresh() {
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.reload();
        await this.render();
    }

    private async dispose() {
        await this.roleManager.dispose();
    }

    private async developCastle(current: number, max: number, m0: string) {
        if (current >= max) return;
        const delta = max - current;
        const requiredGolds = delta * 10;   // 10Gold增加1点属性
        const amount = _.ceil(requiredGolds / 10000);
        await new CastleBank(this.credential).withdraw(amount);
        await new CastleDevelopment(this.credential).develop(m0, amount);
        await new CastleBank(this.credential).deposit();
        await this.refresh();
    }

    private async autoDevelopCastle() {
        // 找第一个可点击的按钮
        const buttons: JQuery[] = [];
        $(".C_CastleDevelopmentButton").each((_idx, e) => {
            const button = $(e);
            if (!button.prop("disabled")) {
                buttons.push(button);
            }
        });
        if (buttons.length === 0) {
            logger.info("城堡已经开发完成。");
            return;
        }
        const button = buttons[0]!;
        button.trigger("click");
        TimeoutUtils.execute(2000, async () => {
            await this.autoDevelopCastle();
        });
    }

}

export {CastleDevelopmentPageProcessor};