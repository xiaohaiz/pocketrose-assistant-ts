interface Processor {

    accept(cgi: string, pageText: string): boolean;

    process(): void;

}

export = Processor;