import NpcLoader from "../../core/NpcLoader";
import CommentBoard from "../../util/CommentBoard";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

abstract class AbstractPersonalSalaryPageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext) {

        const pageText = $("body:first").text();
        if (pageText.includes("下次领取俸禄还需要等待")) {
            // 没有到领取俸禄的时间
            $("form").remove();
            $("#ueqtweixin").remove();

            $("hr:last").after($("<div></div>"));
            const imageHtml = NpcLoader.getNpcImageHtml("花子")!;
            CommentBoard.createCommentBoard(imageHtml);
            $("#commentBoard")
                .css("background-color", "black")
                .css("color", "wheat")
                .css("font-size", "120%")
                .css("font-weight", "bold")
                .html("害我也白跑一趟，晦气！");

            let html = "";
            html += "<div id='hiddenFormContainer' style='display:none'></div>";
            html += "<div id='menuContainer'></div>";
            $("p:last").html(html);
            this.doGenerateHiddenForm("hiddenFormContainer", credential);

            $("#menuContainer").html("<input type='button' id='returnButton' value='返回'>");
            this.doBindReturnButton(context);
        } else {
            // 成功领取了俸禄
            const imageHtml = NpcLoader.getNpcImageHtml("花子")!;
            CommentBoard.createCommentBoard(imageHtml);
            $("#commentBoard")
                .css("background-color", "black")
                .css("color", "wheat")
                .css("font-size", "120%")
                .css("font-weight", "bold")
                .html("打、打、打劫。不许笑，我跟这儿打劫呢。IC、IP、IQ卡，通通告诉我密码！");

            $("form").remove();
            let html = "";
            html += "<div id='hiddenFormContainer' style='display:none'></div>";
            html += "<div id='menuContainer'></div>";
            $("p:last").html(html);
            this.doGenerateHiddenForm("hiddenFormContainer", credential);

            $("#menuContainer").html("<input type='button' id='returnButton' value='返回'>");
            this.doBindDepositButton(credential, context);
        }

    }

    abstract doGenerateHiddenForm(containerId: string, credential: Credential): void;

    abstract doBindReturnButton(context?: PageProcessorContext): void;

    abstract doBindDepositButton(credential: Credential, context?: PageProcessorContext): void;
}

export = AbstractPersonalSalaryPageProcessor;