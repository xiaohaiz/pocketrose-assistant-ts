import TravelPlan from "./TravelPlan";
import Coordinate from "../util/Coordinate";
import MessageBoard from "../util/MessageBoard";

class TravelPlanExecutor {

    readonly #plan: TravelPlan

    constructor(plan: TravelPlan) {
        this.#plan = plan;
    }

    async execute(): Promise<void> {
        const action = (plan: TravelPlan) => {
            return new Promise<void>(resolve => {
                const pathList = calculatePath(
                    plan.source!,
                    plan.destination!,
                    plan.scope!,
                    plan.mode!
                );
                if (pathList.length > 1) {
                    MessageBoard.publishMessage("旅途路径已经计算完毕，总共需要次移动" + (pathList.length - 1) + "步。");
                    let msg = "旅途路径规划：";
                    for (let i = 0; i < pathList.length; i++) {
                        let node = pathList[i];
                        msg += node.asText();
                        if (i !== pathList.length - 1) {
                            msg += "=>";
                        }
                    }
                    MessageBoard.publishMessage(msg);
                }

                resolve();
            });
        };
        return await action(this.#plan);
    }

}

function calculatePath(source: Coordinate, destination: Coordinate, scope: number, mode: string) {
    const pathList = [];
    if (source.equals(destination)) {
        pathList.push(source);
        return pathList;
    }
    const milestone = calculateMilestone(source, destination, mode);
    if (milestone !== undefined) {
        const p1 = calculateMilestonePath(source, milestone, scope);
        const p2 = calculateMilestonePath(milestone, destination, scope);
        pathList.push(...p1);
        pathList.push(...p2);
        pathList.push(destination);
    } else {
        const p = calculateMilestonePath(source, destination, scope);
        pathList.push(...p);
        pathList.push(destination);
    }
    return pathList;
}

function calculateMilestone(from: Coordinate, to: Coordinate, mode: string) {
    if (mode === "ROOK") {
        if (from.x === to.x || from.y === to.y) {
            return undefined;
        }
        return new Coordinate(from.x, to.y);
    }
    if (mode === "QUEEN") {
        if (from.x === to.x || from.y === to.y) {
            return undefined;
        }
        const xDelta = Math.abs(from.x - to.x);
        const yDelta = Math.abs(from.y - to.y);
        if (xDelta === yDelta) {
            return undefined;
        }
        const delta = Math.min(xDelta, yDelta);
        let x = from.x;
        let y = from.y;
        if (to.x > from.x) {
            x = x + delta;
        } else {
            x = x - delta;
        }
        if (to.y > from.y) {
            y = y + delta;
        } else {
            y = y - delta;
        }
        return new Coordinate(x, y);
    }
    return undefined;
}

function calculateMilestonePath(from: Coordinate, to: Coordinate, scope: number) {
    const nodeList = [];
    nodeList.push(from);
    if (from.x === to.x) {
        // 一条竖线上
        const step = Math.ceil(Math.abs(from.y - to.y) / scope);
        for (let i = 1; i <= step - 1; i++) {
            if (to.y > from.y) {
                nodeList.push(new Coordinate(from.x, from.y + (i * scope)));
            } else {
                nodeList.push(new Coordinate(from.x, from.y - (i * scope)));
            }
        }
    } else if (from.y === to.y) {
        // 一条横线上
        const step = Math.ceil(Math.abs(from.x - to.x) / scope);
        for (let i = 1; i <= step - 1; i++) {
            if (to.x > from.x) {
                nodeList.push(new Coordinate(from.x + (i * scope), from.y));
            } else {
                nodeList.push(new Coordinate(from.x - (i * scope), from.y));
            }
        }
    } else {
        // 一条斜线上
        const step = Math.ceil(Math.abs(from.x - to.x) / scope);
        for (let i = 1; i <= step - 1; i++) {
            let x = from.x;
            if (to.x > from.x) {
                x = x + (i * scope);
            } else {
                x = x - (i * scope);
            }
            let y = from.y;
            if (to.y > from.y) {
                y = y + (i * scope);
            } else {
                y = y - (i * scope);
            }
            nodeList.push(new Coordinate(x, y));
        }
    }
    return nodeList;
}

export = TravelPlanExecutor;