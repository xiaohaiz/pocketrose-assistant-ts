import Equipment from "../../common/Equipment";
import NpcLoader from "../../core/NpcLoader";
import Town from "../../core/Town";
import TownLoader from "../../core/TownLoader";
import DeprecatedPersonalEquipmentManagement from "../../pocket/DeprecatedPersonalEquipmentManagement";
import PersonalEquipmentManagement from "../../pocketrose/PersonalEquipmentManagement";
import TownBank from "../../pocketrose/TownBank";
import TownGemHouse from "../../pocketrose/TownGemHouse";
import TownGemHousePage from "../../pocketrose/TownGemHousePage";
import TownGemMeltHouse from "../../pocketrose/TownGemMeltHouse";
import BankUtils from "../../util/BankUtils";
import CommentBoard from "../../util/CommentBoard";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownGemHousePageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const townId = context!.get("townId")!;
        const town = TownLoader.getTownById(townId)!;
        new TownGemHouse(credential, town.id).parsePage(PageUtils.currentPageHtml())
            .then(page => {
                this.#renderImmutablePage(credential, town);
                this.#renderMutablePage(credential, page, town);
            });
    }

    #renderImmutablePage(credential: Credential, town: Town) {
        $("table:eq(1)")
            .attr("id", "t1")
            .find("td:first")
            .attr("id", "pageTitle")
            .removeAttr("width")
            .removeAttr("height")
            .removeAttr("bgcolor")
            .css("text-align", "center")
            .css("font-size", "150%")
            .css("font-weight", "bold")
            .css("background-color", "navy")
            .css("color", "yellowgreen")
            .text("＜＜  " + town.nameTitle + " 宝 石 屋  ＞＞")
            .parent()
            .next()
            .find("table:first")
            .find("td:eq(1)")
            .find("table:first")
            .find("td:first")
            .find("table:first")
            .find("td:last")
            .attr("id", "roleCash");

        $("#t1")
            .find("tr:first")
            .next()
            .next()
            .find("table:first")
            .find("td:first")
            .attr("id", "messageBoard")
            .removeAttr("width")
            .removeAttr("bgcolor")
            .css("width", "100%")
            .css("background-color", "black")
            .css("color", "white")
            .html(WELCOME_MESSAGE)
            .next()
            .attr("id", "messageBoardManager");

        // 清空原来的页面内容，准备重新绘制
        $("#t1")
            .find("tr:first")
            .next()
            .next()
            .next()
            .html("<td id='gem_house_UI' style='width:100%;text-align:center'></td>")
            .next()
            .remove();

        // 绘制新的内容
        let html = "";
        html += "<table style='width:100%;border-width:0;background-color:#888888;margin:auto'>";
        html += "<tbody>";
        // ------------------------------------------------------------------------
        // 隐藏的表单
        // ------------------------------------------------------------------------
        html += "<tr style='display:none'>";
        html += "<td id='hidden_form_cell'>";
        html += PageUtils.generateReturnTownForm(credential);
        html += "</td>";
        html += "</tr>";
        // ------------------------------------------------------------------------
        // 记录最后一次合成装备的信息
        // 不能用下标来记录，因为宝石的消耗可能造成下标的变化
        // 因此需要记录的是装备的全名及其在物品栏出现的序号。
        // ------------------------------------------------------------------------
        html += "<tr style='display:none'>";
        html += "<td id='last_fuse_cell'>none</td>";
        html += "</tr>";
        // ------------------------------------------------------------------------
        // 主菜单
        // ------------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;text-align:center'>";
        html += "<input type='button' id='refresh_button' value='刷新" + town.name + "宝石屋'>";
        html += "<input type='button' id='return_button' value='离开" + town.name + "宝石屋'>";
        html += "</td>";
        // ------------------------------------------------------------------------
        // 个人物品栏
        // ------------------------------------------------------------------------
        html += "<tr style='display:none'>";
        html += "<td id='equipment_list_cell' style='background-color:#F8F0E0;text-align:center'></td>";
        html += "</tr>";
        // ------------------------------------------------------------------------
        // 宝石栏
        // ------------------------------------------------------------------------
        html += "<tr style='display:none'>";
        html += "<td id='gem_list_cell' style='background-color:#F8F0E0;text-align:center'></td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("#gem_house_UI").html(html);

        CommentBoard.createCommentBoard(NpcLoader.getNpcImageHtml("末末")!);
        CommentBoard.writeMessage("<b style='font-size:120%;color:navy'>砸石头这种事儿，确实是有手就行。</b>");
        CommentBoard.writeMessage("<p id='fuseAllContainer' style='display:none'>" +
            "<input type='button' id='fuseAll_1' value='砸完所有威力' class='dynamic_button_class all_gem_class' disabled>" +
            "<input type='button' id='fuseAll_2' value='砸完所有重量' class='dynamic_button_class all_gem_class' disabled>" +
            "<input type='button' id='fuseAll_3' value='砸完所有幸运' class='dynamic_button_class all_gem_class' disabled>" +
            "</p>");

        this.#bindImmutableButtons(credential, town);
    }

    #bindImmutableButtons(credential: Credential, town: Town) {
        $("#return_button").on("click", () => {
            $("#returnTown").trigger("click");
        });
        $("#refresh_button").on("click", () => {
            PageUtils.scrollIntoView("pageTitle");
            $("#messageBoardManager").html(NpcLoader.randomNpcImageHtml());
            MessageBoard.resetMessageBoard("钻石恒久远，一颗永流传。");
            $("#last_fuse_cell").text("none");
            this.#refreshMutablePage(credential, town);
        });
        $("#p_8173").on("dblclick", () => {
            $("#fuseAllContainer").toggle();
        });
    }

    #renderMutablePage(credential: Credential, page: TownGemHousePage, town: Town) {
        if (page.equipmentList!.length > 0) {
            let html = "";
            html += "<table style='border-width:0;background-color:#888888;margin:auto'>";
            html += "<tbody style='background-color:#F8F0E0;text-align:center'>";
            html += "<tr>";
            html += "<td style='background-color:darkred;color:wheat;font-weight:bold' colspan='9'>";
            html += "＜ 随 身 装 备 ＞";
            html += "</td>";
            html += "<tr>";
            html += "<th style='background-color:#E8E8D0'>选择</th>";
            html += "<th style='background-color:#EFE0C0'>装备</th>";
            html += "<th style='background-color:#E0D0B0'>名字</th>";
            html += "<th style='background-color:#EFE0C0'>种类</th>";
            html += "<th style='background-color:#E0D0B0'>威力</th>";
            html += "<th style='background-color:#EFE0C0'>重量</th>";
            html += "<th style='background-color:#EFE0C0'>耐久</th>";
            html += "<th style='background-color:#E0D0B0'>宝石</th>";
            html += "<th style='background-color:#E0D0B0'>销毁</th>";
            html += "</tr>";

            for (const equipment of page.equipmentList!) {
                const canFuse = equipment.selectable! && (!equipment.using! || (equipment.using! && equipment.name === "宠物蛋"));
                const canMelt = !equipment.using! && page.townGemMeltHousePage!.canMelt(equipment.index!);
                if (!canFuse && !canMelt) {
                    continue;
                }

                html += "<tr>";
                html += "<td style='background-color:#E8E8D0'>";
                if (canFuse) {
                    html += "<input type='button' value='选择' " +
                        "class='dynamic_button_class' " +
                        "id='select_" + equipment.index + "' " +
                        "style='color:grey'>";
                }
                html += "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.usingHTML + "</td>";
                html += "<td style='background-color:#E0D0B0' id='name_" + equipment.index + "' class='equipment_detail_class'>" + equipment.nameHTML + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.category + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.power + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.weight + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.endureHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.gemCountHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>";
                if (canMelt) {
                    html += "<input type='button' value='销毁' " +
                        "class='dynamic_button_class' " +
                        "id='melt_" + equipment.index + "' " +
                        "style='color:red'>";
                }
                html += "</td>";
                html += "</tr>";
            }

            html += "</tr>";
            html += "<tr>";
            html += "<td id='equipment_detail' style='background-color:navy;color:greenyellow;font-weight:bold' colspan='9'>　</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";

            $("#equipment_list_cell")
                .html(html)
                .parent()
                .show();

            const lastFuse = $("#last_fuse_cell").text();
            if (lastFuse !== "none" && lastFuse.includes("/")) {
                const equipmentName = StringUtils.substringBefore(lastFuse, "/");
                const equipmentSequence = parseInt(StringUtils.substringAfter(lastFuse, "/"));

                // 查找装备
                let equipmentIndex = -1;
                let sequence = 0;
                for (const equipment of page.equipmentList!) {
                    if (equipment.fullName === equipmentName) {
                        sequence++;
                        if (sequence === equipmentSequence) {
                            equipmentIndex = equipment.index!;
                            break;
                        }
                    }
                }
                if (equipmentIndex >= 0) {
                    // 找到对应的装备，修改对应按钮的状态
                    const buttonId = "select_" + equipmentIndex;
                    if ($("#" + buttonId).length > 0) {
                        $("#" + buttonId).css("color", "blue");
                    }
                }
            }
        }

        if (page.gemList!.length > 0) {
            let powerGemFound = false;
            let weightGemFound = false;
            let luckGemFound = false;

            let html = "";
            html += "<table style='border-width:0;background-color:#888888;margin:auto'>";
            html += "<tbody style='background-color:#F8F0E0;text-align:center'>";
            html += "<tr>";
            html += "<td style='background-color:darkgreen;color:wheat;font-weight:bold' colspan='2'>";
            html += "＜ 可 用 宝 石 ＞";
            html += "</td>";
            html += "</tr>";
            html += "<tr>";
            html += "<th style='background-color:#E8E8D0'>宝石</th>";
            html += "<th style='background-color:#EFE0C0'>镶嵌</th>";
            html += "</tr>";

            for (const gem of page.gemList!) {
                if (gem.name === "威力宝石") {
                    powerGemFound = true;
                }
                if (gem.name === "重量宝石") {
                    weightGemFound = true;
                }
                if (gem.name === "幸运宝石") {
                    luckGemFound = true;
                }
                html += "<tr>";
                html += "<td style='background-color:#E8E8D0'>" + gem.nameHTML + "</td>";
                html += "<td style='background-color:#EFE0C0'>";
                html += "<input type='button' value='镶嵌' " +
                    "class='dynamic_button_class' " +
                    "id='fuse_" + gem.index + "'>";
                html += "</td>";
                html += "</tr>";
            }

            html += "</tbody>";
            html += "</table>";

            $("#gem_list_cell")
                .html(html)
                .parent()
                .show();

            if (powerGemFound) {
                $("#fuseAll_1").prop("disabled", false);
            }
            if (weightGemFound) {
                $("#fuseAll_2").prop("disabled", false);
            }
            if (luckGemFound) {
                $("#fuseAll_3").prop("disabled", false);
            }
        }

        this.#bindMutableButtons(credential, page, town);
    }

    #bindMutableButtons(credential: Credential, page: TownGemHousePage, town: Town) {
        $(".equipment_detail_class")
            .on("mouseenter", function () {
                const index = parseInt(($(this).attr("id") as string).split("_")[1]);
                new PersonalEquipmentManagement(credential).open().then(page => {
                    const equipment = page.findEquipment(index);
                    if (equipment !== null) {
                        let s = "";
                        s += equipment.fullName;
                        s += " ";
                        s += "附加威力:" + equipment.additionalPower;
                        s += " ";
                        s += "附加重量:" + equipment.additionalWeight;
                        s += " ";
                        s += "附加幸运:" + equipment.additionalLuck;
                        $("#equipment_detail").text(s);
                    }
                });
            })
            .on("mouseleave", function () {
                $("#equipment_detail").text("　");
            });
        $("input:button[value='选择']").on("click", event => {
            const buttonId = $(event.target).attr("id") as string;
            if (PageUtils.isColorBlue(buttonId)) {
                // 当前按钮是蓝色，是已经选中状态。将其变为灰色即可
                $("#" + buttonId).css("color", "grey");
            } else if (PageUtils.isColorGrey(buttonId)) {
                // 当前按钮是灰色，将其变成选中状态，并且取消其他所有的按钮
                $("#" + buttonId).css("color", "blue");
                $("input:button[value='选择']")
                    .each((_idx, button) => {
                        const otherButtonId = $(button).attr("id") as string;
                        if (otherButtonId !== buttonId) {
                            $("#" + otherButtonId).css("color", "grey");
                        }
                    });
            }
        });
        $("input:button[value='销毁']").on("click", event => {
            const buttonId = $(event.target).attr("id") as string;
            const index = parseInt(buttonId.split("_")[1]);
            const equipment = page.findEquipment(index);
            if (!confirm("确认销毁“" + equipment?.nameHTML + "”的宝石？")) {
                PageUtils.scrollIntoView("pageTitle");
                return;
            }
            const amount = BankUtils.calculateCashDifferenceAmount(page.role!.cash!, 5000000);
            const bank = new TownBank(credential, town.id);
            bank.withdraw(amount).then(() => {
                new TownGemMeltHouse(credential, town.id).melt(index).then(() => {
                    bank.deposit().then(() => {
                        this.#refreshMutablePage(credential, town);
                    });
                });
            });
        });
        $("input:button[value='镶嵌']").on("click", event => {
            const buttonId = $(event.target).attr("id") as string;
            const index = parseInt(buttonId.split("_")[1]);

            let checkedIndex: number | undefined = undefined;
            $("input:button[value='选择']")
                .filter(function () {
                    const buttonId = $(this).attr("id") as string;
                    return PageUtils.isColorBlue(buttonId);
                })
                .each(function (_idx, button) {
                    if (checkedIndex === undefined) {
                        const buttonId = $(button).attr("id") as string;
                        checkedIndex = parseInt(StringUtils.substringAfter(buttonId, "_"));
                    }
                });
            if (checkedIndex === undefined) {
                PageUtils.scrollIntoView("pageTitle");
                MessageBoard.publishWarning("没有选择要镶嵌的装备！");
                return;
            }
            const equipment = page.findEquipment(checkedIndex);
            const gem = page.findGem(index);
            if (!confirm("确认为“" + equipment?.nameHTML + "”镶嵌“" + gem?.name + "”？")) {
                PageUtils.scrollIntoView("pageTitle");
                return;
            }
            // 找这件装备的序号是多少
            let lastFuse = "none";
            let sequence = 0;
            for (const it of page.equipmentList!) {
                if (it.fullName === equipment!.fullName) {
                    sequence++;
                }
                if (it.index! === equipment!.index!) {
                    lastFuse = equipment!.fullName + "/" + sequence;
                    break;
                }
            }

            new TownGemHouse(credential, town.id).fuse(checkedIndex, index).then(() => {
                // 合成装备之后，设置最后一次合成的信息
                $("#last_fuse_cell").text(lastFuse);
                this.#refreshMutablePage(credential, town);
            });
        });
        $(".all_gem_class").on("click", event => {
            PageUtils.scrollIntoView("pageTitle");
            const buttonId = $(event.target).attr("id") as string;
            const gemCode = parseInt(buttonId.split("_")[1]);
            let gemName = "";
            if (gemCode === 1) {
                gemName = "威力宝石";
            } else if (gemCode === 2) {
                gemName = "重量宝石";
            } else if (gemCode === 3) {
                gemName = "幸运宝石";
            }

            let checkedIndex: number | undefined = undefined;
            $("input:button[value='选择']")
                .filter(function () {
                    const buttonId = $(this).attr("id") as string;
                    return PageUtils.isColorBlue(buttonId);
                })
                .each(function (_idx, button) {
                    if (checkedIndex === undefined) {
                        const buttonId = $(button).attr("id") as string;
                        checkedIndex = parseInt(StringUtils.substringAfter(buttonId, "_"));
                    }
                });
            if (checkedIndex === undefined) {
                MessageBoard.publishWarning("没有选择要镶嵌的装备！");
                return;
            }
            const equipment = page.findEquipment(checkedIndex);
            if (!confirm("确认为“" + equipment?.nameHTML + "”尽可能镶嵌所有的“" + gemName + "”？")) {
                return;
            }

            // 找这件装备的序号是多少
            let lastFuse = "none";
            let sequence = 0;
            for (const it of page.equipmentList!) {
                if (it.fullName === equipment!.fullName) {
                    sequence++;
                }
                if (it.index! === equipment!.index!) {
                    lastFuse = equipment!.fullName + "/" + sequence;
                    break;
                }
            }
            this.#_fuseAllGems(credential, page, town, lastFuse, gemCode);
        });
    }

    #refreshMutablePage(credential: Credential, town: Town) {
        $("#equipment_list_cell").html("").parent().hide();
        $("#gem_list_cell").html("").parent().hide();
        $(".dynamic_button_class").off("click");
        $(".equipment_detail_class").off("mouseenter").off("mouseleave");
        $(".all_gem_class").prop("disabled", true);
        new TownGemHouse(credential, town.id).open().then(page => {
            const cash = page.role!.cash!;
            $("#roleCash").html(cash + " GOLD");
            this.#renderMutablePage(credential, page, town);
        });
    }

    #_fuseAllGems(credential: Credential, page: TownGemHousePage, town: Town, target: string, gemCode: number) {
        // 找待砸石头的装备
        const equipmentName = StringUtils.substringBefore(target, "/");
        const equipmentSequence = parseInt(StringUtils.substringAfter(target, "/"));

        // 查找装备
        let equipmentIndex = -1;
        let sequence = 0;
        for (const equipment of page.equipmentList!) {
            if (equipment.fullName === equipmentName) {
                sequence++;
                if (sequence === equipmentSequence) {
                    equipmentIndex = equipment.index!;
                    break;
                }
            }
        }
        if (equipmentIndex < 0) {
            // Not found? Should not reach here.
            this.#refreshMutablePage(credential, town);
            return;
        }
        const equipment = page.findEquipment(equipmentIndex)!;
        const canFuse = equipment.selectable! && (!equipment.using! || (equipment.using! && equipment.name === "宠物蛋"));
        if (!canFuse) {
            // 已经不能再继续镶嵌了，返回
            MessageBoard.publishMessage("所选装备已经没有剩余孔位，结束。");
            this.#refreshMutablePage(credential, town);
            return;
        }

        let gem: Equipment | undefined = undefined;
        for (const it of page.gemList!) {
            if (gemCode === 1 && it.name === "威力宝石") {
                gem = it;
                break;
            }
            if (gemCode === 2 && it.name === "重量宝石") {
                gem = it;
                break;
            }
            if (gemCode === 3 && it.name === "幸运宝石") {
                gem = it;
                break;
            }
        }
        if (gem === undefined) {
            // 已经没有剩余的宝石，返回
            MessageBoard.publishMessage("已经没有剩余的宝石，结束。");
            this.#refreshMutablePage(credential, town);
            return;
        }

        if (gemCode === 1) {
            new DeprecatedPersonalEquipmentManagement(credential).open().then(p => {
                const e = p.findEquipment(equipmentIndex);
                if (e !== null && e.additionalPower! < 0) {
                    MessageBoard.publishMessage("当前装备镶嵌威力宝石时出现负数，中断转手工处理。");
                    this.#refreshMutablePage(credential, town);
                } else {
                    const house = new TownGemHouse(credential, town.id);
                    house.fuse(equipmentIndex, gem!.index!).then(() => {
                        house.open().then(page => {
                            this.#_fuseAllGems(credential, page, town, target, gemCode);
                        });
                    });
                }
            });
        } else {
            const house = new TownGemHouse(credential, town.id);
            house.fuse(equipmentIndex, gem!.index!).then(() => {
                house.open().then(page => {
                    this.#_fuseAllGems(credential, page, town, target, gemCode);
                });
            });
        }
    }
}

const WELCOME_MESSAGE: string = "<b style='color:yellow'>宝石屋改造的一些说明：</b><br>" +
    "正在使用中的装备除了宠物蛋之外不允许镶嵌；<br>" +
    "鼠标停留在装备名字上可以显示当前装备的宝石附加状态。<br>" +
    "（鼠标停留功能请慎用，会对服务器发出额外的请求）";

export = TownGemHousePageProcessor;