import CastleInformationPageProcessor from "../../processor/internal/CastleInformationPageProcessor";
import PageInterceptor from "../PageInterceptor";

class CastleInformationPageInterceptor implements PageInterceptor {

    readonly #processor = new CastleInformationPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle_print.cgi") {
            return pageText.includes("城堡商业度");
        }
        return false;
    }

    intercept(): void {
        this.#processor.process();
    }

}

export = CastleInformationPageInterceptor;