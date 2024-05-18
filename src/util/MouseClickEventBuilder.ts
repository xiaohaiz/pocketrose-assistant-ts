import SetupLoader from "../setup/SetupLoader";

class MouseClickEventBuilder {

    private readonly handlerBuffer = new Map<string, (target: HTMLElement) => void>;

    static newInstance(): MouseClickEventBuilder {
        return new MouseClickEventBuilder();
    }

    onElementClicked(elementId: string, handler?: (target: HTMLElement) => void): MouseClickEventBuilder {
        if (handler) {
            this.handlerBuffer.set(elementId, handler);
        }
        return this;
    }

    doBind() {
        const doubleClick = !SetupLoader.isMobileTownDashboardEnabled();
        const event: string = doubleClick ? "dblclick" : "click";
        this.handlerBuffer.forEach((handler, elementId) => {
            const element = $("#" + elementId);
            if (element.length > 0) {
                element.on(event, e => {
                    handler(e.target);
                })
            }
        });
    }

    bind(elements: JQuery, handler: (target: HTMLElement) => void) {
        if (elements.length === 0) return;
        const doubleClick = !SetupLoader.isMobileTownDashboardEnabled();
        const events = doubleClick ? "dblclick" : "click";
        elements.on(events, event => {
            handler(event.target);
        });
    }

}

export = MouseClickEventBuilder;