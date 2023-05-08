import PageInterceptor from "../PageInterceptor";

class PersonalSalaryPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("领取了") || pageText.includes("下次领取俸禄还需要等待");
        }
        return false;
    }

    intercept(): void {
    }

}

export = PersonalSalaryPageInterceptor;