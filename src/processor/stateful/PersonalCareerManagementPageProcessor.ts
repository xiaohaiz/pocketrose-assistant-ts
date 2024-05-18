import ButtonUtils from "../../util/ButtonUtils";
import CareerLoader from "../../core/career/CareerLoader";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import LocationModeCastle from "../../core/location/LocationModeCastle";
import LocationModeTown from "../../core/location/LocationModeTown";
import MessageBoard from "../../util/MessageBoard";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import PersonalCareerManagement from "../../core/career/PersonalCareerManagement";
import PersonalCareerManagementPage from "../../core/career/PersonalCareerManagementPage";
import PersonalCareerManagementPageParser from "../../core/career/PersonalCareerManagementPageParser";
import Role from "../../core/role/Role";
import SetupLoader from "../../setup/SetupLoader";
import StatefulPageProcessor from "../StatefulPageProcessor";
import StringUtils from "../../util/StringUtils";
import _ from "lodash";
import {EquipmentManager} from "../../widget/EquipmentManager";
import {MirrorManager} from "../../widget/MirrorManager";
import {PocketEvent} from "../../pocket/PocketEvent";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import {PocketLogger} from "../../pocket/PocketLogger";
import {RoleManager} from "../../widget/RoleManager";
import {SpellManager} from "../../widget/SpellManager";
import CommentBoard from "../../util/CommentBoard";
import NpcLoader from "../../core/role/NpcLoader";

const logger = PocketLogger.getLogger("CAREER");

class PersonalCareerManagementPageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown | LocationModeCastle;
    private readonly roleManager: RoleManager;
    private readonly spellManager: SpellManager;
    private readonly equipmentManager: EquipmentManager;
    private mirrorManager?: MirrorManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeTown | LocationModeCastle;
        this.roleManager = new RoleManager(credential, this.location);
        this.spellManager = new SpellManager(this.credential, this.location);
        this.spellManager.feature.onRefresh = async (message) => {
            this.roleManager.role = message.extensions.get("role") as Role;
            await this.roleManager.render();
            await this.mirrorManager?.reload();
            await this.mirrorManager?.render(this.roleManager.role);
        };
        this.equipmentManager = new EquipmentManager(this.credential, this.location);
        this.equipmentManager.feature.onRefresh = () => {
            this.equipmentManager.renderRoleStatus(this.roleManager.role);
        };
        if (this.location instanceof LocationModeTown) {
            this.mirrorManager = new MirrorManager(credential, this.location);
            this.mirrorManager.feature.onRefresh = async (message) => {
                this.roleManager.role = message.extensions.get("role") as Role;
                await this.roleManager.render();
                await this.spellManager.reload();
                await this.spellManager.render(this.roleManager.role);
                await this.reload();
                await this.render();
                await this.equipmentManager.reload();
                await this.equipmentManager.render();
            };
        }
    }

    private careerPage?: PersonalCareerManagementPage;

    protected async doProcess(): Promise<void> {
        this.careerPage = PersonalCareerManagementPageParser.parse(PageUtils.currentPageHtml());
        await this.generateHTML();
        await this.resetMessageBoard();
        this.roleManager.bindButtons();
        this.spellManager.bindButtons();
        this.equipmentManager.bindButtons();
        this.mirrorManager?.bindButtons();
        await this.bindButtons();
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.spellManager.reload();
        await this.spellManager.render(this.roleManager.role!);
        await this.render();
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        this.equipmentManager.renderRoleStatus(this.roleManager.role);
        await this.mirrorManager?.reload();
        await this.mirrorManager?.render(this.roleManager.role!);
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .doBind();
    }

    private async generateHTML() {
        const table = $("body:first > table:first");
        table.find("> tbody:first")
            .find("> tr:first > td:first")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜　职 业 管 理 ＞＞", this.roleLocation);
            });
        $("#_pocket_page_command").html(() => {
            const refreshButtonTitle = ButtonUtils.createTitle("刷新", "r");
            const returnButtonTitle = ButtonUtils.createTitle("退出", "Esc");
            return "<span> <button role='button' class='C_pocket_StetelessElement C_pocket_StableButton' id='refreshButton'>" + refreshButtonTitle + "</button></span>" +
                "<span> <button role='button' class='C_pocket_StetelessElement C_pocket_StableButton' id='returnButton'>" + returnButtonTitle + "</button></span>";
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
            .attr("id", "CareerUI")
            .html(() => {
                let html = "";
                html += "<table style='background-color:transparent;margin:auto;width:100%;border-spacing:0;border-width:0'>";
                html += "<toby>";
                html += "<tr>";
                html += "<td style='background-color:#888888'>";
                html += this.spellManager.generateHTML();
                html += "</td>";
                html += "</tr>";
                html += "<tr style='display:none'>";
                html += "<td style='background-color:#888888' id='careerManagerPanel'>";
                html += this.generateCareerHTML();
                html += "</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<td style='background-color:#888888'>";
                html += this.equipmentManager.generateHTML();
                html += "</td>";
                html += "</tr>";
                html += "<tr style='display:none'>";
                html += "<td style='background-color:#888888' id='mirrorManagerPanel'>";
                html += this.mirrorManager?.generateHTML() ?? "";
                html += "</td>";
                html += "</tr>";
                html += "</toby>";
                html += "</table>";
                return html;
            });

        if (this.mirrorManager) {
            $("#mirrorManagerPanel").parent().show();
        }

        const imageHtml = NpcLoader.getNpcImageHtml("白皇");
        CommentBoard.createCommentBoard(imageHtml!);
        CommentBoard.writeMessage("是的，你没有看错，换人了，某幕后黑手不愿意出镜。不过请放心，转职方面我是专业的，毕竟我一直制霸钉耙榜。<br>");
        CommentBoard.writeMessage("蓝色的职业代表你已经掌握了。我会把为你推荐的职业红色加深标识出来，当然，前提是如果有能推荐的。<br>");

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
            logger.info("职业管理页面刷新完成。");
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
        this.careerPage = await new PersonalCareerManagement(this.credential, this.townId).open();
    }

    private async render() {
        $(".CareerUIButton")
            .off("click")
            .prop("disabled", false)
            .removeAttr("css");

        const panel = $("#careerManagerPanel");
        const roleLevel = this.roleManager.role!.level!;
        if (roleLevel <= 50) {
            panel.parent().hide();
            return;
        }
        panel.parent().show();

        // 已经掌握的职业用蓝色标记
        // 没有掌握的职业用红色标记（满级的情况下）
        // 不在转职列表中的按钮删除
        // 当前职业绿色显示
        if (this.roleManager.role!.masterCareerList!.includes("小天位")) {
            $("#career_32").css("color", "blue");
            $("#career_33").css("color", "blue");
            $("#career_34").css("color", "blue");
            $("#career_35").css("color", "blue");
        }
        const careerNames = Object.keys(CareerLoader.loadCareers());
        for (let i = 0; i < careerNames.length; i++) {
            const careerName = careerNames[i];
            // @ts-ignore
            const careerId = CareerLoader.loadCareers()[careerName]["id"];
            const buttonId = "career_" + careerId;
            if (this.roleManager.role!.masterCareerList!.includes(careerName)) {
                $("#" + buttonId).css("color", "blue");
            } else {
                if (this.roleManager.role!.level! >= 150) {
                    const btn = $("#" + buttonId);
                    if (careerName === this.roleManager.role!.career) {
                        btn.css("color", "green");
                        btn.css("font-weight", "bold");
                    } else {
                        btn.css("color", "red");
                        btn.css("font-weight", "bold");
                    }
                }
            }
            if (!this.careerPage!.careerList!.includes(careerName)) {
                const btn = $("#" + buttonId);
                btn.prop("disabled", true);
                btn.css("color", "grey");
                btn.css("font-weight", "normal");
            }
        }

        // 推荐计算
        const recommendations = this.calculateRecommendationCareers();
        if (recommendations.length > 0) {
            for (const recommendation of recommendations) {
                // @ts-ignore
                const careerId = CareerLoader.loadCareers()[recommendation]["id"];
                const buttonId = "career_" + careerId;
                const btn = $("#" + buttonId);
                if (recommendation === this.roleManager.role!.career) {
                    btn.css("color", "green");
                    btn.css("font-weight", "bold");
                } else {
                    btn.css("color", "red");
                    btn.css("font-weight", "bold");
                }
            }
        }

        if (!this.isCareerTransferEnabled) {
            // 转职入口被关闭了，那就禁止所有的转职按钮。
            for (let i = 0; i < careerNames.length; i++) {
                const careerName = careerNames[i];
                // @ts-ignore
                const careerId = CareerLoader.loadCareers()[careerName]["id"];
                const buttonId = "career_" + careerId;
                const btn = $("#" + buttonId);
                btn.prop("disabled", true);
                btn.css("color", "grey");
                btn.css("font-weight", "normal");
            }
        }

        $(".C_changeCareerButton").on("click", async (event) => {
            const btnId = $(event.target).attr("id") as string;
            const careerId = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            const career = CareerLoader.findCareerById(careerId)!;
            if (!confirm("请确认要转职到“" + career + "”？")) return;
            await this.changeCareer(careerId, career);
        });

    }

    private async refresh() {
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.spellManager.reload();
        await this.spellManager.render(this.roleManager.role!);
        await this.reload();
        await this.render();
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        await this.mirrorManager?.reload();
        await this.mirrorManager?.render(this.roleManager.role!);
    }

    private async dispose() {
        await this.roleManager.dispose();
        await this.spellManager.dispose();
        await this.equipmentManager.dispose();
        await this.mirrorManager?.dispose();
    }

    private generateCareerHTML(): string {
        let html = "";
        html += "<table style='background-color:#888888;width:100%;text-align:center;border-width:0'>";
        html += "<tbody style='background-color:#F8F0E0'>";
        html += "<tr>";
        html += "<th colspan='7' style='background-color:skyblue;text-align:center;font-weight:bold;font-size:120%'>＜＜ 选 择 新 的 职 业 ＞＞</th>";
        html += "</tr>";

        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>战士系</th>";
        html += "<td style='background-color:#EFE0C0;text-align:left'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_0' value='兵士'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_1' value='武士'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_2' value='剑客'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_3' value='剑侠'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_4' value='魔法剑士'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_5' value='暗黑剑士'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_6' value='奥法剑士'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_7' value='魔导剑士'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_8' value='神圣剑士'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_9' value='圣殿武士'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_10' value='剑圣'>" +
            "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>枪系</th>";
        html += "<td style='background-color:#EFE0C0;text-align:left'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_11' value='枪战士'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_12' value='重战士'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_13' value='狂战士'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_14' value='龙战士'>" +
            "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>格斗系</th>";
        html += "<td style='background-color:#EFE0C0;text-align:left'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_15' value='武僧'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_16' value='决斗家'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_17' value='拳王'>" +
            "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>魔术系</th>";
        html += "<td style='background-color:#EFE0C0;text-align:left'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_18' value='术士'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_19' value='魔法师'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_20' value='咒灵师'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_21' value='大魔导士'>" +
            "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>祭司系</th>";
        html += "<td style='background-color:#EFE0C0;text-align:left'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_22' value='牧师'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_23' value='德鲁伊'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_24' value='贤者'>" +
            "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>弓矢系</th>";
        html += "<td style='background-color:#EFE0C0;text-align:left'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_25' value='弓箭士'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_26' value='魔弓手'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_27' value='狙击手'>" +
            "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>游侠系</th>";
        html += "<td style='background-color:#EFE0C0;text-align:left'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_28' value='游侠'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_29' value='巡林客'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_30' value='吟游诗人'>" +
            "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>天位系</th>";
        html += "<td style='background-color:#EFE0C0;text-align:left'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_31' value='小天位'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_32' value='强天位'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_33' value='斋天位'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_34' value='太天位'>" +
            "<input type='button' class='CareerUIButton C_changeCareerButton' id='career_35' value='终极'>" +
            "</td>";
        html += "</tr>";

        html += "</toby>";
        html += "</table>";
        return html;
    }

    private get isCareerTransferEnabled(): boolean {
        const config: any = SetupLoader.loadMirrorCareerFixedConfig(this.credential.id);
        return !config["_m_" + this.roleManager.role!.mirrorIndex!];
    }

    private calculateRecommendationCareers() {
        // 没有满级，不推荐
        if (this.roleManager.role!.level! < 150) {
            return [];
        }
        // 没有掌握全部职业，不推荐
        if (this.roleManager.role!.masterCareerList!.length !== 32) {
            return [];
        }
        const recommendations: string[] = [];
        const targetCareerNames = Object.keys(CareerLoader.loadCareerTransferRequirements());
        for (let i = 0; i < targetCareerNames.length; i++) {
            const name = targetCareerNames[i];
            // @ts-ignore
            const requirement = CareerLoader.loadCareerTransferRequirements()[name];
            if (this.roleManager.role!.maxMana! >= requirement[0] &&
                this.roleManager.role!.attack! >= requirement[1] &&
                this.roleManager.role!.defense! >= requirement[2] &&
                this.roleManager.role!.specialAttack! >= requirement[3] &&
                this.roleManager.role!.specialDefense! >= requirement[4] &&
                this.roleManager.role!.speed! >= requirement[5]) {
                // 发现了可以推荐的职业
                recommendations.push(name);
            }
        }
        if (recommendations.length === 0) {
            // 没有推荐出来，那么就推荐转职列表中的最后一个吧
            recommendations.push(this.careerPage!.careerList![this.careerPage!.careerList!.length - 1]);
        }
        return recommendations;
    }

    private async changeCareer(careerId: number, careerName?: string) {
        await new PersonalCareerManagement(this.credential).transfer(careerId);
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.spellManager.reload();
        await this.spellManager.render(this.roleManager.role!);
        await this.reload();
        await this.render();
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        await this.mirrorManager?.reload();
        await this.mirrorManager?.render(this.roleManager.role!);
        if (careerName !== undefined) {
            logger.info("成功转职到：" + careerName);
        }
    }

}

export = PersonalCareerManagementPageProcessor;