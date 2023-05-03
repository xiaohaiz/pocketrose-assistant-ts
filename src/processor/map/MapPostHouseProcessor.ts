import Processor from "../Processor";

class MapPostHouseProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "map.cgi") {
            return pageText.includes("＜＜住所＞＞");
        }
        return false;
    }

    process(): void {
    }

}

export = MapPostHouseProcessor;