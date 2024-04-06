import _ from "lodash";
import SetupLoader from "../../core/config/SetupLoader";
import CastleInformation from "../../core/dashboard/CastleInformation";
import MapDashboardPage from "../../core/dashboard/MapDashboardPage";
import EventHandler from "../../core/event/EventHandler";
import MapBuilder from "../../core/map/MapBuilder";
import TravelPlanBuilder from "../../core/map/TravelPlanBuilder";
import TravelPlanExecutor from "../../core/map/TravelPlanExecutor";
import RankTitleLoader from "../../core/role/RankTitleLoader";
import TaskGuideManager from "../../core/task/TaskGuideManager";
import Coordinate from "../../util/Coordinate";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import StatelessPageProcessorCredentialSupport from "../StatelessPageProcessorCredentialSupport";

class MapDashboardPageProcessor extends StatelessPageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        const page = MapDashboardPage.parse(PageUtils.currentPageHtml());

        $("center:first")
            .attr("id", "systemAnnouncement");
        $("#systemAnnouncement")
            .after($("<div id='version' style='color:navy;font-weight:bold;text-align:center;width:100%'></div>"));
        // @ts-ignore
        $("#version").html(__VERSION__);

        if (SetupLoader.isQiHanTitleEnabled()) {
            $("table:first")
                .find("> tbody:first")
                .find("> tr:eq(1)")
                .find("> td:first")
                .find("> form:first")
                .find("> font:first")
                .each((idx, font) => {
                    let c = $(font).text();

                    let b = StringUtils.substringAfterLast(c, "(");
                    let a = StringUtils.substringBefore(c, "(" + b);
                    b = StringUtils.substringBefore(b, ")");
                    const ss = _.split(b, " ");
                    const b1 = _.replace(ss[0], "部队", "");
                    const b2 = RankTitleLoader.transformTitle(ss[1]);
                    const b3 = ss[2];

                    const s = a + "(" + b1 + " " + b2 + " " + b3 + ")";
                    $(font).text(s);
                });
        }

        $("table:first")
            .find("tbody:first")
            .find("> tr:eq(2)")
            .attr("id", "mapRow");

        let travelJournals = $("#mapRow")
            .find("> td:last")
            .html();

        $("#mapRow").html("" +
            "<td colspan='2'>" +
            "<table style='background-color:transparent;margin:auto;width:100%'>" +
            "<tbody>" +
            "<tr>" +
            "<td id='map' style='background-color:#F8F0E0'></td>" +
            "<td id='travelJournals' style='background-color:#EFE0C0;width:100%'></td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "</td>");
        $("#map").html(MapBuilder.buildMapTable());
        $("#travelJournals").html(travelJournals);

        MapBuilder.updateTownBackgroundColor();

        const roleTask = await new TaskGuideManager(credential).currentTask();
        if (roleTask === null || roleTask === "") {
            // 如果有必要的话绘制城堡
            new CastleInformation()
                .load(page.role!.name!)
                .then(castle => {
                    const coordinate = castle.coordinate!;
                    const buttonId = "location_" + coordinate.x + "_" + coordinate.y;
                    $("#" + buttonId)
                        .attr("value", "堡")
                        .css("background-color", "fuchsia")
                        .parent()
                        .attr("title", "城堡" + coordinate.asText() + " " + castle.name)
                        .attr("class", "color_fuchsia");
                });
        }

        const coordinate = Coordinate.parse(context!.get("coordinate")!);
        const buttonId = "location_" + coordinate.x + "_" + coordinate.y;
        $("#" + buttonId)
            .closest("td")
            .css("background-color", "black")
            .css("color", "yellow")
            .css("text-align", "center")
            .html($("#" + buttonId).val() as string);

        if (roleTask === null || roleTask === "") {
            this.#bindLocationButtons(credential);
        } else {
            processTask(credential, roleTask);
        }

        this.#renderRankTitle();
        this.#renderExperience();
        this.#renderEventBoard();
    }

    #bindLocationButtons(credential: Credential) {
        const instance = this;

        $(".location_button_class")
            .on("mouseenter", function () {
                $(this).css("background-color", "red");
            })
            .on("mouseleave", function () {
                const s = $(this).parent().attr("class")!;
                const c = StringUtils.substringAfter(s, "_");
                if (c !== "none") {
                    $(this).css("background-color", c);
                } else {
                    $(this).removeAttr("style");
                }
            });
        $(".location_button_class").on("click", function () {
            const ss = ($(this).attr("id") as string).split("_");
            const x = parseInt(ss[1]);
            const y = parseInt(ss[2]);
            const coordinate = new Coordinate(x, y);

            const confirmation = confirm("确认移动到坐标" + coordinate.asText() + "？");
            if (!confirmation) {
                return;
            }

            $("#mapRow")
                .next().hide()
                .next().hide()
                .next().hide()
                .next().hide();
            MessageBoard.createMessageBoardStyleC("travelJournals");
            $("#messageBoard")
                .closest("table")
                .css("height", "100%");
            $("#messageBoard")
                .parent()
                .before($("<tr style='background-color:#EFE0C0'>" +
                    "<td style='text-align:left'>坐标点：<span id='roleLocation' style='color:red'>-</span></td>" +
                    "</tr>" +
                    "<tr style='background-color:#EFE0C0'>" +
                    "<td style='text-align:left'>计时器：<span id='countDownTimer' style='color:red'>-</span></td>" +
                    "</tr>"));
            $("#messageBoard")
                .parent()
                .after($("<tr style='background-color:#EFE0C0'>" +
                    "<td style='text-align:center'><button role='button' id='refreshButton' disabled>移动中......</button></td>" +
                    "</tr>"));

            MessageBoard.resetMessageBoard("实时旅途动态播报：<br>");
            $(".location_button_class")
                .prop("disabled", true)
                .off("mouseenter")
                .off("mouseleave");

            instance.#doTravelToLocation(credential, coordinate);
        });
    }

    #renderRankTitle() {
        if (!SetupLoader.isQiHanTitleEnabled()) {
            return;
        }
        $("td:contains('身份')")
            .filter((idx, td) => $(td).text() === "身份")
            .next()
            .each((idx, th) => {
                let c = $(th).text();
                c = RankTitleLoader.transformTitle(c);
                $(th).text(c);
            });
    }

    #renderExperience() {
        if (!SetupLoader.isExperienceProgressBarEnabled()) {
            return;
        }
        $("td:contains('经验值')")
            .filter(function () {
                return $(this).text() === "经验值";
            })
            .next()
            .each(function (_idx, th) {
                const expText = $(th).text();
                const experience = parseInt(StringUtils.substringBefore(expText, " EX"));
                if (experience >= 14900) {
                    $(th).css("color", "blue").text("MAX");
                } else {
                    const level = Math.ceil(experience / 100) + 1;
                    const ratio = level / 150;
                    const progressBar = PageUtils.generateProgressBarHTML(ratio);
                    $(th).html("<span title='" + expText + "'>" + progressBar + "</span>");
                }
            });
    }

    #renderEventBoard() {
        $("td:contains('最近发生的事件')")
            .filter(function () {
                return $(this).text() === "最近发生的事件";
            })
            .parent()
            .next()
            .find("td:first")
            .attr("id", "eventBoard");

        const eventHtmlList: string[] = [];
        $("#eventBoard").html()
            .split("<br>")
            .filter(it => it.endsWith(")"))
            .map(function (it) {
                // noinspection HtmlDeprecatedTag,XmlDeprecatedElement,HtmlDeprecatedAttribute
                const header: string = "<font color=\"navy\">●</font>";
                return StringUtils.substringAfter(it, header);
            })
            .map(function (it) {
                return EventHandler.handleWithEventHtml(it);
            })
            .forEach(it => eventHtmlList.push(it));

        let html = "";
        html += "<table style='border-width:0;width:100%;height:100%;margin:auto'>";
        html += "<tbody>";
        eventHtmlList.forEach(it => {
            html += "<tr>";
            html += "<th style='color:navy;vertical-align:top'>●</th>";
            html += "<td style='width:100%'>";
            html += it;
            html += "</td>";
            html += "</tr>";
        });
        html += "</tbody>";
        html += "</table>";

        $("#eventBoard").html(html);
    }

    #doTravelToLocation(credential: Credential, location: Coordinate) {
        MessageBoard.publishMessage("目的地坐标：<span style='color:greenyellow'>" + location.asText() + "</span>");

        const plan = TravelPlanBuilder.initializeTravelPlan(PageUtils.currentPageHtml());
        plan.destination = location;
        plan.credential = credential;
        const executor = new TravelPlanExecutor(plan);
        executor.execute()
            .then(() => {
                MessageBoard.publishMessage("旅途愉快，下次再见。");
                $("#refreshButton")
                    .prop("disabled", false)
                    .text("到达了目的地" + location.asText())
                    .on("click", () => {
                        $("input:submit[value='更新']").trigger("click");
                    });
            });
    }
}

