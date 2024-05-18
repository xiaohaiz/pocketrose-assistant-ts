import _ from "lodash";
import RandomUtils from "../util/RandomUtils";
import Credential from "../util/Credential";
import TownPetMapHousePage from "../core/monster/TownPetMapHousePage";
import TownPetMapHouse from "../core/monster/TownPetMapHouse";
import {CommonWidget, CommonWidgetFeature} from "./support/CommonWidget";
import LocationModeTown from "../core/location/LocationModeTown";
import RolePetMapStorage from "../core/monster/RolePetMapStorage";
import PocketPageRenderer from "../util/PocketPageRenderer";
import TeamMemberLoader from "../core/team/TeamMemberLoader";
import {PersonalStatus} from "../core/role/PersonalStatus";
import TeamMember from "../core/team/TeamMember";
import MonsterProfileLoader from "../core/monster/MonsterProfileLoader";
import LocalSettingManager from "../setup/LocalSettingManager";
import PageUtils from "../util/PageUtils";
import * as echarts from "echarts";
import {EChartsOption} from "echarts";

class PetMapFinder extends CommonWidget {

    private readonly BTN_EXTERNAL = "BTN_" + RandomUtils.nextObjectID();
    private readonly BTN_SEARCH = "BTN_" + RandomUtils.nextObjectID();
    private readonly TXT_PET_CODE = "TXT_" + RandomUtils.nextObjectID();
    private readonly ID_CHART = "ID_" + RandomUtils.nextObjectID();
    private readonly ID_SEARCH_RESULT = "ID_" + RandomUtils.nextObjectID();

    private readonly storage = RolePetMapStorage.getInstance();

    readonly feature = new PetMapFinderFeature();

    constructor(credential: Credential, locationMode: LocationModeTown) {
        super(credential, locationMode);
    }

    petMapPage?: TownPetMapHousePage;
    private chart?: any;

    async initialize(petMapPage: TownPetMapHousePage) {
        this.petMapPage = petMapPage;
        await this.persistPetMap();
    }

    generateHTML(): string {
        const btnColor: string = LocalSettingManager.isIncludeExternal() ? "blue" : "grey";
        return "" +
            "<table style='background-color:#888888;margin:auto;width:100%;border-width:0'>" +
            "<thead style='text-align:center'>" +
            "<tr style='background-color:skyblue'>" +
            "<th>宠 物 图 鉴</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody style='text-align:center'>" +
            "<tr style='background-color:wheat'>" +
            "<td>" +
            "<input type='text' size='10' maxlength='10' spellcheck='false' id='" + this.TXT_PET_CODE + "' style='text-align:center'>" +
            PocketPageRenderer.AND() +
            "<button role='button' id='" + this.BTN_EXTERNAL + "' style='color:" + btnColor + "'>编外</button>" +
            PocketPageRenderer.GO() +
            "<button role='button' id='" + this.BTN_SEARCH + "'>查找宠物图鉴</button>" +
            "</td>" +
            "</tr>" +
            "<tr style='display:none'>" +
            "<td style='background-color:#888888;border-spacing:0' id='" + this.ID_SEARCH_RESULT + "'></td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "";
    }

    bindButtons() {
        $("#" + this.BTN_EXTERNAL)
            .off("click")
            .on("click", () => {
                PageUtils.toggleColor(
                    this.BTN_EXTERNAL,
                    () => {
                        LocalSettingManager.setIncludeExternal(true);
                    },
                    () => {
                        LocalSettingManager.setIncludeExternal(false);
                    });
            });
        $("#" + this.BTN_SEARCH)
            .off("click")
            .on("click", () => {
                const petCode = _.trim($("#" + this.TXT_PET_CODE).val() as string);
                if (petCode === "") {
                    this.feature.publishWarning("没有输入要查询图鉴的宠物编号，忽略！");
                    return;
                }
                const monster = MonsterProfileLoader.load(petCode);
                if (monster === null) {
                    this.feature.publishWarning("宠物编号[" + petCode + "]不能识别，忽略！");
                    return;
                }
                this.disposeSearchResult();
                this.searchPetMap(monster.code!).then();
            });
    }

    async reload() {
        this.petMapPage = await new TownPetMapHouse(this.credential, this.townId).open();
        await this.persistPetMap();
    }

    disposeSearchResult() {
        this.chart?.dispose();
        this.chart = undefined;
        $("#" + this.ID_SEARCH_RESULT).html("").parent().hide();
    }

