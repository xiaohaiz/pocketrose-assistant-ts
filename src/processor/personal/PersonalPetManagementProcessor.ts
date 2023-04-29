import PageProcessor from "../PageProcessor";
import PageUtils from "../../util/PageUtils";
import PetParser from "../../pocket/PetParser";
import Credential from "../../util/Credential";
import Pet from "../../pocket/Pet";
import StringUtils from "../../util/StringUtils";
import RoleLoader from "../../pocket/RoleLoader";
import DOMAIN from "../../util/Constants";
import MessageBoard from "../../util/MessageBoard";

class PersonalPetManagementProcessor extends PageProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();
        const petList = PetParser.parsePersonalPetList(this.pageHtml);
        const studyStatus = PetParser.parsePersonalPetStudyStatus(this.pageHtml);
        doProcess(credential, petList, studyStatus);
    }
}

function doProcess(credential: Credential, petList: Pet[], studyStatus: number[]) {
    $("input:submit[value='返回城市']").attr("id", "returnButton");

    let html = "<center>";
    html += "<table style='background-color:#888888;width:100%;text-align:center'>";
    html += "<tbody style='background-color:#F8F0E0'>";
    html += "<tr>";
    html += "<td style='background-color:navy;color:yellowgreen;font-size:200%;font-weight:bold'>" +
        "＜＜  宠 物 管 理  ＞＞" +
        "</td>";
    html += "</tr>";
    html += "<tr style='display:none'>";
    html += "<td id='eden'></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td id='message_board_container'></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td id='pet_management_container'></td>";
    html += "</tr>";
    html += "</tody>";
    html += "</table>";
    html += "<center>已登陆宠物联赛的宠物一览";

    const leftHtml = StringUtils.substringAfter(PageUtils.currentPageHtml(), "<center>已登陆宠物联赛的宠物一览");

    $("body:first").html(html + leftHtml);

    new RoleLoader(credential).load()
        .then(role => {
            const src = DOMAIN + "/image/head/" + role.image;
            const imageHtml = "<img src='" + src + "' alt='' width='64' height='64' id='roleImage'>";
            MessageBoard.createMessageBoard("message_board_container", imageHtml);
            MessageBoard.resetMessageBoard("全新的宠物管理UI为您带来不一样的感受。");
        });
}

export = PersonalPetManagementProcessor;