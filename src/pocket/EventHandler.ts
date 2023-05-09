import Town from "../core/Town";
import TownLoader from "../core/TownLoader";
import Coordinate from "../util/Coordinate";
import PageUtils from "../util/PageUtils";
import StringUtils from "../util/StringUtils";

class EventHandler {

    static handleWithEventHtml(eventHtml: string): string {
        if (eventHtml.includes("[萝莉失踪]")) {
            const eventText = PageUtils.convertHtmlToText(eventHtml);
            const secret = StringUtils.substringBetween(eventText,
                "[萝莉失踪]据说在印有", "描述的城市附近有萝莉失踪！");
            return doProcessRescueHostage(eventHtml, eventText, secret);
        }
        if (eventHtml.includes("[正太失踪]")) {
            const eventText = PageUtils.convertHtmlToText(eventHtml);
            const secret = StringUtils.substringBetween(eventText,
                "[正太失踪]据说在印有", "描述的城市附近有正太失踪！");
            return doProcessRescueHostage(eventHtml, eventText, secret);
        }
        return eventHtml;
    }

}

function doProcessRescueHostage(eventHtml: string,
                                eventText: string,
                                secret: string): string {
    const candidates = doFindTownBySecret(secret);
    let recommendation = "";
    if (candidates.length === 0) {
        recommendation = "没有发现推荐的城市？检查一下城市字典吧，密字[" + secret + "]。";
    } else {
        recommendation = "可能失踪的城市是：";
        for (let i = 0; i < candidates.length; i++) {
            const town = candidates[i];
            recommendation += "<b style='color:red'>" + town.name + "</b>";
            recommendation += doGenerateSuspectCoordinate(town);
            if (i !== candidates.length - 1) {
                recommendation += "，";
            } else {
                recommendation += "。";
            }
        }
    }
    let p1 = StringUtils.substringBefore(eventHtml, "失踪！");
    let p2 = "失踪！";
    let p3 = StringUtils.substringAfter(eventHtml, "失踪！");
    return p1 + p2 + recommendation + p3;
}

function doFindTownBySecret(secret: string): Town[] {
    const candidates: Town[] = [];
    for (const town of TownLoader.getTownList()) {
        if (town.description.includes(secret)) {
            candidates.push(town);
        }
    }
    return candidates;
}

function doGenerateSuspectCoordinate(town: Town) {
    const locations = [];
    locations.push(new Coordinate(town.coordinate.x, town.coordinate.y + 1));
    locations.push(new Coordinate(town.coordinate.x, town.coordinate.y - 1));
    locations.push(new Coordinate(town.coordinate.x - 1, town.coordinate.y));
    locations.push(new Coordinate(town.coordinate.x + 1, town.coordinate.y));
    let s = "";
    for (const location of locations) {
        if (location.isAvailable) {
            s += location.asText();
        }
    }
    return "<span style='color:blue'>" + s + "</span>";
}

export = EventHandler;