function processTask(credential: Credential, roleTask: string) {
    // 当前有任务
    let html = "";
    html += "<table style='background-color:transparent;margin:auto;width:100%;height:100%'>";
    html += "<tbody>";
    html += "<tr>";
    html += "<td style='text-align:center;font-weight:bold;background-color:navy;color:yellowgreen'>" + roleTask + "</td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style='text-align:left;background-color:#D4D4D4' id='walkthrough'></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style='text-align:left'>坐标点：<span id='roleLocation' style='color:red'>-</span></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style='text-align:left'>计时器：<span id='countDownTimer' style='color:red'>-</span></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td id='messageBoardContainer'></td>";
    html += "</tr>";
    html += "<tr style='display:none;text-align:center'>";
    html += "<td><button role='button' id='refreshButton' disabled>移动中......</button></td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";
    $("#travelJournals").html(html);
    MessageBoard.createMessageBoardStyleC("messageBoardContainer");

    switch (roleTask) {
        case "新手任务":
            doRenderTask1();
            break;
        case "落凤坡":
            doRenderTask2();
            break;
        case "辕门射戟":
            doRenderTask3();
            break;
        case "葵花宝典":
            doRenderTask4();
            break;
        case "五丈原":
            doRenderTask5();
            break;
        case "赤壁之战":
            doRenderTask6();
            break;
        case "走麦城":
            doRenderTask7();
            break;
        case "三顾茅庐":
            doRenderTask8();
            break;
        case "过五关斩六将":
            doRenderTask9();
            break;
        case "七擒孟获":
            doRenderTask10();
            break;
        case "游五岳":
            doRenderTask11();
            break;
        case "五虎将":
            doRenderTask12();
            break;
    }

    doBindLocationButton(credential);
}

