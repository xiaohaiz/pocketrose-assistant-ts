import _ from "lodash";
import NpcLoader from "../../core/NpcLoader";
import PalaceTaskManager from "../../core/task/PalaceTaskManager";
import TownLoader from "../../core/town/TownLoader";
import PersonalStatus from "../../pocketrose/PersonalStatus";
import TownBank from "../../pocketrose/TownBank";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import PageUtils from "../../util/PageUtils";
import TimeoutUtils from "../../util/TimeoutUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class CountryPalacePageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        $("table[height='100%']").removeAttr("height");

        const pageTitle = $("table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .attr("id", "pageTitle")
            .text();

        $("#pageTitle")
            .removeAttr("bgcolor")
            .removeAttr("width")
            .removeAttr("height")
            .css("text-align", "center")
            .css("font-size", "150%")
            .css("font-weight", "bold")
            .css("background-color", "navy")
            .css("color", "yellowgreen")
            .text(_.trim(pageTitle));

        $("#pageTitle")
            .parent()
            .next()
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:last")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .each((i, td) => {
                new PersonalStatus(credential, context?.get("townId")).load().then(role => {
                    $(td).text(role.name!);
                });
            })
            .parent()
            .next()
            .find("> td:last")
            .attr("id", "roleCash")
            .parent()
            .each((i, tr) => {
                let html = "";
                html += "<tr>";
                html += "<td style='background-color:#E0D0B0'>计时器</td>";
                html += "<td style='background-color:#E8E8D0;color:red;text-align:right;font-weight:bold' " +
                    "colspan='3' id='countDownTimer'>-</td>";
                html += "</tr>";
                $(tr).after($(html));
            });

        $("#pageTitle")
            .parent()
            .next()
            .next()
            .find("> td:first")
            .attr("id", "messageBoardContainer")
            .html("")
            .each((i, td) => {
                const containerId = $(td).attr("id")!;
                const imageHtml = NpcLoader.randomNpcImageHtml();
                MessageBoard.createMessageBoardStyleB(containerId, imageHtml);
                $("#messageBoard")
                    .css("background-color", "black")
                    .css("color", "white")
                    .html(this.#welcomeMessageHtml());
            });

        $("table:first")
            .find("> tbody:first")
            .find("> tr:last")
            .find("> td:first")
            .attr("id", "hidden-0")
            .parent()
            .hide()
            .each((i, tr) => {
                let html = "";
                html += "<tr style='display:none'>";
                html += "<td id='hidden-1'></td>"
                html += "</tr>";
                html += "<tr style='display:none'>";
                html += "<td id='hidden-2'></td>"
                html += "</tr>";
                html += "<tr style='display:none'>";
                html += "<td id='hidden-3'></td>"
                html += "</tr>";
                html += "<tr style='display:none'>";
                html += "<td id='prompt' style='background-color:#D4D4D4;font-weight:bold;text-align:center'></td>"
                html += "</tr>";
                html += "<tr>";
                html += "<td id='task' style='background-color:#F8F0E0;text-align:center'></td>"
                html += "</tr>";
                html += "<tr>";
                html += "<td id='menu' style='background-color:#F8F0E0;text-align:center'></td>"
                html += "</tr>";
                $(tr).after($(html));
            });

        renderMenu(context!);
        renderTask(credential, context!);
        renderPrompt(credential);
    }

    #welcomeMessageHtml() {
        return "<b style='color:whitesmoke;font-size:120%'>" +
            "秋风起兮白云飞，草木黄落兮雁南归。兰有秀兮菊有芳，怀佳人兮不能忘。<br>" +
            "泛楼船兮济汾河，横中流兮扬素波。萧鼓鸣兮发棹歌，欢乐极兮哀情多。<br>" +
            "少壮几时兮奈老何。" +
            "</b>";
    }

}

