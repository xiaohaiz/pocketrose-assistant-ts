import _ from "lodash";
import SetupLoader from "../../core/config/SetupLoader";
import MonsterProfileLoader from "../../core/monster/MonsterProfileLoader";
import PetMap from "../../core/monster/PetMap";
import RolePetMapStorage from "../../core/monster/RolePetMapStorage";
import TownPetMapHouse from "../../core/monster/TownPetMapHouse";
import TownPetMapHousePage from "../../core/monster/TownPetMapHousePage";
import PersonalStatus from "../../core/role/PersonalStatus";
import TeamMember from "../../core/team/TeamMember";
import TeamMemberLoader from "../../core/team/TeamMemberLoader";
import TownLoader from "../../core/town/TownLoader";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import StatelessPageProcessorCredentialSupport from "../StatelessPageProcessorCredentialSupport";

class TownPetMapHousePageProcessor extends StatelessPageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        const page = TownPetMapHouse.parsePage(PageUtils.currentPageHtml());
        this.#renderImmutablePage(credential, page, context);
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("u", () => $("#openPetManagement").trigger("click"))
            .onEscapePressed(() => $("#returnButton").trigger("click"))
            .withDefaultPredicate()
            .bind();
    }

    #renderImmutablePage(credential: Credential, page: TownPetMapHousePage, context?: PageProcessorContext) {
        let html = $("body:first").html();
        html = html.replace("\n\n\n收集图鉴一览：\n", "");
        $("body:first").html(html);

        // 删除所有的表单
        $("form").remove();
        $("input:hidden").remove();

        $("td:first")
            .attr("id", "pageTitle")
            .removeAttr("width")
            .removeAttr("height")
            .removeAttr("bgcolor")
            .css("text-align", "center")
            .css("font-size", "180%")
            .css("font-weight", "bold")
            .css("background-color", "navy")
            .css("color", "yellowgreen")
            .text("＜＜  宠 物 图 鉴  ＞＞")
            .parent()
            .attr("id", "tr0")
            .next()
            .attr("id", "tr1")
            .find("td:first")
            .find("table:first")
            .find("tr:first")
            .find("td:first")
            .attr("id", "messageBoard")
            .css("color", "white")
            .next()
            .attr("id", "messageBoardManager");

        $("#tr1")
            .next()
            .attr("id", "tr2")
            .css("display", "none")
            .html("<td id='returnFormContainer'></td>");
        $("#returnFormContainer").html(PageUtils.generateReturnTownForm(credential)
            + PageUtils.generatePetManagementForm(credential));

        $("#tr2")
            .after("<tr id='tr3'><td id='pageMenuContainer' style='text-align:center'></td></tr>");
        let returnTitle = "返回城市(Esc)";
        const townId = context?.get("townId");
        if (townId !== undefined) {
            const town = TownLoader.load(townId);
            returnTitle = "返回" + town?.name + "(Esc)";
        }
        html = "";
        html += "<input type='text' id='petCode' size='10' maxlength='10'>";
        html += "<button role='button' id='searchButton'>查找图鉴</button>";
        html += "<button role='button' id='returnButton'>" + returnTitle + "</button>";
        $("#pageMenuContainer").html(html);

        if (SetupLoader.isEnhancedPetMapEnabled()) {
            let mh = "";
            mh += "<table style='background-color:#888888;text-align:center;margin:auto'>";
            mh += "<tbody>";

            const mm = new Map<string, PetMap>();
            page.petMapList!.forEach(it => {
                mm.set(it.code!, it);
            });

            let row = 0;
            while (true) {
                const currentRowPetMaps: PetMap[] = [];
                let notFound = false;
                for (let i = 0; i < 10; i++) {
                    const index = i + row * 10;
                    if (index >= 493) {
                        notFound = true;
                        const placeHolder = new PetMap();
                        currentRowPetMaps.push(placeHolder);
                    } else {
                        const m = MonsterProfileLoader.load(index + 1)!;
                        const pm = mm.get(m.code!);
                        if (pm) {
                            currentRowPetMaps.push(pm);
                        } else {
                            const placeHolder = new PetMap();
                            placeHolder.code = m.code;
                            currentRowPetMaps.push(placeHolder);
                        }
                    }
                }

                mh += "<tr>";
                for (const pm of currentRowPetMaps) {
                    if (pm.count !== undefined) {
                        const monster = MonsterProfileLoader.load(pm.code)!;
                        mh += "<td style='background-color:#E8E8D0;width:64px;height:64px'>" + monster.imageHtml + "</td>"
                    } else {
                        mh += "<td style='background-color:#E8E8D0;width:64px;height:64px'></td>"
                    }
                }
                mh += "</tr>";
                mh += "<tr>";
                for (const pm of currentRowPetMaps) {
                    if (pm.count !== undefined) {
                        const monster = MonsterProfileLoader.load(pm.code)!;
                        if (monster.location === 1) {
                            mh += "<td style='background-color:wheat;width:64px;color:green'>" + pm.code + " / " + pm.count + "</td>"
                        } else if (monster.location === 2) {
                            mh += "<td style='background-color:wheat;width:64px;color:blue'>" + pm.code + " / " + pm.count + "</td>"
                        } else if (monster.location === 3) {
                            mh += "<td style='background-color:wheat;width:64px;color:red'>" + pm.code + " / " + pm.count + "</td>"
                        } else {
                            mh += "<td style='background-color:wheat;width:64px'>" + pm.code + " / " + pm.count + "</td>"
                        }
                    } else {
                        if (pm.code !== undefined) {
                            const monster = MonsterProfileLoader.load(pm.code)!;
                            if (monster.location === 1) {
                                mh += "<td style='background-color:wheat;width:64px;color:green'>" + pm.code + "</td>"
                            } else if (monster.location === 2) {
                                mh += "<td style='background-color:wheat;width:64px;color:blue'>" + pm.code + "</td>"
                            } else if (monster.location === 3) {
                                mh += "<td style='background-color:wheat;width:64px;color:red'>" + pm.code + "</td>"
                            } else {
                                mh += "<td style='background-color:wheat;width:64px'>" + pm.code + "</td>"
                            }
                        } else {
                            mh += "<td style='background-color:wheat;width:64px'></td>"
                        }
                    }
                }
                mh += "</tr>";

                if (notFound) {
                    break;
                }
                row++;
            }
            mh += "</tbody>";
            mh += "</table>";

            $("#tr3")
                .parent()
                .parent()
                .next()
                .find("> tbody:first")
                .attr("id", "petMapTableBody")
                .html("<tr><td>" + mh + "</td></tr>");
        }

        this.#bindSearchButton(credential);
        $("#returnButton").on("click", () => {
            $("#returnTown").trigger("click");
        });

        if (!SetupLoader.isEnhancedPetMapEnabled()) {
            const petMapText = page.asText();
            if (petMapText !== "") {
                let html = $("#messageBoard").html();
                html += "<br>" + petMapText;
                $("#messageBoard").html(html);
            }
        } else {
            let html = $("#messageBoard").html();
            html += "<br>宠物编号<span style='background-color:wheat;color:green'>绿色</span>初森，" +
                "<span style='background-color:wheat;color:blue'>蓝色</span>中塔，" +
                "<span style='background-color:wheat;color:red'>红色</span>上洞。";
            $("#messageBoard").html(html);
        }

        $("table:eq(2)")
            .attr("id", "t1")
            .css("width", "100%");
    }

    #bindSearchButton(credential: Credential) {
        $("#searchButton").on("click", () => {
            const petCode = $("#petCode").val();
            if (petCode === undefined || (petCode as string).trim() === "") {
                MessageBoard.publishWarning("请输入正确的宠物图鉴编号！");
                PageUtils.scrollIntoView("pageTitle");
                return;
            }

            const configList: TeamMember[] = TeamMemberLoader.loadTeamMembers();

            let foundSelf = false;
            for (const config of configList) {
                if (config.id === credential.id) {
                    foundSelf = true;
                    break;
                }
            }

            if (foundSelf) {
                this.#searchPetMap((petCode as string).trim(), configList);
            } else {
                new PersonalStatus(credential).load().then(role => {
                    const config = new TeamMember();
                    config.name = role.name;
                    config.id = credential.id;
                    configList.push(config);
                    this.#searchPetMap((petCode as string).trim(), configList);
                });
            }
        });
    }

    #searchPetMap(petCode: string, configList: TeamMember[]) {

        const roleIdList: string[] = [];
        configList.forEach(it => {
            const roleId = it.id!;
            roleIdList.push(roleId);
        });

        RolePetMapStorage.getInstance()
            .loads(roleIdList)
            .then(dataMap => {
                const foundList: string[] = [];
                for (const config of configList) {
                    const data = dataMap.get(config.id!);
                    if (data === undefined) {
                        continue;
                    }
                    const pmList = JSON.parse(data.json!);
                    for (const it of pmList) {
                        if (it.code === petCode) {
                            const count = _.parseInt(it.count);
                            foundList.push(config.name + "/" + petCode + "/" + count);
                            break;
                        }
                    }
                }

                if (foundList.length === 0) {
                    MessageBoard.publishWarning("没有找到图鉴" + petCode + "的信息！");
                    PageUtils.scrollIntoView("pageTitle");
                    $("#t1").find("tbody:first").html("");
                    return;
                }

                const petMap = new PetMap();
                petMap.code = petCode;
                petMap.picture = petCode + ".png";
                let html = "";
                html += "<tr>";
                html += "<td>";
                html += petMap.imageHtml;
                html += "</td>";
                html += "<td style='width:100%;text-align:center'>";
                html += "<table style='margin:auto;border-width:0;text-align:center;background-color:#888888'>";
                html += "<tbody>";
                html += "<tr>";
                html += "<th style='background-color:#F8F0E0'>持有人</th>"
                html += "<th style='background-color:#F8F0E0'>数量</th>"
                html += "</tr>";
                for (const found of foundList) {
                    const ss = found.split("/");
                    html += "<tr>";
                    html += "<td style='background-color:#E8E8D0'>" + ss[0] + "</td>";
                    html += "<td style='background-color:#E8E8B0'>" + ss[2] + "</td>";
                    html += "</tr>";
                }
                html += "</tbody>";
                html += "</table>";
                html += "</td>";
                html += "</tr>";
                $("#t1").find("tbody:first").html(html);
            });

    }

}

export = TownPetMapHousePageProcessor;