function doBindLocationButton(credential: Credential) {
    $(".location_button_class")
        .on("mouseenter", function () {
            $(this).css("background-color", "red");
        })
        .on("mouseleave", function () {
            const s = $(this).parent().attr("class")!;
            const c = StringUtils.substringAfter(s, "_");
            if (c !== "none") {
                $(this).css("background-color", c);
            } else {
                $(this).removeAttr("style");
            }
        });
    $(".location_button_class").on("click", function () {
        const ss = ($(this).attr("id") as string).split("_");
        const x = parseInt(ss[1]);
        const y = parseInt(ss[2]);
        const coordinate = new Coordinate(x, y);

        const confirmation = confirm("确认移动到坐标" + coordinate.asText() + "？");
        if (!confirmation) {
            return;
        }

        $("#mapRow")
            .next().hide()
            .next().hide()
            .next().hide()
            .next().hide();
        $("#refreshButton").parent().parent().show();

        MessageBoard.resetMessageBoard("实时旅途动态播报：<br>");
        $(".location_button_class")
            .prop("disabled", true)
            .off("mouseenter")
            .off("mouseleave");

        doTravelToLocation(credential, coordinate);
    });
}

function doTravelToLocation(credential: Credential, location: Coordinate) {
    MessageBoard.publishMessage("目的地坐标：<span style='color:greenyellow'>" + location.asText() + "</span>");

    const plan = TravelPlanBuilder.initializeTravelPlan(PageUtils.currentPageHtml());
    plan.destination = location;
    plan.credential = credential;
    const executor = new TravelPlanExecutor(plan);
    executor.execute()
        .then(() => {
            MessageBoard.publishMessage("旅途愉快，下次再见。");
            $("#refreshButton")
                .prop("disabled", false)
                .text("到达了目的地" + location.asText())
                .on("click", () => {
                    $("input:submit[value='更新']").trigger("click");
                });
        });
}

function doRenderTask1() {
    let html = "";
    html += "<li>(7,10)找瓦格纳对话，答题，答完后找他要奖励（每人只能做一次）</li>";
    html += "<li>关于雷姆力亚的问题；你知道个人天真报名时间吗？：除周三外</li>";
    html += "<li>本游戏是否允许注册多ID？：不允许</li>";
    html += "<li>回答完毕返回，然后再次拜访 瓦格纳 选择 索取奖励</li>";
    $("#walkthrough").html(html);

    let buttonId = "location_7_10";
    $("#" + buttonId)
        .attr("value", "瓦")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "瓦格纳")
        .attr("class", "color_yellow");
}

