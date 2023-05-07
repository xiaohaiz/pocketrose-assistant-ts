abstract class AbstractPersonalStatusProcessor {

    process() {
        this.doProcess();
    }

    abstract doProcess(): void;

}

export = AbstractPersonalStatusProcessor;