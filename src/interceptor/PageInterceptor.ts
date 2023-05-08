interface PageInterceptor {

    accept(cgi: string, pageText: string): boolean;

    intercept(): void;

}

export = PageInterceptor;