function doRenderTask2() {
    let html = "";
    html += "<li>(6,6)找诸葛亮问落凤坡</li>";
    html += "<li>(7,7)打庞统，打完问庞统搞定</li>";
    html += "<li>(6,6)问诸葛亮完工</li>";
    html += "<li>好处:可以修改人物属性</li>";
    $("#walkthrough").html(html);

    let buttonId = "location_6_6";
    $("#" + buttonId)
        .attr("value", "诸")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "诸葛亮")
        .attr("class", "color_yellow");
    buttonId = "location_7_7";
    $("#" + buttonId)
        .attr("value", "庞")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "庞统")
        .attr("class", "color_yellow");
}

function doRenderTask3() {
    let html = "";
    html += "<li>(8,11)打吕布，可以无限次做这个任务</li>";
    html += "<li>好处:得到饰品超力怪兽球20 5</li>";
    html += "<li>(宠物捕获率*2)但是只能使用100次，不能修，不能卖</li>";
    $("#walkthrough").html(html);

    let buttonId = "location_8_11";
    $("#" + buttonId)
        .attr("value", "吕")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "吕布")
        .attr("class", "color_yellow");
}

function doRenderTask4() {
    let html = "";
    html += "<li>(5,10)找东方不败对话,战斗,搞定</li>";
    html += "<li>好处:[书籍]葵花宝典(变性)</li>";
    $("#walkthrough").html(html);

    let buttonId = "location_5_10";
    $("#" + buttonId)
        .attr("value", "东")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "东方不败")
        .attr("class", "color_yellow");
}

function doRenderTask5() {
    let html = "";
    html += "<li>【剑圣】第一次转剑圣时接到任务</li>";
    html += "<li>(3,11)找司马懿对话，然后战斗，打赢后再对话</li>";
    html += "<li>好处:百宝袋（可以放更多东西）</li>";
    $("#walkthrough").html(html);

    let buttonId = "location_3_11";
    $("#" + buttonId)
        .attr("value", "司")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "司马懿")
        .attr("class", "color_yellow");
}

function doRenderTask6() {
    let html = "";
    html += "<li>【龙战士】第一次转龙战士时接到任务</li>";
    html += "<li>(8,5)找蒋干对话</li>";
    html += "<li>(6,6)找诸葛亮对话</li>";
    html += "<li>(8,5)找黄盖对话</li>";
    html += "<li>(7,7)找庞统对话</li>";
    html += "<li>(6,6)找诸葛亮对话</li>";
    html += "<li>(8,5)找周瑜对话，打赢周瑜</li>";
    html += "<li>(8,5)找曹操对话，打赢曹操</li>";
    html += "<li>(8,5)找曹操对话</li>";
    html += "<li>好处:移动力+2</li>";
    $("#walkthrough").html(html);

    let buttonId = "location_8_5";
    $("#" + buttonId)
        .attr("value", "群")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "群")
        .attr("class", "color_yellow");
    buttonId = "location_6_6";
    $("#" + buttonId)
        .attr("value", "诸")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "诸葛亮")
        .attr("class", "color_yellow");
    buttonId = "location_7_7";
    $("#" + buttonId)
        .attr("value", "庞")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "庞统")
        .attr("class", "color_yellow");
}

function doRenderTask7() {
    let html = "";
    html += "<li>【拳王】第一次转拳王时接到任务</li>";
    html += "<li>(5,5)问关羽</li>";
    html += "<li>(5,5)打吕蒙</li>";
    html += "<li>(5,5)打徐晃</li>";
    html += "<li>好处:移动力+1</li>";
    $("#walkthrough").html(html);

    let buttonId = "location_5_5";
    $("#" + buttonId)
        .attr("value", "群")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "群")
        .attr("class", "color_yellow");
}

function doRenderTask8() {
    let html = "";
    html += "<li>【大魔导师】第一次转大魔导师时接到任务</li>";
    html += "<li>(6,6)找诸葛亮对话，然后战斗，打赢后再对话</li>";
    html += "<li>(6,6)好处:国资金+100w</li>";
    $("#walkthrough").html(html);

    let buttonId = "location_6_6";
    $("#" + buttonId)
        .attr("value", "诸")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "诸葛亮")
        .attr("class", "color_yellow");
}

