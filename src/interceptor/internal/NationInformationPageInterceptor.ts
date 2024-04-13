import NationalInformationPageProcessor from "../../processor/stateless/NationalInformationPageProcessor";
import PageInterceptor from "../PageInterceptor";

class NationInformationPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "map.cgi") {
            return pageText.includes("各国资料");
        }
        return false;
    }

    intercept(): void {
        new NationalInformationPageProcessor().process();
    }

}

export = NationInformationPageInterceptor;