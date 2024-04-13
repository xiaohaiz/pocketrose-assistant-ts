import CommonWidget from "./support/CommonWidget";
import Credential from "../util/Credential";
import LocationModeCastle from "../core/location/LocationModeCastle";
import LocationModeTown from "../core/location/LocationModeTown";
import OperationMessage from "../util/OperationMessage";
import PersonalPetEvolutionPage from "../core/monster/PersonalPetEvolutionPage";
import PersonalPetEvolution from "../core/monster/PersonalPetEvolution";
import _ from "lodash";
import PersonalPetManagementPage from "../core/monster/PersonalPetManagementPage";
import StringUtils from "../util/StringUtils";
import PageUtils from "../util/PageUtils";
import MessageBoard from "../util/MessageBoard";
import PersonalPetManagement from "../core/monster/PersonalPetManagement";
import MonsterProfileLoader from "../core/monster/MonsterProfileLoader";
import SetupLoader from "../core/config/SetupLoader";
import MonsterRelationLoader from "../core/monster/MonsterRelationLoader";
import TownBank from "../core/bank/TownBank";
import CastleBank from "../core/bank/CastleBank";

class EvolutionManager extends CommonWidget {

    constructor(credential: Credential, locationMode: LocationModeCastle | LocationModeTown) {
        super(credential, locationMode);
    }

    private petPage?: PersonalPetManagementPage;

    onRefresh?: (message: OperationMessage) => void;
    evolutionPage?: PersonalPetEvolutionPage;

    private async triggerRefresh(message: OperationMessage) {
        this.petPage = await new PersonalPetManagement(this.credential).open();
        message.extensions.set("petPage", this.petPage);
        await this.reload();
        await this.render(this.petPage);
        (this.onRefresh) && (this.onRefresh(message));
    }

    generateHTML(): string {
        return "<table style='background-color:transparent;width:100%;margin:auto;border-spacing:0;border-width:0'>" +
            "<tbody>" +
            // 繁殖
            "<tr style='display:none'>" +
            "<td id='_pocket_EVM_propagatePanel'>" + this.createPropagateHTML() + "</td>" +
            "</tr>" +
            // 进化
            "<tr style='display:none'>" +
            "<td id='_pocket_EVM_evolutionPanel'>" + this.createEvolutionHTML() + "</td>" +
            "</tr>" +
            // 退化
            "<tr style='display:none'>" +
            "<td id='_pocket_EVM_degradationPanel'>" + this.createDegradationHTML() + "</td>" +
            "</tr>" +
            //
            "<tr style='display:none'>" +
            "<td id='_pocket_EVM_consecratePanel'>" + this.createConsecrateHTML() + "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>";
    }

    private createPropagateHTML(): string {
        return "<table style='background-color:#888888;width:100%;margin:auto;border-width:0'>" +
            "<tbody style='text-align:center'>" +
            "<tr style='background-color:skyblue'>" +
            "<th style='width:50%;font-weight:bold'>父 系 宠 物</th>" +
            "<th style='width:50%;font-weight:bold'>母 系 宠 物</th>" +
            "</tr>" +
            "<tr>" +
            "<td style='width:50%;border-spacing:0'>" +
            "<table style='background-color:transparent;width:100%;margin:auto;border-width:0'>" +
            "<tbody id='_pocket_EVM_propagate_father_table'>" +
            "<tr style='background-color:wheat'>" +
            "<th style='width:64px'></th>" +
            "<th>名字</th>" +
            "<th>等级</th>" +
            "<th>性别</th>" +
            "<th>攻击</th>" +
            "<th>防御</th>" +
            "<th>智力</th>" +
            "<th>精神</th>" +
            "<th>速度</th>" +
            "<th></th>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "</td>" +
            "<td style='width:50%;border-spacing:0'>" +
            "<table style='background-color:transparent;width:100%;margin:auto;border-width:0'>" +
            "<tbody id='_pocket_EVM_propagate_mother_table'>" +
            "<tr style='background-color:wheat'>" +
            "<th></th>" +
            "<th>名字</th>" +
            "<th>等级</th>" +
            "<th>性别</th>" +
            "<th>攻击</th>" +
            "<th>防御</th>" +
            "<th>智力</th>" +
            "<th>精神</th>" +
            "<th>速度</th>" +
            "<th style='width:64px'></th>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "</td>" +
            "</tr>" +
            "<tr style='background-color:wheat;text-align:center'>" +
            "<td colspan='2'>" +
            "<button role='button' id='_pocket_EVM_propagateButton'>繁殖选择的宠物</button>" +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>";
    }

