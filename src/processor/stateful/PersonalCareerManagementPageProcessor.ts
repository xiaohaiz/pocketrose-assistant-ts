import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import Role from "../../core/role/Role";
import {PersonalStatus} from "../../core/role/PersonalStatus";
import SetupLoader from "../../core/config/SetupLoader";
import PersonalCareerManagement from "../../core/career/PersonalCareerManagement";
import PageUtils from "../../util/PageUtils";
import PersonalCareerManagementPage from "../../core/career/PersonalCareerManagementPage";
import ButtonUtils from "../../util/ButtonUtils";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import PersonalCareerManagementPageParser from "../../core/career/PersonalCareerManagementPageParser";
import NpcLoader from "../../core/role/NpcLoader";
import CommentBoard from "../../util/CommentBoard";
import MessageBoard from "../../util/MessageBoard";
import _ from "lodash";
import LocationModeTown from "../../core/location/LocationModeTown";
import LocationModeCastle from "../../core/location/LocationModeCastle";
import {SpellManager} from "../../widget/SpellManager";
import CareerLoader from "../../core/career/CareerLoader";
import StringUtils from "../../util/StringUtils";
import {EquipmentManager} from "../../widget/EquipmentManager";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import StorageUtils from "../../util/StorageUtils";
import {MirrorManager} from "../../widget/MirrorManager";
import {PocketFormGenerator} from "../../pocket/PocketPage";

class PersonalCareerManagementPageProcessor extends StatefulPageProcessor {

    private readonly formGenerator: PocketFormGenerator;

    protected spellManager: SpellManager;
    protected equipmentManager: EquipmentManager;
    protected mirrorManager?: MirrorManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        const locationMode = this.createLocationMode() as LocationModeTown | LocationModeCastle;

        this.formGenerator = new PocketFormGenerator(credential, locationMode);

        this.spellManager = new SpellManager(this.credential, locationMode);
        this.spellManager.feature.onRefresh = (message) => {
            this.role = message.extensions.get("role") as Role;
            $("#roleSpell").html(_.toString(this.role!.spell));
            this.mirrorManager?.reload().then(() => {
                this.mirrorManager?.render(this.role!).then();
            });
        };
        this.equipmentManager = new EquipmentManager(this.credential, locationMode);
        this.equipmentManager.feature.enableGrowthTriggerOnDispose = true;
        this.equipmentManager.feature.enableSpaceTriggerOnDispose = true;
        this.equipmentManager.feature.enableStatusTriggerOnDispose = true;
        this.equipmentManager.feature.enableUsingTriggerOnDispose = true;
        this.equipmentManager.feature.onMessage = s => MessageBoard.publishMessage(s);
        this.equipmentManager.feature.onWarning = s => MessageBoard.publishWarning(s);
        this.equipmentManager.feature.onRefresh = () => {
            this.equipmentManager.renderHitStatus(this.role);
        };

