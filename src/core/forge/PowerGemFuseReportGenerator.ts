import TeamMemberLoader from "../team/TeamMemberLoader";
import GemFuseLogStorage from "./GemFuseLogStorage";
import PowerGemFuseReport from "./PowerGemFuseReport";

class PowerGemFuseReportGenerator {

    generate(includeExternal: boolean) {
        this.#loadReports(includeExternal).then(reports => {
            if (reports.size === 1) {
                let html = "<span style='font-size:200%;font-weight:bold;color:red'>" +
                    "没有镶嵌威力宝石的记录！" +
                    "</span>";
                $("#information").html(html).parent().show();
                return;
            }

            let html = "";
            html += "<table style='text-align:center;background-color:#888888;margin:auto;width:100%'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<th style='background-color:navy;color:yellow' colspan='35'>威 力 宝 石 统 计</th>";
            html += "</tr>";

            html += "<tr>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>成员</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>-10</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>-9</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>-8</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>-7</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>-6</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>-5</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>-4</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>-3</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>-2</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>-1</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>0</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>1</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>2</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>3</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>4</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>5</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>6</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>7</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>8</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>9</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>10</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>11</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>12</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>13</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>14</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>15</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>16</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>17</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>18</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>19</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>20</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>次</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>总</th>";
            html += "<th style='background-color:skyblue;white-space:nowrap'>均</th>";
            html += "</tr>";

            reports.forEach(report => {
                html += "<tr>";
                html += "<th style='background-color:black;color:white;white-space:nowrap'>";
                html += report.roleName;
                html += "</th>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.m10) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.m9) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.m8) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.m7) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.m6) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.m5) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.m4) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.m3) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.m2) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.m1) + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + this.#formalizeNumber(report.z) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.p1) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.p2) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.p3) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.p4) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.p5) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.p6) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.p7) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.p8) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.p9) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.p10) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.p11) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.p12) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.p13) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.p14) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.p15) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.p16) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.p17) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.p18) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.p19) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + this.#formalizeNumber(report.p20) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + report.count + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + report.totalEffort + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + report.average() + "</td>";
                html += "</tr>";
            });

            html += "</tbody>";
            html += "</table>";

            $("#information").html(html).parent().show();
        });
    }

    #formalizeNumber(n: number) {
        if (n === 0) {
            return "";
        } else {
            return n;
        }
    }


    async #loadReports(includeExternal: boolean): Promise<Map<string, PowerGemFuseReport>> {
        const reports = new Map<string, PowerGemFuseReport>();
        TeamMemberLoader.loadTeamMembers()
            .filter(it => includeExternal || it.external === undefined || !it.external)
            .forEach(it => {
                const report = new PowerGemFuseReport();
                report.roleName = it.name!;
                reports.set(it.id!, report);
            });
        const all = new PowerGemFuseReport();
        all.roleName = "全团队";
        reports.set("$AllTeam", all);

        const storage = GemFuseLogStorage.getInstance();
        (await storage.loads())
            .filter(it => it.gem === "威力")
            .forEach(it => {
                const roleId = it.roleId!;
                const report = reports.get(roleId);
                if (report) {
                    const effort = it.effort!;
                    report.increase(effort);
                    all.increase(effort);
                }
            });

        return await (() => {
            return new Promise<Map<string, PowerGemFuseReport>>(resolve => resolve(reports));
        })();
    }
}

export = PowerGemFuseReportGenerator;