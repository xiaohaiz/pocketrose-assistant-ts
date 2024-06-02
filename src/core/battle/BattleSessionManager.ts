import SetupLoader from "../../setup/SetupLoader";
import {PocketLogger} from "../../pocket/PocketLogger";
import {BattleButtonProcessor} from "./BattleButtonProcessor";

const logger = PocketLogger.getLogger("SESSION");
const MAX_SESSION_COUNT = 10;

class BattleSessionManager {

    private readonly sessions: BattleSession[] = [];
    private lastScanTime: number = Date.now();
    doRefresh?: () => void;

    private readonly buttonProcessor: BattleButtonProcessor;

    constructor(buttonProcessor: BattleButtonProcessor) {
        this.buttonProcessor = buttonProcessor;
    }

    async touch(sessionId: string) {
        let session = this.sessions.find(it => it.sessionId === sessionId);
        if (session) {
            logger.debug("Battle session id already touched, ignore: " + sessionId);
            return;
        }
        session = new BattleSession(sessionId, Date.now());
        this.sessions.unshift(session);
        logger.debug("Battle session id touched: " + sessionId);
        if (this.sessions.length > MAX_SESSION_COUNT) {
            this.sessions.length = MAX_SESSION_COUNT;
            logger.debug("Reset battle session pool size to " + MAX_SESSION_COUNT);
        }
    }

    trigger(date: Date) {
        const time = date.getTime();
        const delta = time - this.lastScanTime;
        if (delta >= 10000) {
            this.lastScanTime = time;
            if (this.checkScanPermission(date)) {
                this.scanBattleSessions();
            }
        }
    }

    async dispose() {
    }

    private scanBattleSessions() {
        if (this.sessions.length > 0) {
            const session = this.sessions[0];
            const duration = Date.now() - session.epochMillis;
            if (duration >= 150000) {
                logger.debug("Last battle session expired: " + session.sessionId + " duration: " + duration + "ms");
                this.buttonProcessor.battleButtonTextColor = "blue";
                $("#battleButton").hide();
                (this.doRefresh) && (this.doRefresh());
            }
        }
    }

    private checkScanPermission(date: Date): boolean {
        if (!SetupLoader.isConfirmAutoRefreshExpiredSessionRiskEnabled()) {
            return false;
        }
        if (!SetupLoader.isAutoRefreshWhenBattleSessionExpiredEnabled()) {
            return false;
        }
        const day = date.getDay();
        if (!(day >= 1 && day <= 5)) {
            // 限时启动，周一到周五
            return false;
        }
        const hours = date.getHours();
        // 限时启动，9点到18点
        return hours >= 9 && hours < 18;
    }
}

class BattleSession {

    sessionId: string;
    epochMillis: number;

    constructor(sessionId: string, epochMillis: number) {
        this.sessionId = sessionId;
        this.epochMillis = epochMillis;
    }

}

export {BattleSessionManager};