    private createEvolutionHTML(): string {
        return "<table style='background-color:#888888;width:100%;margin:auto;border-width:0'>" +
            "<tbody id='_pocket_EVM_evolution_table' style='text-align:center'>" +
            "<tr style='background-color:skyblue'>" +
            "<th style='text-align:center' colspan='14'>宠 物 进 化</th>" +
            "</tr>" +
            "<tr style='background-color:wheat'>" +
            "<th>进化</th>" +
            "<th>宠物名</th>" +
            "<th>等级</th>" +
            "<th>性别</th>" +
            "<th>攻击</th>" +
            "<th>防御</th>" +
            "<th>智力</th>" +
            "<th>精神</th>" +
            "<th>速度</th>" +
            "<th>进化前</th>" +
            "<th>进化后</th>" +
            "<th>进化前</th>" +
            "<th>进化后</th>" +
            "<th>图鉴数</th>" +
            "</tr>" +
            "</tbody>" +
            "</table>";
    }

    private createDegradationHTML(): string {
        return "<table style='background-color:#888888;width:100%;margin:auto;border-width:0'>" +
            "<tbody id='_pocket_EVM_degradation_table' style='text-align:center'>" +
            "<tr style='background-color:skyblue'>" +
            "<th style='text-align:center' colspan='14'>宠 物 退 化</th>" +
            "</tr>" +
            "<tr style='background-color:wheat'>" +
            "<th>退化</th>" +
            "<th>宠物名</th>" +
            "<th>等级</th>" +
            "<th>性别</th>" +
            "<th>攻击</th>" +
            "<th>防御</th>" +
            "<th>智力</th>" +
            "<th>精神</th>" +
            "<th>速度</th>" +
            "<th>退化前</th>" +
            "<th>退化后</th>" +
            "<th>退化前</th>" +
            "<th>退化后</th>" +
            "<th>图鉴数</th>" +
            "</tr>" +
            "</tbody>" +
            "</table>";
    }

    private createConsecrateHTML(): string {
        return "<table style='background-color:#888888;width:100%;margin:auto;border-width:0'>" +
            "<tbody id='_pocket_EVM_consecrate_table' style='text-align:center'>" +
            "<tr style='background-color:skyblue'>" +
            "<th style='text-align:center' colspan='11'>宠 物 献 祭</th>" +
            "</tr>" +
            "<tr style='background-color:wheat'>" +
            "<th>图鉴</th>" +
            "<th>宠物名</th>" +
            "<th>等级</th>" +
            "<th>性别</th>" +
            "<th>攻击</th>" +
            "<th>防御</th>" +
            "<th>智力</th>" +
            "<th>精神</th>" +
            "<th>速度</th>" +
            "<th>封印</th>" +
            "<th>超级封印</th>" +
            "</tr>" +
            "</tbody>" +
            "</table>";
    }

    bindButtons() {
        $("#_pocket_EVM_propagateButton").on("click", () => {
            const fatherIndexList: number[] = [];
            const motherIndexList: number[] = [];
            $(".C_pocket_EVM_propagate_select_father")
                .each((_idx, it) => {
                    const btnId = $(it).attr("id") as string;
                    if (PageUtils.isColorBlue(btnId)) {
                        const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
                        fatherIndexList.push(index);
                    }
                });
            $(".C_pocket_EVM_propagate_select_mother")
                .each((_idx, it) => {
                    const btnId = $(it).attr("id") as string;
                    if (PageUtils.isColorBlue(btnId)) {
                        const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
                        motherIndexList.push(index);
                    }
                });
            if (fatherIndexList.length !== 1 || motherIndexList.length !== 1) {
                MessageBoard.publishWarning("无效的父系或者母系宠物选择，忽略！");
                return;
            }
            const father = this.petPage!.findPet(fatherIndexList[0])!;
            const mother = this.petPage!.findPet(motherIndexList[0])!;
            if (!confirm("请确认要繁殖\"" + father.name + "\"和\"" + mother.name + "\"？")) {
                return;
            }
            new PersonalPetEvolution(this.credential)
                .propagate(father.index!, mother.index!)
                .then(() => {
                    const message = OperationMessage.success();
                    this.triggerRefresh(message).then();
                });
        });
    }

    async reload() {
        this.evolutionPage = await new PersonalPetEvolution(this.credential, this.townId).open();
    }

