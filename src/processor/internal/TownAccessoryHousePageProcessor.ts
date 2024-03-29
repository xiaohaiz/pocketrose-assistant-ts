import TownBank from "../../core/bank/TownBank";
import NpcLoader from "../../core/role/NpcLoader";
import TownAccessoryHouse from "../../core/store/TownAccessoryHouse";
import TownAccessoryHousePage from "../../core/store/TownAccessoryHousePage";
import TownAccessoryHousePageParser from "../../core/store/TownAccessoryHousePageParser";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import PocketUtils from "../../util/PocketUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownAccessoryHousePageProcessor extends PageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        const page = await new TownAccessoryHousePageParser().parse(PageUtils.currentPageHtml());
        this.#renderImmutablePage(credential, page);
        this.#renderMutablePage(credential, page);
        KeyboardShortcutBuilder.newInstance()
            .onEscapePressed(() => $("#returnButton").trigger("click"))
            .withDefaultPredicate()
            .bind();
    }

    #renderImmutablePage(credential: Credential, page: TownAccessoryHousePage) {
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
            .text("＜＜  " + page.town.nameTitle + " 饰 品 屋  ＞＞")
            .parent()
            .next()
            .find("table:first")
            .find("td:eq(1)")
            .find("table:first")
            .find("td:last")
            .attr("id", "roleCash");

        $("form").remove();

        $("#t1")
            .find("tr:first")
            .next()
            .next()
            .find("table:first")
            .find("td:first")
            .attr("id", "messageBoard")
            .css("color", "white")
            .next()
            .attr("id", "messageBoardManager");

        $("#t1")
            .find("tr:first")
            .next()
            .next()
            .next()
            .html("<td id='storeUI' style='width:100%;background-color:#F8F0E0'></td>");

        let html = "";
        html += "<table style='width:100%;border-width:0;background-color:#888888;margin:auto'>";
        html += "<tbody>";
        // ------------------------------------------------------------------------
        // 隐藏的表单
        // ------------------------------------------------------------------------
        html += "<tr style='display:none'>";
        html += "<td id='hidden_form_cell'>";
        html += PageUtils.generateReturnTownForm(credential);
        // noinspection HtmlUnknownTarget
        html += "<form action='mydata.cgi' method='post'>";
        html += "<input type='hidden' name='id' value='" + credential.id + "'>";
        html += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
        html += "<input type='hidden' name='town' value='" + page.town.id + "'>";
        html += "<input type='hidden' name='mode' value='USE_ITEM'>";
        html += "<input type='submit' id='equipmentManagement'>";
        html += "</form>";
        html += "</td>";
        html += "</tr>";
        // ------------------------------------------------------------------------
        // 主菜单
        // ------------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;text-align:center'>";
        html += "<input type='button' id='refreshButton' value='刷新" + page.town.name + "饰品屋'>&nbsp;";
        html += "<input type='button' id='returnButton' value='离开" + page.town.name + "饰品屋'>&nbsp;";
        html += "<input type='button' id='equipmentButton' value='转到装备管理'>";
        html += "</td>";
        // ------------------------------------------------------------------------
        // 个人物品栏
        // ------------------------------------------------------------------------
        html += "<tr style='display:none'>";
        html += "<td id='equipmentList' style='text-align:center'></td>";
        html += "</tr>";
        // ------------------------------------------------------------------------
        // 饰品屋商品栏
        // ------------------------------------------------------------------------
        html += "<tr style='display:none'>";
        html += "<td id='merchandiseList' style='text-align:center'></td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("#storeUI").html(html);

        this.#bindImmutableButtons(credential, page.town.id);
    }

    #bindImmutableButtons(credential: Credential, townId: string) {
        $("#refreshButton").on("click", () => {
            $("#messageBoardManager").html(NpcLoader.randomNpcImageHtml());
            MessageBoard.resetMessageBoard("欢迎、欢迎。");
            this.#refreshMutablePage(credential, townId);
        });
        $("#returnButton").on("click", () => {
            $("#returnTown").trigger("click");
        });
        $("#equipmentButton").on("click", () => {
            $("#equipmentManagement").trigger("click");
        });
    }

    #renderMutablePage(credential: Credential, page: TownAccessoryHousePage) {
        // ------------------------------------------------------------------------
        // 渲染随身装备
        // ------------------------------------------------------------------------
        const equipmentList = page.equipmentList!;
        if (equipmentList.length > 0) {
            let html = "";
            html += "<table style='border-width:0;background-color:#888888;margin:auto;width:100%'>";
            html += "<tbody style='background-color:#F8F0E0;text-align:center'>";
            html += "<tr>";
            html += "<td style='background-color:darkred;color:wheat;font-weight:bold' colspan='12'>";
            html += "＜ 随 身 装 备 ＞";
            html += "</td>";
            html += "</tr>";
            html += "<tr>";
            html += "<th style='background-color:#E8E8D0'>出售</th>";
            html += "<th style='background-color:#EFE0C0'>装备</th>";
            html += "<th style='background-color:#E0D0B0'>名字</th>";
            html += "<th style='background-color:#EFE0C0'>种类</th>";
            html += "<th style='background-color:#E0D0B0'>效果</th>";
            html += "<th style='background-color:#EFE0C0'>重量</th>";
            html += "<th style='background-color:#EFE0C0'>耐久</th>";
            html += "<th style='background-color:#E0D0B0'>价值</th>";
            html += "</tr>";

            for (const equipment of equipmentList) {
                html += "<tr>";
                html += "<td style='background-color:#E8E8D0'>";
                if (equipment.isSellable) {
                    html += "<input type='button' value='出售' " +
                        "id='sell_" + equipment.index! + "' class='mutableButton'>";
                } else {
                    html += PageUtils.generateInvisibleButton("#E8E8D0");
                }
                html += "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.usingHTML + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.nameHTML + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.category + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.power + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.weight + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.endureHtml + "</td>";
                html += "<td style='background-color:#E0D0B0;text-align:right'>" + equipment.priceHTML + "</td>";
                html += "</tr>";
            }

            html += "</tbody>";
            html += "</table>";

            $("#equipmentList")
                .html(html)
                .parent()
                .show();
        }

        // ------------------------------------------------------------------------
        // 渲染饰品店商品
        // ------------------------------------------------------------------------
        const merchandiseList = page.merchandiseList!;
        if (merchandiseList.length > 0) {
            let html = "";
            html += "<table style='border-width:0;background-color:#888888;margin:auto;width:100%'>";
            html += "<tbody style='background-color:#F8F0E0;text-align:center'>";
            html += "<tr>";
            html += "<td style='background-color:darkgreen;color:wheat;font-weight:bold' colspan='15'>";
            html += "＜ 商 品 列 表 ＞";
            html += "</td>";
            html += "</tr>";
            html += "<tr>";
            html += "<th style='background-color:#E8E8D0'>数量</th>";
            html += "<th style='background-color:#E8E8D0'>购买</th>";
            html += "<th style='background-color:#EFE0C0'>特产</th>";
            html += "<th style='background-color:#E0D0B0'>名字</th>";
            html += "<th style='background-color:#EFE0C0'>价格</th>";
            html += "<th style='background-color:#E0D0B0'>威力</th>";
            html += "<th style='background-color:#EFE0C0'>重量</th>";
            html += "<th style='background-color:#EFE0C0'>耐久</th>";
            html += "<th style='background-color:#E0D0B0'>职业</th>";
            html += "<th style='background-color:#E0D0B0'>攻击</th>";
            html += "<th style='background-color:#E0D0B0'>防御</th>";
            html += "<th style='background-color:#E0D0B0'>智力</th>";
            html += "<th style='background-color:#E0D0B0'>精神</th>";
            html += "<th style='background-color:#E0D0B0'>速度</th>";
            html += "<th style='background-color:#E0D0B0'>宝石</th>";
            html += "</tr>";

            for (const merchandise of merchandiseList) {
                html += "<tr>";
                html += "<td style='background-color:#E8E8D0'>";
                const spaceCount = 19 - page.equipmentList!.length;
                if (spaceCount > 0) {
                    html += "<select id='count_" + merchandise.index + "'>";
                    for (let i = 1; i <= spaceCount; i++) {
                        html += "<option value='" + i + "'>" + i + "</option>";
                    }
                    html += "</select>";
                }
                html += "</td>";
                html += "<td style='background-color:#E8E8D0'>";
                if (spaceCount > 0) {
                    html += "<input type='button' value='购买' " +
                        "id='buy_" + merchandise.index! + "' class='dynamic_button_class'>";
                }
                html += "</td>";
                html += "<td style='background-color:#EFE0C0'>" + merchandise.specialityHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + merchandise.nameHtml + "</td>";
                html += "<td style='background-color:#EFE0C0;text-align:right'>" + merchandise.priceHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + merchandise.power + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + merchandise.weight + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + merchandise.endureHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + merchandise.requiredCareerHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + merchandise.requiredAttackHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + merchandise.requiredDefenseHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + merchandise.requiredSpecialAttackHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + merchandise.requiredSpecialDefenseHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + merchandise.requiredSpeedHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + merchandise.gemCountHtml + "</td>";
                html += "</tr>";
            }

            html += "</tbody>";
            html += "</table>";

            $("#merchandiseList")
                .html(html)
                .parent()
                .show();
        }

        this.#bindMutableButtons(credential, page);
    }

    #bindMutableButtons(credential: Credential, page: TownAccessoryHousePage) {
        $("input:button[value='出售']").on("click", event => {
            const buttonId = $(event.target).attr("id") as string;
            const index = parseInt(buttonId.split("_")[1]);
            const equipment = page.findEquipment(index)!;
            if (!confirm("确认要出售“" + equipment.fullName + "”？")) {
                return;
            }
            new TownAccessoryHouse(credential, page.townId!)
                .sell(index, page.discount!)
                .then(() => {
                    new TownBank(credential, page.townId).deposit().then(() => {
                        this.#refreshMutablePage(credential, page.townId!);
                    });
                });
        });
        $("input:button[value='购买']").on("click", event => {
            const buttonId = $(event.target).attr("id") as string;
            const index = parseInt(buttonId.split("_")[1]);

            const count = parseInt($("#count_" + index).val() as string);
            const merchandise = page.findMerchandise(index)!;
            const totalPrice = merchandise.price! * count;
            const amount = PocketUtils.calculateCashDifferenceAmount(page.role!.cash!, totalPrice);
            if (!confirm("确认要购买" + count + "件“" + merchandise.name + "”？大约需要再支取" + amount + "万GOLD。")) {
                return;
            }

            const bank = new TownBank(credential, page.townId);
            bank.withdraw(amount)
                .then(() => {
                    new TownAccessoryHouse(credential, page.townId!)
                        .buy(index, count, page.discount!)
                        .then(() => {
                            bank.deposit()
                                .then(() => {
                                    this.#refreshMutablePage(credential, page.townId!);
                                });
                        });
                });
        });
    }

    #refreshMutablePage(credential: Credential, townId: string) {
        PageUtils.scrollIntoView("pageTitle");
        $("#equipmentList").parent().hide();
        $("#merchandiseList").parent().hide();
        $(".mutableButton").off("click");
        new TownAccessoryHouse(credential, townId).open().then(page => {
            $("#roleCash").text(page.role!.cash! + " GOLD");
            this.#renderMutablePage(credential, page);
        });
    }
}

export = TownAccessoryHousePageProcessor;