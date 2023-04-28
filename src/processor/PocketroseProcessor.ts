abstract class PocketroseProcessor {

    readonly pageHtml: string;
    readonly pageText: string;

    constructor(pageHtml: string, pageText: string) {
        this.pageHtml = pageHtml;
        this.pageText = pageText;
    }
}

export = PocketroseProcessor;