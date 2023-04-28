import PocketroseProcessor from "../PocketroseProcessor";
import PageUtils from "../../util/PageUtils";
import SetupLoader from "../../pocket/SetupLoader";

class BattleProcessor extends PocketroseProcessor {

    process(): void {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();

        $('input[value="返回住宿"]').attr('id', 'lodgeButton');
        $('input[value="返回修理"]').attr('id', 'repairButton');
        $('input[value="返回城市"]').attr('id', 'returnButton');
        $('input[value="返回更新"]').attr('id', 'updateButton');
        $('input[value="返回银行"]').attr('id', 'depositButton');

        // 删除返回更新按钮所在的整个表单
        $('#updateButton').parent().remove();

        // 根据设置的内容修改按钮的台词
        let buttonText = SetupLoader.getBattleReturnButtonText();
        if (buttonText !== "") {
            $("#returnButton").val(buttonText);
        }
        buttonText = SetupLoader.getBattleLodgeButtonText();
        if (buttonText !== "") {
            $("#lodgeButton").val(buttonText);
        }
        buttonText = SetupLoader.getBattleRepairButtonText();
        if (buttonText !== "") {
            $("#repairButton").val(buttonText);
        }
        buttonText = SetupLoader.getBattleDepositButtonText();
        if (buttonText !== "") {
            $("#depositButton").val(buttonText);
        }

        // 修改返回修理按钮的行为，直接变成全部修理
        $('#repairButton').parent().prepend($('<input type="hidden" name="arm_mode" value="all">'));
        $('input[value="MY_ARM"]').attr('value', 'MY_ARM2');

        // 修改返回银行按钮的行为，直接变成全部存入
        $('#depositButton').parent().prepend($('<input type="hidden" name="azukeru" value="all">'));
        $('input[value="BANK"]').attr('value', 'BANK_SELL');


        doPostBattle(this.pageText);
    }
}

function doPostBattle(pageText: string): void {

}

export = BattleProcessor;