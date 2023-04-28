export = StatusRequestInterceptor;

class StatusRequestInterceptor implements RequestInterceptor {

    readonly cgi: string = "status.cgi";

    process(): void {
    }

}