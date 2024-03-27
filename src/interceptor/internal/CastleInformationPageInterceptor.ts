import CastleInformationPageProcessor from "../../processor/internal/CastleInformationPageProcessor";
import PageInterceptor from "../PageInterceptor";

class CastleInformationPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle_print.cgi") {
            return pageText.includes("城堡商业度");
        }
        return false;
    }

    intercept(): void {
        new CastleInformationPageProcessor().process();
    }

}

export = CastleInformationPageInterceptor;