function renderMenu(context: PageProcessorContext) {
    $("#menu")
        .each((i, td) => {
            const town = TownLoader.getTownById(context!.get("townId")!)!;
            let html = "";
            html += "<table style='background-color:transparent;border-width:unset;border-spacing:unset;margin:auto'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td>";
            html += "<button role='button' class='palaceButton' id='returnButton'>返回" + town.name + "</button>";
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            $(td).html(html);
            $("#returnButton").on("click", () => {
                $("input:submit[value='返回城市']").trigger("click");
            });
        });
}

function renderTask(credential: Credential, context: PageProcessorContext) {
    let html = "";
    html += "<table style='background-color:#888888;margin:auto;text-align:center'>";
    html += "<tbody style='background-color:#F8F0E0'>";
    html += "<tr style='background-color:red;color:white'>";
    html += "<th>内阁</th>";
    html += "<th>官职</th>";
    html += "<th>任务</th>";
    html += "<th>接受</th>";
    html += "<th>完成</th>";
    html += "<th>花</th>";
    html += "</tr>";

    $("#hidden-0")
        .find("> center:first")
        .find("> form:first")
        .find("> table:first")
        .find("> tbody:first")
        .find("> tr")
        .filter(i => i > 1)
        .each((i, tr) => {
            const c1 = $(tr).find("> td:first");
            const c2 = c1.next();
            const c3 = c2.next();
            const c4 = c3.next();
            const c5 = c4.next();

            const radio = c1.find("> input:radio");

            const index = _.parseInt(radio.val() as string);
            const title = c3.text();
            const task = c4.text();
            const flower = c5.text();

            html += "<tr>";
            html += "<td style='width:64px;height:64px'>" + NpcLoader.getTaskNpcImageHtml(title) + "</td>";
            html += "<td>" + title + "</td>";
            html += "<td>" + task + "</td>";
            if (!radio.prop("disabled")) {
                html += "<td><button role='button' class='palaceButton acceptButton' id='accept-" + index + "'>接受任务</button></td>";
                html += "<td><button role='button' class='palaceButton finishButton' id='finish-" + index + "'>完成任务</button></td>";
            } else {
                html += "<td><button role='button' id='accept-" + index + "' disabled>接受任务</button></td>";
                html += "<td><button role='button' id='finish-" + index + "' disabled>完成任务</button></td>";
            }
            html += "<td>" + flower + "</td>";
            html += "</tr>";

        });

    html += "<tr>";
    html += "<td colspan='6'>";
    html += "<button role='button' class='palaceButton' id='cancel' style='width:100%;background-color:red;color:white;font-weight:bold'>取 消 任 务</button>";
    html += "</td>";
    html += "</tr>";

    html += "</tbody>";
    html += "</table>";

    $("#task").html(html);

    bindTaskButton(credential, context);
}

function renderPrompt(credential: Credential) {
    new PalaceTaskManager(credential)
        .monsterTaskHtml()
        .then(html => {
            if (html === "") {
                $("#prompt").html("").parent().hide();
            } else {
                $("#prompt").html(html).parent().show();
            }
        });
}

