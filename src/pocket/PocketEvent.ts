import {PocketLogger} from "./PocketLogger";

const logger = PocketLogger.getLogger("EVENT");

class PocketEvent {

    static newMouseClickHandler(): MouseClickHandler {
        return new MouseClickHandler();
    }
}

class MouseClickHandler {

    private count: number = 0;

    threshold?: number;
    handler?: () => void;

    async onMouseClicked() {
        this.count++;

        if (this.threshold !== undefined && this.threshold > 0) {
            if (this.count >= this.threshold) {
                (this.handler) && (this.handler());
                return;
            }
        }

        if (this.count === 1 || this.count === 2) {
            logger.info("这里什么都没有。");
        }
        if (this.count === 3) {
            logger.info("这里真的什么都没有。");
        }
        if (this.count >= 4) {
            logger.info("别点了，真的没有，求放过。")
        }
    }
}

export {PocketEvent, MouseClickHandler}