    async render(petPage: PersonalPetManagementPage) {
        this.petPage = petPage;

        $(".C_pocket_EVM_mutable").off("click").off("dblclick");
        $(".C_pocket_EVM_removal").remove();

        let showPanel = false;

        if (this.renderPropagate()) showPanel = true;
        if (this.renderEvolution()) showPanel = true;
        if (this.renderDegradation()) showPanel = true;
        if (this.renderConsecrate()) showPanel = true;

        if (showPanel) {
            $("#_pocket_evolutionPanel").parent().show();
        } else {
            $("#_pocket_evolutionPanel").parent().hide();
        }
    }

    private renderPropagate(): boolean {
        const males = _.forEach(this.evolutionPage!.malePetList!).filter(it => it.selectable);
        const females = _.forEach(this.evolutionPage!.femalePetList!).filter(it => it.selectable);
        const panel = $("#_pocket_EVM_propagatePanel");
        if (males.length === 0 || females.length === 0) {
            panel.parent().hide();
            return false;
        }
        panel.parent().show();

        for (const male of males) {
            const pet = this.petPage!.findPet(male.index!)!;
            let html = "";
            html += "<tr style='background-color:#E8E8D0' class='C_pocket_EVM_removal'>";
            html += "<td>" + pet.imageHtml + "</td>";
            html += "<td>" + male.nameHtml + "</td>";
            html += "<td>" + male.levelHtml + "</td>";
            html += "<td>" + male.gender + "</td>";
            html += "<td>" + male.attackHtml + "</td>";
            html += "<td>" + male.defenseHtml + "</td>";
            html += "<td>" + male.specialAttackHtml + "</td>";
            html += "<td>" + male.specialDefenseHtml + "</td>";
            html += "<td>" + male.speedHtml + "</td>";
            html += "<td>";
            html += "<button role='button' style='color:grey' " +
                "class='C_pocket_EVM_mutable C_pocket_EVM_propagate_select_father' " +
                "id='_pocket_EVM_propagate_father_index_" + male.index + "'>选择</button>";
            html += "</td>";
            html += "</tr>";
            $("#_pocket_EVM_propagate_father_table").append($(html));
        }

        for (const female of females) {
            const pet = this.petPage!.findPet(female.index!)!;
            let html = "";
            html += "<tr style='background-color:#E8E8D0' class='C_pocket_EVM_removal'>";
            html += "<td>";
            html += "<button role='button' style='color:grey' " +
                "class='C_pocket_EVM_mutable C_pocket_EVM_propagate_select_mother' " +
                "id='_pocket_EVM_propagate_mother_index_" + female.index + "'>选择</button>";
            html += "</td>";
            html += "<td>" + female.nameHtml + "</td>";
            html += "<td>" + female.levelHtml + "</td>";
            html += "<td>" + female.gender + "</td>";
            html += "<td>" + female.attackHtml + "</td>";
            html += "<td>" + female.defenseHtml + "</td>";
            html += "<td>" + female.specialAttackHtml + "</td>";
            html += "<td>" + female.specialDefenseHtml + "</td>";
            html += "<td>" + female.speedHtml + "</td>";
            html += "<td>" + pet.imageHtml + "</td>";
            html += "</tr>";
            $("#_pocket_EVM_propagate_mother_table").append($(html));
        }

        $(".C_pocket_EVM_propagate_select_father").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            PageUtils.toggleColor(
                btnId,
                () => {
                    $(".C_pocket_EVM_propagate_select_father").css("color", "grey");
                    PageUtils.changeColorBlue(btnId);
                },
                undefined
            );
        });
        $(".C_pocket_EVM_propagate_select_mother").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            PageUtils.toggleColor(
                btnId,
                () => {
                    $(".C_pocket_EVM_propagate_select_mother").css("color", "grey");
                    PageUtils.changeColorBlue(btnId);
                },
                undefined
            );
        });

        return true;
    }

    private renderEvolution(): boolean {
        const panel = $("#_pocket_EVM_evolutionPanel");
        const candidates = _.forEach(this.evolutionPage!.evolutionPetList!).filter(it => it.selectable);
        if (candidates.length === 0) {
            panel.parent().hide();
            return false;
        }
        panel.parent().show();

        for (const candidate of candidates) {
            const beforeHtml = MonsterProfileLoader.load(candidate.beforeCode)!.imageHtml;
            const afterHtml = MonsterProfileLoader.load(candidate.afterCode)!.imageHtml;
            const pet = this.petPage!.findPet(candidate.index!)!;
            let html = "";
            html += "<tr style='background-color:#E8E8D0' class='C_pocket_EVM_removal'>";
            html += "<td>";
            html += "<button role='button' " +
                "class='C_pocket_EVM_mutable C_pocket_EVM_evolution' " +
                "id='_pocket_EVM_evolution_index_" + candidate.index + "_" + candidate.evolution + "'>进化</button>";
            html += "</td>";
            html += "<td>" + candidate.nameHtml + "</td>";
            html += "<td>" + candidate.levelHtml + "</td>";
            html += "<td>" + pet.gender + "</td>";
            html += "<td>" + candidate.attackHtml + "</td>";
            html += "<td>" + candidate.defenseHtml + "</td>";
            html += "<td>" + candidate.specialAttackHtml + "</td>";
            html += "<td>" + candidate.specialDefenseHtml + "</td>";
            html += "<td>" + candidate.speedHtml + "</td>";
            html += "<td>" + candidate.beforeHtml + "</td>";
            html += "<td>" + candidate.afterHtml + "</td>";
            html += "<td>" + beforeHtml + "</td>";
            html += "<td>" + afterHtml + "</td>";
            html += "<td>" + candidate.mapCount + "</td>";
            html += "</tr>";
            $("#_pocket_EVM_evolution_table").append($(html));
        }
        $(".C_pocket_EVM_evolution").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const s = StringUtils.substringAfter(btnId, "_pocket_EVM_evolution_index_");
            const index = _.parseInt(StringUtils.substringBefore(s, "_"));
            const evolution = _.parseInt(StringUtils.substringAfter(s, "_"));
            const pet = this.evolutionPage!.findEvolutionPet(index, evolution)!;
            if (!confirm("请确认将\"" + pet.name + "\"进化到\"" + pet.after + "\"？")) {
                return;
            }
            new PersonalPetEvolution(this.credential).evolve(index, evolution).then(() => {
                const message = OperationMessage.success();
                message.extensions.set("mode", "EVOLUTION");
                this.triggerRefresh(message).then();
            });
        });

        return true;
    }

    private renderDegradation(): boolean {
        const panel = $("#_pocket_EVM_degradationPanel");
        const candidates = _.forEach(this.evolutionPage!.degradationPetList!).filter(it => it.selectable);
        if (candidates.length === 0) {
            panel.parent().hide();
            return false;
        }
        panel.parent().show();

        for (const candidate of candidates) {
            const beforeHtml = MonsterProfileLoader.load(candidate.beforeCode)!.imageHtml;
            const afterHtml = MonsterProfileLoader.load(candidate.afterCode)!.imageHtml;
            const pet = this.petPage!.findPet(candidate.index!)!;
            let html = "";
            html += "<tr style='background-color:#E8E8D0' class='C_pocket_EVM_removal'>";
            html += "<td>";
            html += "<button role='button' " +
                "class='C_pocket_EVM_mutable C_pocket_EVM_degradation' " +
                "id='_pocket_EVM_degradation_index_" + candidate.index + "'>退化</button>";
            html += "</td>";
            html += "<td>" + candidate.nameHtml + "</td>";
            html += "<td>" + candidate.levelHtml + "</td>";
            html += "<td>" + pet.gender + "</td>";
            html += "<td>" + candidate.attackHtml + "</td>";
            html += "<td>" + candidate.defenseHtml + "</td>";
            html += "<td>" + candidate.specialAttackHtml + "</td>";
            html += "<td>" + candidate.specialDefenseHtml + "</td>";
            html += "<td>" + candidate.speedHtml + "</td>";
            html += "<td>" + candidate.beforeHtml + "</td>";
            html += "<td>" + candidate.afterHtml + "</td>";
            html += "<td>" + beforeHtml + "</td>";
            html += "<td>" + afterHtml + "</td>";
            html += "<td>" + candidate.mapCount + "</td>";
            html += "</tr>";
            $("#_pocket_EVM_degradation_table").append($(html));
        }
        $(".C_pocket_EVM_degradation").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            const pet = this.evolutionPage!.findDegradationPet(index)!;
            if (!confirm("请确认将\"" + pet.name + "\"退化到\"" + pet.after + "\"？")) {
                return;
            }
            new PersonalPetEvolution(this.credential).degrade(index).then(() => {
                const message = OperationMessage.success();
                message.extensions.set("mode", "DEGRADATION");
                this.triggerRefresh(message).then();
            });
        });

        return true;
    }

    private renderConsecrate(): boolean {
        const panel = $("#_pocket_EVM_consecratePanel");
        const candidates = _.forEach(this.evolutionPage!.consecratePetList!).filter(it => it.selectable);
        if (candidates.length === 0) {
            panel.parent().hide();
            return false;
        }
        panel.parent().show();

        for (const candidate of candidates) {
            const pet = this.petPage!.findPet(candidate.index!)!;
            let html = "";
            html += "<tr style='background-color:#E8E8D0' class='C_pocket_EVM_removal'>";
            html += "<td rowspan='2'>" + pet.imageHtml + "</td>";
            html += "<td>" + candidate.nameHtml + "</td>";
            html += "<td>" + candidate.levelHtml + "</td>";
            html += "<td>" + pet.gender + "</td>";
            html += "<td>" + candidate.attackHtml + "</td>";
            html += "<td>" + candidate.defenseHtml + "</td>";
            html += "<td>" + candidate.specialAttackHtml + "</td>";
            html += "<td>" + candidate.specialDefenseHtml + "</td>";
            html += "<td>" + candidate.speedHtml + "</td>";
            html += "<td>";
            if (!SetupLoader.isOnlyConsecrateInitialPetEnabled() || (SetupLoader.isOnlyConsecrateInitialPetEnabled() && candidate.level === 1)) {
                html += "<button role='button' class='C_pocket_EVM_mutable C_pocket_EVM_sacrificeButton' id='_pocket_EVM_sacrifice_" + candidate.index + "'>牺牲</button>";
            }
            html += "</td>";
            html += "<td>";
            if (!SetupLoader.isOnlyConsecrateInitialPetEnabled() || (SetupLoader.isOnlyConsecrateInitialPetEnabled() && candidate.level === 1)) {
                html += "<button role='button' class='C_pocket_EVM_mutable C_pocket_EVM_consecrateButton' id='_pocket_EVM_consecrate_" + candidate.index + "'>献祭</button>";
            }
            html += "</td>";
            html += "</tr>";

            html += "<tr style='background-color:#E8E8D0' class='C_pocket_EVM_removal'>";
            html += "<td style='background-color:#E8E8D0;text-align:left;height:64px' colspan='10'>";
            for (const it of MonsterRelationLoader.getPetRelations(parseInt(pet.code!))) {
                const m = MonsterProfileLoader.load(it);
                if (m !== null) {
                    html += m.imageHtml;
                    html += m.code;
                }
            }
            html += "</td>";
            html += "</tr>";
            $("#_pocket_EVM_consecrate_table").append($(html));
        }

        $(".C_pocket_EVM_sacrificeButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            const pet = this.evolutionPage!.findConsecratePet(index)!;
            if (!confirm("请确认花费300万将\"" + pet.name + "\"还原回其自己的图鉴并得到一张藏宝图？")) {
                return;
            }
            this.sacrifice(index).then(() => {
                const message = OperationMessage.success();
                message.extensions.set("mode", "SACRIFICE");
                this.triggerRefresh(message).then();
            });
        });
        $(".C_pocket_EVM_consecrateButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            const pet = this.evolutionPage!.findConsecratePet(index)!;
            if (!confirm("请确认花费1000万将\"" + pet.name + "\"还原回随机一张图鉴并得到一张藏宝图？")) {
                return;
            }
            this.consecrate(index).then(() => {
                const message = OperationMessage.success();
                message.extensions.set("mode", "CONSECRATE");
                this.triggerRefresh(message).then();
            });
        });

        return true;
    }

    private async sacrifice(index: number) {
        if (this.isTownMode) {
            await new TownBank(this.credential, this.townId).withdraw(300);
            await new PersonalPetEvolution(this.credential).sacrifice(index);
            await new TownBank(this.credential, this.townId).deposit();
        } else if (this.isCastleMode) {
            await new CastleBank(this.credential).withdraw(300);
            await new PersonalPetEvolution(this.credential).sacrifice(index);
            await new CastleBank(this.credential).deposit();
        }
    }

    private async consecrate(index: number) {
        if (this.isTownMode) {
            await new TownBank(this.credential, this.townId).withdraw(1000);
            await new PersonalPetEvolution(this.credential).consecrate(index);
            await new TownBank(this.credential, this.townId).deposit();
        } else if (this.isCastleMode) {
            await new CastleBank(this.credential).withdraw(1000);
            await new PersonalPetEvolution(this.credential).consecrate(index);
            await new CastleBank(this.credential).deposit();
        }
    }
}

export = EvolutionManager;