        if (locationMode instanceof LocationModeTown) {
            this.mirrorManager = new MirrorManager(credential, locationMode);
            this.mirrorManager.feature.onRefresh = (message) => {
                this.onMirrorManagerChanged(message.extensions.get("role") as Role).then();
            };
        }
    }

    protected role?: Role;
    protected careerPage?: PersonalCareerManagementPage;

    protected get isCareerTransferEnabled(): boolean {
        const config: any = SetupLoader.loadMirrorCareerFixedConfig(this.credential.id);
        return !config["_m_" + this.role!.mirrorIndex!];
    }

    protected async reloadRole() {
        this.role = await new PersonalStatus(this.credential).load();
    }

    protected async reloadCareerPage() {
        this.careerPage = await new PersonalCareerManagement(this.credential, this.townId).open();
    }

    protected async doRefresh() {
        await this.reloadRole();
        await this.renderRole();
        await this.spellManager.reload();
        await this.spellManager.render(this.role!);
        await this.reloadCareerPage();
        await this.renderCareerPage();
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        await this.mirrorManager?.reload();
        await this.mirrorManager?.render(this.role!);
    }

    protected async beforeReturn() {
        await this.equipmentManager.dispose();
    }

    protected async doProcess(): Promise<void> {
        // Initialize career page
        this.careerPage = PersonalCareerManagementPageParser.parsePage(PageUtils.currentPageHtml());

        // Render immutable page (static)
        await this.renderImmutablePage();

        await this.reloadRole();
        await this.renderRole();
        await this.spellManager.reload();
        await this.spellManager.render(this.role!);
        await this.reloadCareerPage();
        await this.renderCareerPage();
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        this.equipmentManager.renderHitStatus(this.role);

        await this.mirrorManager?.reload();
        await this.mirrorManager?.render(this.role!);

        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("e", () => PageUtils.triggerClick("equipmentButton"))
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .bind();
    }

    private async renderImmutablePage() {
        const t0 = $("table:first");
        t0.removeAttr("height")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .attr("id", "pageTitle")
            .removeAttr("bgcolor")
            .removeAttr("height")
            .css("background-color", "navy")
            .html("" +
                "<table style='background-color:transparent;width:100%;margin:0;border-width:0;border-spacing:0'>" +
                "<tbody>" +
                "<tr>" +
                "<td style='width:100%;font-size:150%;font-weight:bold;color:yellowgreen;text-align:left'>" +
                "＜＜　职 业 管 理 （" + this.roleLocation + "） ＞＞" +
                "</td>" +
                "<td style='white-space:nowrap;text-align:right'>" +
                "<span> <button role='button' id='equipmentButton' class='C_commandButton'>" + ButtonUtils.createTitle("装备", "e") + "</button></span>" +
                "<span> <button role='button' id='refreshButton' class='C_commandButton'>" + ButtonUtils.createTitle("刷新", "r") + "</button></span>" +
                "<span> <button role='button' id='returnButton' class='C_commandButton'>" + ButtonUtils.createTitle("退出", "Esc") + "</button></span>" +
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
                "");
        $("#pageTitle")
            .parent()
            .next()
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:last")
            .attr("id", "roleStatus")
            .html(() => {
                let html = "";
                html += "<table style='background-color:#888888;border-width:0'>";
                html += "<tbody>";
                html += "<tr style='background-color:skyblue'>";
                html += "<th>姓名</th>"
                html += "<th>定型</th>"
                html += "<th>ＬＶ</th>"
                html += "<th>ＨＰ</th>"
                html += "<th>ＭＰ</th>"
                html += "<th>攻击</th>"
                html += "<th>防御</th>"
                html += "<th>智力</th>"
                html += "<th>精神</th>"
                html += "<th>速度</th>"
                html += "<th>属性</th>"
                html += "<th>职业</th>"
                html += "<th>技能</th>"
                html += "<th>现金</th>"
                html += "</tr>";
                html += "<tr style='text-align:center'>";
                html += "<td style='background-color:#E8E8D0' id='roleName'></td>"
                html += "<td style='background-color:#E8E8D0' id='roleCareerFixed'></td>"
                html += "<td style='background-color:#E8E8D0' id='roleLevel'></td>"
                html += "<td style='background-color:#E8E8D0' id='roleHealth'></td>"
                html += "<td style='background-color:#E8E8D0' id='roleMana'></td>"
                html += "<td style='background-color:#E8E8D0' id='roleAttack'></td>"
                html += "<td style='background-color:#E8E8D0' id='roleDefense'></td>"
                html += "<td style='background-color:#E8E8D0' id='roleSpecialAttack'></td>"
                html += "<td style='background-color:#E8E8D0' id='roleSpecialDefense'></td>"
                html += "<td style='background-color:#E8E8D0' id='roleSpeed'></td>"
                html += "<td style='background-color:#E8E8D0' id='roleAttribute'></td>"
                html += "<td style='background-color:#E8E8D0' id='roleCareer'></td>"
                html += "<td style='background-color:#E8E8D0' id='roleSpell'></td>"
                html += "<td style='background-color:#E8E8D0' id='roleCash'></td>"
                html += "</tr>";
                html += "<tr style='display:none'>";
                html += "<td style='background-color:#E8E8D0;text-align:center' id='roleTask' colspan='14'></td>"
                html += "</tr>";
                html += "</tbody>";
                html += "</table>";
                return html;
            });

        $("#roleStatus").prev().prev().prev()
            .find("> img:first")
            .attr("id", "roleImage");

        $("img[alt='神官']")
            .parent()
            .prev()
            .attr("id", "messageBoard")
            .css("color", "white");

        t0.find("> tbody:first")
            .find("> tr:eq(3)")
            .find("> td:first")
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
                html += "<td style='background-color:#888888' id='careerPanel'>";
                html += this.generateCareerHTML();
                html += "</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<td style='background-color:#888888'>";
                html += this.equipmentManager.generateHTML();
                html += "</td>";
                html += "</tr>";
                html += "<tr style='display:none'>";
                html += "<td style='background-color:#888888' id='ID_mirrorManagerPanel'></td>";
                html += "</tr>";
                html += "</toby>";
                html += "</table>";
                return html;
            });

        const imageHtml = NpcLoader.getNpcImageHtml("白皇");
        CommentBoard.createCommentBoard(imageHtml!);
        CommentBoard.writeMessage("是的，你没有看错，换人了，某幕后黑手不愿意出镜。不过请放心，转职方面我是专业的，毕竟我一直制霸钉耙榜。<br>");
        CommentBoard.writeMessage("蓝色的职业代表你已经掌握了。我会把为你推荐的职业红色加深标识出来，当然，前提是如果有能推荐的。<br>");

        if (this.createLocationMode() instanceof LocationModeTown) {
            const panel = $("#ID_mirrorManagerPanel");
            panel.html(this.mirrorManager!.generateHTML());
            panel.parent().show();
        }

        await this.doCreateReturnButton();
        await this.createRefreshButton();
        await this.createEquipmentButton();

        this.equipmentManager.bindButtons();
        this.mirrorManager?.bindButtons();

        new MouseClickEventBuilder(this.credential)
            .bind($("#roleImage"), () => {
                if (this.role === undefined) return;
                const key = "_m_" + this.role.mirrorIndex!;
                const c: any = SetupLoader.loadMirrorCareerFixedConfig(this.credential.id);
                c[key] = !c[key];
                StorageUtils.set("_pa_070_" + this.credential.id, JSON.stringify(c));
                this.renderRole().then(() => {
                    this.renderCareerPage().then();
                });
            });
    }

    protected async doCreateReturnButton() {
        $("#extension_1").html(() => {
            return this.formGenerator.generateReturnFormHTML();
        });
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.beforeReturn().then(() => {
                PageUtils.triggerClick("_pocket_ReturnSubmit");
            });
        });
    }

    private async createRefreshButton() {
        $("#refreshButton").on("click", () => {
            $(".C_commandButton").prop("disabled", true);
            PageUtils.scrollIntoView("pageTitle");
            this.resetMessageBoard();
            this.doRefresh().then(() => {
                MessageBoard.publishMessage("刷新完成。");
                $(".C_commandButton").prop("disabled", false);
            });
        });
    }

    private async createEquipmentButton() {
        $("#extension_2").html(PageUtils.generateEquipmentManagementForm(this.credential));
        $("#equipmentButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.beforeReturn().then(() => {
                PageUtils.triggerClick("openEquipmentManagement");
            });
        });
    }

    private resetMessageBoard() {
        MessageBoard.resetMessageBoard(this.careerPage!.welcomeMessage!);
    }

    protected async renderRole() {
        $("#roleCareerFixed").html(() => {
            if (SetupLoader.isCareerFixed(this.credential.id, this.role!.mirrorIndex!)) {
                return "★";
            } else {
                return "";
            }
        });
        $("#roleName").html(_.toString(this.role?.name));
        $("#roleLevel").html(_.toString(this.role?.level));
        $("#roleHealth").html(this.role?.health + "/" + this.role?.maxHealth);
        $("#roleMana").html(this.role?.mana + "/" + this.role?.maxMana);
        $("#roleAttack").html(this.role!.attackHtml);
        $("#roleDefense").html(this.role!.defenseHtml);
        $("#roleSpecialAttack").html(this.role!.specialAttackHtml);
        $("#roleSpecialDefense").html(this.role!.specialDefenseHtml);
        $("#roleSpeed").html(this.role!.speedHtml);
        $("#roleAttribute").html(_.toString(this.role?.attribute));
        $("#roleCareer").html(_.toString(this.role?.career));
        $("#roleSpell").html(_.toString(this.role?.spell));
        $("#roleCash").html(this.role?.cash + " GOLD");
        if (this.role!.task !== undefined && this.role!.task !== "没有任务！") {
            const task = "<span style='background-color:red;color:white;font-weight:bold'>" + this.role?.task + "</span>";
            $("#roleTask").html(task).parent().show();
        } else {
            $("#roleTask").parent().hide();
        }
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

    protected async renderCareerPage() {
        $(".CareerUIButton")
            .off("click")
            .prop("disabled", false)
            .removeAttr("css");

        const panel = $("#careerPanel");
        const roleLevel = this.role!.level!;
        if (roleLevel <= 50) {
            panel.parent().hide();
            return;
        }
        panel.parent().show();

        // 已经掌握的职业用蓝色标记
        // 没有掌握的职业用红色标记（满级的情况下）
        // 不在转职列表中的按钮删除
        // 当前职业绿色显示
        if (this.role!.masterCareerList!.includes("小天位")) {
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
            if (this.role!.masterCareerList!.includes(careerName)) {
                $("#" + buttonId).css("color", "blue");
            } else {
                if (this.role!.level! >= 150) {
                    const btn = $("#" + buttonId);
                    if (careerName === this.role!.career) {
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
                if (recommendation === this.role!.career) {
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

        $(".C_changeCareerButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const careerId = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            const career = CareerLoader.findCareerById(careerId)!;
            if (!confirm("请确认要转职到“" + career + "”？")) {
                return;
            }
            this.changeCareer(careerId, career).then();
        });

    }

    private calculateRecommendationCareers() {
        // 没有满级，不推荐
        if (this.role!.level! < 150) {
            return [];
        }
        // 没有掌握全部职业，不推荐
        if (this.role!.masterCareerList!.length !== 32) {
            return [];
        }
        const recommendations: string[] = [];
        const targetCareerNames = Object.keys(CareerLoader.loadCareerTransferRequirements());
        for (let i = 0; i < targetCareerNames.length; i++) {
            const name = targetCareerNames[i];
            // @ts-ignore
            const requirement = CareerLoader.loadCareerTransferRequirements()[name];
            if (this.role!.maxMana! >= requirement[0] &&
                this.role!.attack! >= requirement[1] &&
                this.role!.defense! >= requirement[2] &&
                this.role!.specialAttack! >= requirement[3] &&
                this.role!.specialDefense! >= requirement[4] &&
                this.role!.speed! >= requirement[5]) {
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
        await this.reloadRole();
        await this.renderRole();
        await this.spellManager.reload();
        await this.spellManager.render(this.role!);
        await this.reloadCareerPage();
        await this.renderCareerPage();
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        await this.mirrorManager?.reload();
        await this.mirrorManager?.render(this.role!);
        if (careerName !== undefined) {
            MessageBoard.publishMessage("成功转职到：" + careerName);
        }
    }

    private async onMirrorManagerChanged(role: Role) {
        this.role = role;
        await this.renderRole();
        await this.spellManager.reload();
        await this.spellManager.render(this.role!);
        await this.reloadCareerPage();
        await this.renderCareerPage();
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
    }
}

export = PersonalCareerManagementPageProcessor;