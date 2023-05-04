import Processor from "../Processor";

class CastleRanchProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi") {
            return pageText.includes("＜＜　|||　城堡牧场　|||　＞＞");
        }
        return false;
    }

    process(): void {
    }

}

export = CastleRanchProcessor;