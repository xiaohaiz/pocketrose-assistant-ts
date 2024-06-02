import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import LocationModeTown from "../../core/location/LocationModeTown";
import {RoleManager} from "../../widget/RoleManager";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import ButtonUtils from "../../util/ButtonUtils";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import PageUtils from "../../util/PageUtils";
import {PocketLogger} from "../../pocket/PocketLogger";
import MessageBoard from "../../util/MessageBoard";
import NpcLoader from "../../core/role/NpcLoader";
import {PocketEvent} from "../../pocket/PocketEvent";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import {EquipmentManager} from "../../widget/EquipmentManager";
import PocketPageRenderer from "../../util/PocketPageRenderer";
import {Equipment} from "../../core/equipment/Equipment";
import _ from "lodash";
import TreasureBag from "../../core/equipment/TreasureBag";
import EquipmentProfileLoader from "../../core/equipment/EquipmentProfileLoader";
import Role from "../../core/role/Role";
import StringUtils from "../../util/StringUtils";
import EquipmentSet from "../../core/equipment/EquipmentSet";
import EquipmentSetLoader from "../../core/equipment/EquipmentSetLoader";

const logger = PocketLogger.getLogger("EQUIPMENT");

class TownEquipmentProfilePageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown;
    private readonly roleManager: RoleManager;
    private readonly equipmentManager: EquipmentManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeTown;
        this.roleManager = new RoleManager(credential, this.location);
        this.equipmentManager = new EquipmentManager(credential, this.location);
        this.equipmentManager.feature.onRefresh = () => {
            this.equipmentManager.renderRoleStatus(this.roleManager.role);
        };
    }

    private candidates?: EquipmentCandidate[];

    protected async doProcess(): Promise<void> {
        await this.generateHTML();
        await this.resetMessageBoard();
        await this.bindButtons();
        this.roleManager.bindButtons();
        this.equipmentManager.bindButtons();
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        this.equipmentManager.renderRoleStatus(this.roleManager.role);
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .doBind();
    }

    private async generateHTML() {
        const mainTable = $("body:first > table:first > tbody:first")
            .find("> tr:first > td:first > table:first");

        // --------------------------------------------------------------------
        // Equipment Profile Header
        // --------------------------------------------------------------------
        mainTable.find("> tbody:first")
            .find("> tr:first > td:first")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜ 智 能 装 备 ＞＞", this.roleLocation);
            });
        $("#_pocket_page_command").html(() => {
            const refreshButtonTitle = ButtonUtils.createTitle("刷新", "r");
            const returnButtonTitle = ButtonUtils.createTitle("退出", "Esc");
            return "<span> <button role='button' class='C_pocket_StableButton C_pocket_StatelessElement' id='refreshButton'>" + refreshButtonTitle + "</button></span>" +
                "<span> <button role='button'  class='C_pocket_StableButton C_pocket_StatelessElement' id='returnButton'>" + returnButtonTitle + "</button></span>";
        });

        // --------------------------------------------------------------------
        // Role Information
        // --------------------------------------------------------------------
        mainTable.find("> tbody:first")
            .find("> tr:eq(1) > td:first")
            .find("> table:first > tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .attr("id", "roleInformationManager")
            .closest("tr")
            .find("> td:eq(1)")
            .html(() => {
                return this.roleManager.generateHTML();
            });

        // --------------------------------------------------------------------
        // Message Board
        // --------------------------------------------------------------------
        mainTable.find("> tbody:first")
            .find("> tr:eq(2) > td:first")
            .attr("id", "messageBoardContainer");
        MessageBoard.createMessageBoardStyleB("messageBoardContainer", NpcLoader.getNpcImageHtml("U_041")!);
        $("#messageBoard").css("background-color", "black")
            .css("color", "white");

        // --------------------------------------------------------------------
        // Traditional Customize Weapon
        // --------------------------------------------------------------------
        mainTable.find("> tbody:first")
            .find("> tr:eq(3)")
            .hide()
            .find("> td:first")
            .attr("id", "traditionalCustomizeWeapon")
            .find("> form:first")
            .remove();

        // --------------------------------------------------------------------
        // Equipment related panel
        // --------------------------------------------------------------------
        $("#traditionalCustomizeWeapon").parent()
            .after($("<tr><td id='personalEquipmentRecommendationPanel'></td></tr>" +
                "<tr style='display:none'><td id='personalEquipmentRecommendationResult'></td></tr>" +
                "<tr><td id='equipmentPanel'></td></tr>"));
        $("#personalEquipmentRecommendationPanel").html(() => {
            let html = "<table style='background-color:#888888;width:100%;margin:auto;border-width:0'>";
            html += "<tbody style='background-color:#F8F0E0;text-align:center'>";
            html += "<tr>";
            html += "<th style='background-color:skyblue;font-size:120%'>智 能 装 备 推 荐</th>";
            html += "</tr>";
            html += "<tr>";
            html += "<td>";
            html += "<select id='scope'>";
            html += "<option value='SELF'>自有装备</option>";
            html += "<option value='ALL'>资料库中所有装备</option>";
            html += "</select>";
            html += PocketPageRenderer.AND();
            html += "<select id='hitCount'>";
            html += "<option value='1'>(１)ＨＩＴ</option>";
            html += "<option value='2'>(２)ＨＩＴ</option>";
            html += "<option value='3'>(３)ＨＩＴ</option>";
            html += "<option value='4'>(４)ＨＩＴ</option>";
            html += "<option value='5'>(５)ＨＩＴ</option>";
            html += "<option value='6'>(６)ＨＩＴ</option>";
            html += "</select>";
            html += PocketPageRenderer.AND();
            html += "<select id='sort'>";
            html += "<option value='ALL'>攻守兼备</option>";
            html += "<option value='DEFENSE'>防御优先</option>";
            html += "<option value='ATTACK'>攻击优先</option>";
            html += "<option value='DEFENSE'>防御优先</option>";
            html += "</select>";
            html += PocketPageRenderer.AND();
            html += "<select id='star'>";
            html += "<option value='0'>不带齐心</option>";
            html += "<option value='1'>带上齐心</option>";
            html += "</select>";
            html += PocketPageRenderer.AND();
            html += "<button role='button' class='C_pocket_StableButton C_pocket_StatelessElement' id='recommendButton'>推荐</button>";
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            return html;
        });
        $("#equipmentPanel").html(() => {
            return this.equipmentManager.generateHTML();
        });

        $("#scope").on("change", event => {
            const currentSelect = $(event.target).val() as string;
            if (currentSelect === "SELF") {
                $("#recommendButton").html("推荐");
            } else {
                $("#recommendButton").html("模拟");
            }
        });
    }

    private async resetMessageBoard() {
        MessageBoard.initializeManager();
        MessageBoard.initializeWelcomeMessage();
        logger.info("如果想要制作<span style='color:yellow;font-weight:bold'>自制武器</span>，点击左上角头像。");
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
            logger.info("装备资料刷新操作完成。");
            PocketPage.enableStatelessElements();
        });
        $("#recommendButton").on("click", async () => {
            PageUtils.disableElement("recommendButton");
            this.candidates = undefined;
            const candidates = await this._generateEquipmentCandidates();
            await this._calculateEquipmentCandidates(candidates);
            await this.render();
            PageUtils.enableElement("recommendButton");
        });
        const roleImageHandler = PocketEvent.newMouseClickHandler();
        roleImageHandler.threshold = 1;
        roleImageHandler.handler = () => {
            $("#traditionalCustomizeWeapon").parent().toggle();
        };
        MouseClickEventBuilder.newInstance()
            .onElementClicked("roleInformationManager", async () => {
                await roleImageHandler.onMouseClicked();
            })
            .onElementClicked("messageBoardManager", async () => {
                await this.resetMessageBoard();
            })
            .doBind();
    }

    private async render(doRefresh: boolean = false) {
        $(".C_DynamicButton").off("click");
        const panel = $("#personalEquipmentRecommendationResult");
        panel.html("").parent().hide();
        if (this.candidates !== undefined && this.candidates.length > 0) {
            let html = "<table style='background-color:#888888;width:100%;margin:auto;border-width:0'>";
            html += "<tbody style='text-align:center;background-color:#F8F0E0'>";
            html += "<tr style='background-color:skyblue'>";
            html += "<th>序号</th>";
            html += "<th>武器</th>";
            html += "<th>防具</th>";
            html += "<th>饰品</th>";
            html += "<th>攻击</th>";
            html += "<th>总攻击</th>";
            html += "<th>防御</th>";
            html += "<th>总防御</th>";
            html += "<th>加载</th>";
            html += "</tr>";
            for (const c of this.candidates!) {
                html += "<tr>";
                html += "<th>" + (c.index! + 1) + "</th>";
                html += "<td style='white-space:nowrap'>" + c.weapon.fullName + "</td>";
                html += "<td style='white-space:nowrap'>" + c.armor.fullName + "</td>";
                html += "<td style='white-space:nowrap'>" + c.accessory.fullName + "</td>";
                html += "<td style='color:red'>" + c._baseAttack! + "</td>";
                html += "<td style='color:red'>" + c._totalAttack! + "</td>";
                html += "<td style='color:green'>" + c._baseDefense! + "</td>";
                html += "<td style='color:green'>" + c._totalDefense! + "</td>";
                html += "<td>";
                if (c.self) {
                    html += "<button role='button' class='C_LoadButton C_DynamicButton' id='load_" + c.index! + "'>加载</button>";
                } else {
                    html += "<button role='button' disabled>加载</button>";
                }
                html += "</td>";
                html += "</tr>";
            }
            html += "</tbody>";
            html += "</table>";
            panel.html(html).parent().show();
        } else {
            if (!doRefresh) {
                panel.html(() => {
                    return "<span style='font-weight:bold;font-size:200%;color:red'>没有发现值得推荐的装备！</span>";
                }).parent().show();
            }
        }
        $(".C_LoadButton").on("click", async (event) => {
            const btnId = $(event.target).attr("id") as string;
            PageUtils.disableElement(btnId);
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            const candidate = this.candidates!.find(it => it.index === index);
            if (candidate === undefined) {
                PageUtils.enableElement(btnId);
                return;
            }
            const set = new EquipmentSet();
            set.initialize();
            set.weaponName = candidate.weapon.fullName;
            set.armorName = candidate.armor.fullName;
            set.accessoryName = candidate.accessory.fullName;
            const loader = new EquipmentSetLoader(this.credential, this.equipmentManager.equipmentPage!.equipmentList!);
            await loader.load(set);
            await this.refresh();
        });
    }

    private async refresh() {
        this.candidates = undefined;
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        this.equipmentManager.renderRoleStatus(this.roleManager.role);
        await this.render(true);
    }

    private async dispose() {
        await this.roleManager.dispose();
    }

    private async _generateEquipmentCandidates() {
        const scope = $("#scope").val() as string;
        const includeStar = _.parseInt($("#star").val() as string);

        let all: Equipment[];
        if (scope === "SELF") {
            all = _.clone(this.equipmentManager.equipmentPage!.equipmentList!);
            const bag = this.equipmentManager.equipmentPage!.findTreasureBag();
            if (bag !== null) {
                const bagPage = await new TreasureBag(this.credential).open(bag.index!);
                all.push(..._.clone(bagPage.equipmentList!));
            }
        } else {
            all = EquipmentProfileLoader.loadAsEquipments();
        }

        // Fix equipment attribute.
        all.forEach(it => {
            if (it.name === "千幻碧水猿洛克奇斯") it.attribute = "水";
            if (it.name === "地纹玄甲龟斯特奥特斯") it.attribute = "土";
            if (it.name === "幽冥黑鳞蟒罗尼科斯") it.attribute = "暗";
            if (it.name === "火睛混沌兽哈贝达") it.attribute = "火";
            if (it.name === "羽翅圣光虎阿基勒斯") it.attribute = "光";
            if (it.name === "金翅追日鹰庞塔雷斯") it.attribute = "金";
            if (it.name === "风翼三足凤纳托利斯") it.attribute = "风";
        });

        all = all.filter(it => it.name !== "2015.02.14情人节巧克力")
            .filter(it => it.name !== "2005.5.1-2006.5.1劳动升级版")
            .filter(it => it.name !== "2015.01.29十周年纪念")
            .filter(it => it.name !== "2015.02.14情人节玫瑰")
            .filter(it => it.name !== "双经斩")
            .filter(it => it.name !== "1.5倍界王拳套")
            .filter(it => it.name !== "九齿钉耙")
            .filter(it => it.name !== "降魔杖")
            .filter(it => it.name !== "2010圣诞老人（葫芦娃老爷爷）面具")
            .filter(it => it.name !== "魔法使的闪光弹")
            .filter(it => it.name !== "千与千寻")
            .filter(it => it.name !== "勿忘我")
            .filter(it => it.name !== "宠物蛋")
            .filter(it => it.name !== "大师球")
            .filter(it => it.name !== "宗师球")
            .filter(it => it.name !== "超力怪兽球")
            .filter(it => !_.endsWith(it.name, "玉佩"))
            .filter(it => !_.endsWith(it.name, "葵花宝典"));

        if (includeStar === 0) {
            all = all.filter(it => !_.startsWith(it.fullName, "齐心"));
        }

        // eliminate duplicated
        const list: Equipment[] = [];
        all.forEach(it => {
            const x = list.find(e => e.fullName === it.fullName);
            if (x === undefined) {
                list.push(it);
            }
        });
        all = list;

        const weapons = all.filter(it => it.category === "武器");
        const armors = all.filter(it => it.category === "防具");
        const accessories = all.filter(it => it.category === "饰品");

        return new EquipmentCandidates(weapons, armors, accessories);
    }

    private async _calculateEquipmentCandidates(candidates: EquipmentCandidates) {
        if (!candidates.available) return;
        let ecs: EquipmentCandidate[] = [];
        for (const weapon of candidates.weapons) {
            for (const armor of candidates.armors) {
                for (const accessory of candidates.accessories) {
                    const ec = new EquipmentCandidate(weapon, armor, accessory);
                    ecs.push(ec);
                }
            }
        }
        const expectHitCount = _.parseInt($("#hitCount").val() as string);

        // 计算HIT数
        ecs = ecs.filter(it => it.calculateHitCount(this.roleManager.role!) === expectHitCount);

        // 排序
        ecs.forEach(it => {
            it.calculateBaseAttack();
            it.calculateTotalAttack(this.roleManager.role!);
            it.calculateBaseDefense(this.roleManager.role!);
            it.calculateTotalDefense(this.roleManager.role!);
        });
        const sort = $("#sort").val() as string;
        if (sort === "ALL") {
            ecs = ecs.sort((a, b) => {
                const bs = b._totalAttack! + b._totalDefense!;
                const as = a._totalAttack! + a._totalDefense!;
                return bs - as;
            });
        } else if (sort === "ATTACK") {
            ecs = ecs.sort((a, b) => {
                return b._totalAttack! - a._totalAttack!;
            });
        } else {
            ecs = ecs.sort((a, b) => {
                return b._totalDefense! - a._totalDefense!;
            });
        }

        // index
        let idx = 0;
        ecs.forEach(it => it.index = idx++);

        // 最多取最前面30种
        ecs = ecs.slice(0, _.min([30, ecs.length])!);

        const scope = $("#scope").val() as string;
        ecs.forEach(it => it.self = (scope === "SELF"));

        this.candidates = ecs;
    }
}

