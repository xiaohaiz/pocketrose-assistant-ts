import TravelPlan from "./TravelPlan";
import Coordinate from "../util/Coordinate";
import MessageBoard from "../util/MessageBoard";
import Credential from "../util/Credential";
import TimeoutUtils from "../util/TimeoutUtils";
import NetworkUtils from "../util/NetworkUtils";
import TownLoader from "./TownLoader";

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

                doMoveOnPath(
                    plan.credential!,
                    pathList,
                    0,
                    function () {
                        resolve();
                    }
                );
            });
        };
        return await action(this.#plan);
    }

}

function doMoveOnPath(credential: Credential, pathList: Coordinate[], index: number, callback: () => void) {
    if (pathList.length === 1 || index === pathList.length - 1) {
        // 路径中只有一个点，表示起点和终点是一个点，直接结束
        // 已经移动到最后一个点
        callback();
    } else {
        MessageBoard.publishMessage("等待移动冷却中......(约55秒)");
        TimeoutUtils.execute(55000, function () {
            const from = pathList[index];
            const to = pathList[index + 1];

            const direction = calculateDirection(from, to);
            const distance = calculateDistance(from, to);

            const request = credential.asRequest();
            // @ts-ignore
            request["con"] = "2";
            // @ts-ignore
            request["navi"] = "on";
            // @ts-ignore
            request["mode"] = "CHARA_MOVE";
            // @ts-ignore
            request["direct"] = escape(direction);
            // @ts-ignore
            request["chara_m"] = distance;
            NetworkUtils.sendPostRequest("map.cgi", request, function () {
                MessageBoard.publishMessage("<span style='color:greenyellow'>" + direction + "</span>移动" + distance + "格，到达" + to.asText() + "。");

                if ($("#roleLocation").length > 0) {
                    let roleLocation = to.asText();
                    const town = TownLoader.getTownByCoordinate(to);
                    if (town !== null) {
                        roleLocation = town.name + " " + roleLocation;
                    }
                    $("#roleLocation").text(roleLocation);
                }

                doMoveOnPath(credential, pathList, index + 1, callback);
            });
        });
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

function calculateDirection(from: Coordinate, to: Coordinate): string {
    const x1 = from.x;
    const y1 = from.y;
    const x2 = to.x;
    const y2 = to.y;

    let direction = "";
    if (x1 === x2) {
        // 上或者下
        if (y2 > y1) {
            direction = "↑";
        } else {
            direction = "↓";
        }
    } else if (y1 === y2) {
        // 左或者右
        if (x2 > x1) {
            direction = "→";
        } else {
            direction = "←";
        }
    } else {
        // 4种斜向移动
        if (x2 > x1 && y2 > y1) {
            direction = "↗";
        }
        if (x2 > x1 && y2 < y1) {
            direction = "↘";
        }
        if (x2 < x1 && y2 > y1) {
            direction = "↖";
        }
        if (x2 < x1 && y2 < y1) {
            direction = "↙";
        }
    }

    return direction;
}

function calculateDistance(from: Coordinate, to: Coordinate) {
    const x1 = from.x;
    const y1 = from.y;
    const x2 = to.x;
    const y2 = to.y;
    return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
}

export = TravelPlanExecutor;