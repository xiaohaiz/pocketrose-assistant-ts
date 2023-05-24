import RoleInformationPageProcessor from "../../processor/internal/RoleInformationPageProcessor";
import PageInterceptor from "../PageInterceptor";

class RoleInformationPageInterceptor implements PageInterceptor {

    readonly #processor = new RoleInformationPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "ranking.cgi") {
            return pageText.includes("＜＜ 　 - 武将一览 - 　 ＞＞");
        }
        return false;
    }

    intercept(): void {
        this.#processor.process();
    }

}

export = RoleInformationPageInterceptor;