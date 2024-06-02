import * as echarts from "echarts";
import {EChartsOption} from "echarts";
import _ from "lodash";
import TeamMemberLoader from "../team/TeamMemberLoader";
import BankRecord from "./BankRecord";
import BankRecordStorage from "./BankRecordStorage";

class BankRecordReportGenerator {

    generate(includeExternal: boolean) {
        _loadBankRecords(includeExternal).then(reports => _doGenerate(reports));
    }

}

function _doGenerate(reports: Map<string, Report>) {
    if (reports.size === 0) {
        let html = "<span style='font-size:200%;font-weight:bold;color:red'>" +
            "没有银行资产数据，请手动更新或者等待战斗后自动更新！" +
            "</span>";
        $("#information").html(html).parent().show();
        return;
    }

    let totalSaving = 0;
    reports.forEach(it => {
        totalSaving += it.record.saving!
    });

    let html = "";
    html += "<table style='text-align:center;background-color:#888888;margin:auto;width:100%'>";
    html += "<tbody>";
    html += "<tr>";
    html += "<th style='background-color:navy;color:yellow' colspan='3'>银 行 资 产 分 析</th>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style='background-color:#E8E8D0;color:red;font-weight:bold' colspan='3'>";
    html += "约 " + _.floor(totalSaving / 1000000) + "M Gold";
    html += "</td>";
    html += "</tr>";

    let index = 0;
    reports.forEach(report => {
        html += "<tr>";
        html += "<th style='background-color:black;color:white;white-space:nowrap'>";
        html += report.roleName;
        html += "</th>";
        html += "<td style='background-color:#E8E8D0;white-space:nowrap;text-align:right'>";
        html += report.record.saving + " Gold";
        html += "</td>";
        if (index++ === 0) {
            html += "<td style='background-color:#E8E8D0;width:100%;height:300px' rowspan='" + reports.size + "' id='mc1'>";
            html += "</td>";
        }
        html += "</tr>";
    });

    html += "</tbody>";
    html += "</table>";

    $("#information").html(html).parent().show();

    const pieData: {}[] = [];
    reports.forEach(it => {
        const name = it.roleName;
        const value = it.record.saving!;
        const data = {name: name, value: value};
        pieData.push(data);
    });

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
                name: '银行存款',
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
    const element = document.getElementById("mc1")!;
    const mc1 = echarts.init(element);
    mc1.setOption(option);
}

async function _loadBankRecords(includeExternal: boolean): Promise<Map<string, Report>> {

    const names = new Map<string, string>();
    TeamMemberLoader.loadTeamMembers()
        .filter(it => includeExternal || it.external === undefined || !it.external)
        .forEach(it => names.set(it.id!, it.name!));

    const promises: Promise<BankRecord | null>[] = [];
    TeamMemberLoader.loadTeamMembers()
        .filter(it => includeExternal || it.external === undefined || !it.external)
        .map(it => it.id!)
        .forEach(it => promises.push(BankRecordStorage.load(it)));

    const reports = new Map<string, Report>();
    (await Promise.all(promises))
        .forEach(it => {
            if (it) {
                const roleId = it.roleId!;
                const roleName = names.get(roleId)!;
                const report = new Report(roleName, it);
                reports.set(roleId, report);
            }
        });
    return await (() => {
        return new Promise<Map<string, Report>>(resolve => resolve(reports));
    })();
}

class Report {

    readonly roleName: string;
    readonly record: BankRecord;

    constructor(roleName: string, record: BankRecord) {
        this.roleName = roleName;
        this.record = record;
    }
}

export = BankRecordReportGenerator;