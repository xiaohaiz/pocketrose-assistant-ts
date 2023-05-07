import PageInterceptor from "./PageInterceptor";

class PageInterceptorManager {

    readonly #interceptors: PageInterceptor[]

    constructor() {
        this.#interceptors = [];
    }

    lookupInterceptor(cgi: string): PageInterceptor | null {
        const pageText = $("body:first").text();
        for (const interceptor of this.#interceptors) {
            if (interceptor.accept(cgi, pageText)) {
                return interceptor;
            }
        }
        return null;
    }

}

export = PageInterceptorManager;