class EquipmentCandidates {

    weapons: Equipment[];
    armors: Equipment[];
    accessories: Equipment[];

    constructor(weapons: Equipment[], armors: Equipment[], accessories: Equipment[]) {
        this.weapons = weapons;
        this.armors = armors;
        this.accessories = accessories;
    }

    get available() {
        return this.weapons.length > 0 && this.armors.length > 0 && this.accessories.length > 0;
    }
}

class EquipmentCandidate {

    index?: number;
    weapon: Equipment;
    armor: Equipment;
    accessory: Equipment;
    self?: boolean;

    _baseAttack?: number;
    _totalAttack?: number;
    _baseDefense?: number;
    _totalDefense?: number;

    constructor(weapon: Equipment, armor: Equipment, accessory: Equipment) {
        this.weapon = weapon;
        this.armor = armor;
        this.accessory = accessory;
    }

    calculateHitCount(role: Role) {
        const totalWeight = this.weapon.weight! +
            this.armor.weight! +
            this.accessory.weight!;
        const delta = role.speed! - totalWeight;
        let hitCount: number;
        if (delta < 50) {
            hitCount = 1;
        } else {
            hitCount = _.floor(delta / 50);
        }
        return hitCount;
    }

    calculateBaseAttack() {
        this._baseAttack = this.weapon.power!;
    }

    calculateTotalAttack(role: Role) {
        this._totalAttack = this._baseAttack! + role.attack!;
    }

    calculateBaseDefense(role: Role) {
        let a1 = this.armor.power!;
        if (this.armor.isHeavyArmor) {
            if (this.armor.attribute! === role.attribute!) {
                a1 = _.floor(a1 * 1.5);
            }
        }
        const a2 = this.accessory.power!;
        this._baseDefense = a1 + a2;
    }

    calculateTotalDefense(role: Role) {
        this._totalDefense = this._baseDefense! + role.defense!;
    }
}

export {TownEquipmentProfilePageProcessor};