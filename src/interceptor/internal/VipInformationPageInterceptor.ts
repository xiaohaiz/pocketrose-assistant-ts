import PageInterceptor from "../PageInterceptor";
import VipInformationPageProcessor from "../../processor/stateless/VipInformationPageProcessor";

class VipInformationPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "viplist.cgi") {
            return pageText.includes("全VIP画像一览");
        }
        return false;
    }

    intercept(): void {
        new VipInformationPageProcessor().process();
    }


}

export = VipInformationPageInterceptor;