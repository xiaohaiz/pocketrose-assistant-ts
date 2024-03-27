import RoleInformationPageProcessor from "../../processor/internal/RoleInformationPageProcessor";
import PageInterceptor from "../PageInterceptor";

class RoleInformationPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "ranking.cgi") {
            return pageText.includes("＜＜ 　 - 武将一览 - 　 ＞＞");
        }
        return false;
    }

    intercept(): void {
        new RoleInformationPageProcessor().process();
    }

}

export = RoleInformationPageInterceptor;