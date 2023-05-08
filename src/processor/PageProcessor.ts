import PageProcessorContext from "./PageProcessorContext";

interface PageProcessor {

    process(context?: PageProcessorContext): void;

}

export = PageProcessor;