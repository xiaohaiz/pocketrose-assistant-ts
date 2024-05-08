import SetupLoader from "../core/config/SetupLoader";
import MessageBoard from "../util/MessageBoard";

class PocketLogger {

    static getLogger(category: string): Logger {
        return new Logger(category);
    }

}

class Logger {

    private readonly category: string;

    constructor(category: string) {
        this.category = category;
    }

    debug(message: string, durationInMillis?: number) {
        if (!SetupLoader.isDebugModeEnabled()) return;
        let msg = "[" + this.category + "] - " + message;
        if (durationInMillis !== undefined) msg += " (" + durationInMillis + "ms spent)";
        MessageBoard.publishMessage(msg);
    }

    info(message: string) {
        MessageBoard.publishMessage(message);
    }

    warn(message: string) {
        MessageBoard.publishWarning(message);
    }
}

export {PocketLogger, Logger};