function bindTaskButton(credential: Credential, context: PageProcessorContext) {
    $(".acceptButton").on("click", event => {
        PageUtils.scrollIntoView("pageTitle");
        const buttonId = $(event.target).attr("id") as string;
        const index = _.parseInt(_.split(buttonId, "-")[1]);
        const noWait = confirm("请确认您当前是否已经读秒冷却完成了？如果取消会自动开始读秒。");
        let timeout = 0;
        if (!noWait) {
            MessageBoard.publishMessage("请耐心等待计时器冷却...");
            timeout = 55000;
        }
        $(".palaceButton").prop("disabled", true);
        TimeoutUtils.execute(timeout, () => {
            if (index !== 4) {
                $("input:radio[value='" + index + "']").prop("checked", true);
                $("option[value='ACCEPTTASK']").prop("selected", true);
                $("input:submit[value='OK']").trigger("click");
            } else {
                const request = credential.asRequestMap();
                request.set("governid", "4");
                request.set("mode", "ACCEPTTASK");
                NetworkUtils.post("country.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    if (html.includes("请去战斗场所消灭")) {
                        const monsterName = $(html)
                            .find("h2:first")
                            .find("> font:first")
                            .text();
                        new PalaceTaskManager(credential)
                            .updateMonsterTask(monsterName)
                            .then(() => {
                                $(".palaceButton").prop("disabled", false);
                                renderPrompt(credential);
                            });
                    } else if (html.includes("您当前的任务是杀掉")) {
                        // 当前已经接受了任务
                        const monsterName = $(html)
                            .find("h3:first")
                            .next()
                            .find("> font:first")
                            .find("> b:first")
                            .find("> font:first")
                            .text();
                        new PalaceTaskManager(credential)
                            .updateMonsterTask(monsterName)
                            .then(() => {
                                $(".palaceButton").prop("disabled", false);
                                renderPrompt(credential);
                            });
                    }
                });
            }
        });
    });
    $(".finishButton").on("click", event => {
        PageUtils.scrollIntoView("pageTitle");
        const buttonId = $(event.target).attr("id") as string;
        const index = _.parseInt(_.split(buttonId, "-")[1]);
        const noWait = confirm("请确认您当前是否已经读秒冷却完成了？如果取消会自动开始读秒。");
        let timeout = 0;
        if (!noWait) {
            MessageBoard.publishMessage("请耐心等待计时器冷却...");
            timeout = 55000;
        }
        $(".palaceButton").prop("disabled", true);
        TimeoutUtils.execute(timeout, () => {
            if (index !== 4) {
                $("input:radio[value='" + index + "']").prop("checked", true);
                $("option[value='COMPLETETASK']").prop("selected", true);
                $("input:submit[value='OK']").trigger("click");
            } else {
                const request = credential.asRequestMap();
                request.set("governid", "4");
                request.set("mode", "COMPLETETASK");
                NetworkUtils.post("country.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    if (html.includes("你还没有完成杀掉")) {
                        const monsterName = $(html)
                            .find("h3:first")
                            .next()
                            .find("> font:first")
                            .find("> b:first")
                            .find("> font:first")
                            .text();
                        new PalaceTaskManager(credential)
                            .updateMonsterTask(monsterName)
                            .then(() => {
                                $(".palaceButton").prop("disabled", false);
                                renderPrompt(credential);
                            });
                    } else {
                        // 完成了
                        new PalaceTaskManager(credential)
                            .finishMonsterTask()
                            .then(() => {
                                $(".palaceButton").prop("disabled", false);
                                renderPrompt(credential);
                            });
                    }
                });
            }
        });
    });
    $("#cancel").on("click", () => {
        if (!confirm("请确认要取消所有的任务么？")) {
            return;
        }
        PageUtils.scrollIntoView("pageTitle");
        $(".palaceButton").prop("disabled", true);
        const bank = new TownBank(credential, context.get("townId"));
        bank.withdraw(10).then(() => {
            bank.load().then(account => {
                $("#roleCash").text(account.cash + " GOLD");
            });
            MessageBoard.publishMessage("请耐心等待计时器冷却...");
            TimeoutUtils.execute(55000, () => {
                const request = credential.asRequestMap();
                request.set("mode", "CANCELTASK");
                NetworkUtils.post("country.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    new PalaceTaskManager(credential)
                        .finishMonsterTask()
                        .then(() => {
                            bank.deposit().then(() => {
                                bank.load().then(account => {
                                    $("#roleCash").text(account.cash + " GOLD");
                                });
                                $(".palaceButton").prop("disabled", false);
                                renderPrompt(credential);
                            });
                        });
                });
            });
        });
    });
}


export = CountryPalacePageProcessor;