interface RequestInterceptor {

    readonly cgi: string

    process(): void

}