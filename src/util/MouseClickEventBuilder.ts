import SetupLoader from "../core/config/SetupLoader";

class MouseClickEventBuilder {

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