import TeamMemberLoader from "../team/TeamMemberLoader";
import Equipment from "./Equipment";
import RoleEquipmentStatusStorage from "./RoleEquipmentStatusStorage";

class TeamEquipmentReportGenerator {

    readonly #includeExternal: boolean;
    readonly #searchName?: string;
    readonly #equipmentFilter?: (equipment: Equipment) => boolean;

    constructor(includeExternal: boolean,
                searchName?: string,
                equipmentFilter?: (equipment: Equipment) => boolean) {
        this.#includeExternal = includeExternal;
        this.#searchName = searchName;
        this.#equipmentFilter = equipmentFilter;
    }

    generate() {
        let html = "";
        html += "<table style='margin:auto;border-width:0;text-align:center;background-color:#888888;width:100%'>";
        html += "<tbody id='equipmentStatusList'>";
        html += "<tr>";
        html += "<th style='background-color:skyblue'>队员</th>";
        html += "<th style='background-color:skyblue'>装备</th>";
        html += "<th style='background-color:skyblue'>名字</th>";
        html += "<th style='background-color:skyblue'>种类</th>";
        html += "<th style='background-color:skyblue'>效果</th>";
        html += "<th style='background-color:skyblue'>重量</th>";
        html += "<th style='background-color:skyblue'>耐久</th>";
        html += "<th style='background-color:skyblue'>威＋</th>";
        html += "<th style='background-color:skyblue'>重＋</th>";
        html += "<th style='background-color:skyblue'>幸＋</th>";
        html += "<th style='background-color:skyblue'>经验</th>";
        html += "<th style='background-color:skyblue'>位置</th>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        $("#information").html(html).parent().hide();

        let totalCount = 0;
        const configs = TeamMemberLoader.loadTeamMembers()
            .filter(it => this.#includeExternal || it.external === undefined || !it.external);
        const idList = configs.map(it => it.id!);
        RoleEquipmentStatusStorage.getInstance()
            .loads(idList)
            .then(dataMap => {
                for (const config of configs) {
                    const data = dataMap.get(config.id!);
                    if (data === undefined) {
                        continue;
                    }
                    const equipments: string[] = JSON.parse(data.json!);

                    let html = "";
                    let row = 0;

                    const equipmentList = equipments
                        .map(it => Equipment.parse(it))
                        .sort(Equipment.sorter)
                        .filter(it => this.#searchName === undefined || this.#searchName === "" || it.fullName.includes(this.#searchName))
                        .filter(it => this.#equipmentFilter === undefined || this.#equipmentFilter(it));
                    equipmentList.forEach(it => {
                        if (row === 0) {
                            html += "<tr>";
                            html += "<td style='background-color:darkgreen;height:2px' colspan='12'></td>";
                            html += "</tr>";
                            html += "<tr>";
                            html += "<td style='background-color:black;color:white;white-space:nowrap;font-weight:bold;vertical-align:center' " +
                                "rowspan='" + (equipmentList.length) + "'>" + config.name + "</td>";
                        } else {
                            html += "<tr>";
                        }
                        html += "<td style='background-color:#E8E8B0'>" + it.usingHTML + "</td>";
                        html += "<td style='background-color:#E8E8D0;text-align:left'>" + it.fullName + "</td>";
                        html += "<td style='background-color:#E8E8B0'>" + it.category + "</td>";
                        html += "<td style='background-color:#E8E8D0'>" + it.power + "</td>";
                        html += "<td style='background-color:#E8E8B0'>" + it.weight + "</td>";
                        html += "<td style='background-color:#E8E8D0'>" + it.endure + "</td>";
                        html += "<td style='background-color:#E8E8B0'>" + it.additionalPowerHtml + "</td>";
                        html += "<td style='background-color:#E8E8D0'>" + it.additionalWeightHtml + "</td>";
                        html += "<td style='background-color:#E8E8B0'>" + it.additionalLuckHtml + "</td>";
                        html += "<td style='background-color:#E8E8D0'>" + it.experienceHTML + "</td>";
                        html += "<td style='background-color:#E8E8B0'>" + it.location + "</td>";
                        html += "</tr>";
                        row++;
                        totalCount++;
                    });
                    $("#equipmentStatusList").append($(html));
                }
                if (totalCount > 0) {
                    let footer = "";
                    footer += "<tr>";
                    footer += "<td style='background-color:darkgreen;height:2px' colspan='12'></td>";
                    footer += "</tr>";
                    footer += "<tr>";
                    footer += "<td style='background-color:#E8E8D0;font-weight:bold;text-align:center' colspan='12'>";
                    footer += "发现满足条件的装备总数：" + totalCount;
                    footer += "</td>";
                    footer += "</tr>";
                    $("#equipmentStatusList").append($(footer));
                }
                $("#information").parent().show();
            });
    }
}

export = TeamEquipmentReportGenerator;