    private async persistPetMap() {
        if (!this.petMapPage) return;
        await this.storage.write(this.credential.id, this.petMapPage.asJson());
    }

    private async searchPetMap(petCode: string) {
        const includeExternal = LocalSettingManager.isIncludeExternal();
        const members = TeamMemberLoader.loadTeamMembersAsMap(includeExternal);
        if (!members.has(this.credential.id)) {
            const role = await new PersonalStatus(this.credential).load();
            const member = new TeamMember();
            member.id = this.credential.id;
            member.name = role.name;
            members.set(this.credential.id, member);
        }

        const roleIds: string[] = [];
        members.forEach(it => roleIds.push(it.id!));
        const datum = await this.storage.loads(roleIds);

        const counts = new Map<string, number>();
        for (const id of members.keys()) {
            const data = datum.get(id);
            if (data === undefined) continue;
            const docList = JSON.parse(data.json!);
            for (const doc of docList) {
                if (doc.code === petCode) {
                    const count = _.parseInt(doc.count);
                    counts.set(id, count);
                }
            }
        }
        this.renderSearchResult(petCode, members, counts);
    }

    private renderSearchResult(petCode: string,
                               members: Map<string, TeamMember>,
                               counts: Map<string, number>) {
        const roleIds: string[] = [];
        members.forEach(it => roleIds.push(it.id!));
        const size = roleIds.length;

        let html = "";
        html += "<table style='background-color:transparent;margin:auto;width:100%;border-width:0'>";
        html += "<thead style='text-align:center'>";
        html += "<tr style='background-color:wheat'>";
        html += "<th style='white-space:nowrap'>图鉴</th>";
        html += "<th style='white-space:nowrap'>队员</th>";
        html += "<th style='white-space:nowrap'>数量</th>";
        html += "<th style='white-space:nowrap'>分布</th>";
        html += "</tr>";
        html += "</thead>";
        html += "<tbody style='text-align:center'>";
        html += "<tr style='background-color:#E8E8D0'>";
        html += "<td style='width:64px;vertical-align:center;white-space:nowrap' rowspan='" + size + "'>";
        html += MonsterProfileLoader.load(petCode)!.imageHtml + "<br>" + petCode;
        html += "</td>";
        html += "<td style='background-color:black;color:white;white-space:nowrap'>";
        html += members.get(roleIds[0])!.name;
        html += "</td>";
        html += "<th style='white-space:nowrap'>";
        const c0 = counts.get(roleIds[0]);
        html += (c0 === undefined) ? "-" : ("<span style='color:blue'>" + c0 + "</span>");
        html += "</th>";
        html += "<td rowspan='" + size + "' style='width:100%;text-align:center;vertical-align:center' id='" + this.ID_CHART + "'></td>";
        html += "</tr>";

        for (let i = 1; i < roleIds.length; i++) {
            const id = roleIds[i];
            html += "<tr style='background-color:#E8E8D0'>";
            html += "<td style='background-color:black;color:white;white-space:nowrap'>";
            html += members.get(id)!.name;
            html += "</td>";
            html += "<th style='white-space:nowrap'>";
            const c0 = counts.get(id);
            html += (c0 === undefined) ? "-" : ("<span style='color:blue'>" + c0 + "</span>");
            html += "</th>";
            html += "</tr>";
        }
        html += "</tbody>";
        html += "</table>";

        $("#" + this.ID_SEARCH_RESULT).html(html).parent().show();

        let totalCount = 0;
        counts.forEach(it => totalCount += it);
        if (totalCount === 0) {
            $("#" + this.ID_CHART).html(() => {
                return "<span style='font-size:200%;color:red;font-weight:bold'>没有图鉴！</span>";
            });
        } else {
            const pieData: {}[] = [];
            for (const roleId of roleIds) {
                const name = members.get(roleId)!.name!;
                const c = counts.get(roleId);
                const value = (c === undefined) ? 0 : c;
                const data = {name: name, value: value};
                pieData.push(data);
            }
            const option: EChartsOption = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: '图鉴分布',
                        type: 'pie',
                        radius: '50%',
                        data: pieData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            const element = document.getElementById(this.ID_CHART)!;
            const chart = echarts.init(element);
            chart.setOption(option);
            this.chart = chart;
        }
    }
}

class PetMapFinderFeature extends CommonWidgetFeature {
}

export {PetMapFinder, PetMapFinderFeature};