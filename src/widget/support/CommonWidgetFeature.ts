import OperationMessage from "../../util/OperationMessage";
import MessageBoard from "../../util/MessageBoard";

abstract class CommonWidgetFeature {

    onMessage?: (s: string) => void = s => MessageBoard.publishMessage(s);
    onWarning?: (s: string) => void = s => MessageBoard.publishWarning(s);
    onRefresh?: (message: OperationMessage) => void;

    publishMessage(s: string) {
        (this.onMessage) && (this.onMessage(s));
    }

    publishWarning(s: string) {
        (this.onWarning) && (this.onWarning(s));
    }

    publishRefresh(message: OperationMessage): void {
        (this.onRefresh) && (this.onRefresh(message));
    }

}

export {CommonWidgetFeature};