function doRenderTask9() {
    let html = "";
    html += "<li>【贤者】第一次转贤者时接到任务</li>";
    html += "<li>(7,9)问、杀、问</li>";
    html += "<li>(6,9)问、杀、问</li>";
    html += "<li>(7,10)问、杀、问</li>";
    html += "<li>(8,10)问、杀、问</li>";
    html += "<li>(9,10)问、杀、问</li>";
    html += "<li>好处:黄金笼子（可以存放更多宠物）</li>";
    $("#walkthrough").html(html);

    let buttonId = "location_7_9";
    $("#" + buttonId)
        .attr("value", "孔")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "孔秀")
        .attr("class", "color_yellow");
    buttonId = "location_6_9";
    $("#" + buttonId)
        .attr("value", "群")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "群")
        .attr("class", "color_yellow");
    buttonId = "location_7_10";
    $("#" + buttonId)
        .attr("value", "卞")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "卞喜")
        .attr("class", "color_yellow");
    buttonId = "location_8_10";
    $("#" + buttonId)
        .attr("value", "王")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "王植")
        .attr("class", "color_yellow");
    buttonId = "location_9_10";
    $("#" + buttonId)
        .attr("value", "秦")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "秦琪")
        .attr("class", "color_yellow");
}

function doRenderTask10() {
    let html = "";
    html += "<li>【狙击手】第一次转狙击手时接到任务</li>";
    html += "<li>(0,4)问孟获一次按提示顺序依次打一个，每次打前都要问孟获，打完后问</li>";
    html += "<li>好处:移动力+2</li>";
    $("#walkthrough").html(html);

    let buttonId = "location_0_4";
    $("#" + buttonId)
        .attr("value", "群")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "群")
        .attr("class", "color_yellow");
}

function doRenderTask11() {
    let html = "";
    html += "<li>【吟游诗人】 第一次转吟游诗人时接到任务</li>";
    html += "<li>(9,10)探索</li>";
    html += "<li>(6,9)探索</li>";
    html += "<li>(6,4)探索</li>";
    html += "<li>(7,10)探索</li>";
    html += "<li>(10,6)探索</li>";
    html += "<li>好处:移动力+1</li>";
    $("#walkthrough").html(html);

    let buttonId = "location_9_10";
    $("#" + buttonId)
        .attr("value", "岳")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "岳")
        .attr("class", "color_yellow");
    buttonId = "location_6_9";
    $("#" + buttonId)
        .attr("value", "岳")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "岳")
        .attr("class", "color_yellow");
    buttonId = "location_6_4";
    $("#" + buttonId)
        .attr("value", "岳")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "岳")
        .attr("class", "color_yellow");
    buttonId = "location_7_10";
    $("#" + buttonId)
        .attr("value", "岳")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "岳")
        .attr("class", "color_yellow");
    buttonId = "location_10_6";
    $("#" + buttonId)
        .attr("value", "岳")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "岳")
        .attr("class", "color_yellow");
}

function doRenderTask12() {
    let html = "";
    html += "<li>【天位】第一次转天位时接到任务</li>";
    html += "<li>(5,5)关羽 问打问</li>";
    html += "<li>(7,4)黄忠 问打问</li>";
    html += "<li>(10,7)张飞 问打问</li>";
    html += "<li>(8,11)赵云 问打问</li>";
    html += "<li>(1,14)马超 问打问</li>";
    html += "<li>好处:移动力+1</li>";
    $("#walkthrough").html(html);

    let buttonId = "location_5_5";
    $("#" + buttonId)
        .attr("value", "关")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "关羽")
        .attr("class", "color_yellow");
    buttonId = "location_7_4";
    $("#" + buttonId)
        .attr("value", "黄")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "黄忠")
        .attr("class", "color_yellow");
    buttonId = "location_10_7";
    $("#" + buttonId)
        .attr("value", "张")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "张飞")
        .attr("class", "color_yellow");
    buttonId = "location_8_11";
    $("#" + buttonId)
        .attr("value", "赵")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "赵云")
        .attr("class", "color_yellow");
    buttonId = "location_1_14";
    $("#" + buttonId)
        .attr("value", "马")
        .css("background-color", "yellow")
        .parent()
        .attr("title", "马超")
        .attr("class", "color_yellow");
}

export = MapDashboardPageProcessor;