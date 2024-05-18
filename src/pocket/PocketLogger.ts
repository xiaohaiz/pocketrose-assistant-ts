import SetupLoader from "../setup/SetupLoader";
import MessageBoard from "../util/MessageBoard";

class PocketLogger {

    private static buffer = new Map<string, Logger>();

    static getLogger(category: string): Logger {
        let logger = this.buffer.get(category);
        if (!logger) {
            logger = new Logger(category);
            this.buffer.set(category, logger);
        }
        return logger!;
    }

}

class Logger {

    private readonly category: string;

    constructor(category: string) {
        this.category = category;
    }

    get isDebugEnabled(): boolean {
        return SetupLoader.isDebugModeEnabled();
    }

    debug(message: string, durationInMillis?: number) {
        if (!this.isDebugEnabled) return;
        let msg = "[" + this.category + "] - " + message;
        if (durationInMillis !== undefined) msg += " (" + durationInMillis + "ms spent)";
        MessageBoard.publishMessage("<span style='color:lightgrey'>" + msg + "</span>");
    }

    info(message: string) {
        MessageBoard.publishMessage(message);
    }

    warn(message: string) {
        MessageBoard.publishWarning(message);
    }
}

export {PocketLogger, Logger};