import Credential from "./Credential";
import TownDashboardLayoutManager from "../core/dashboard/TownDashboardLayoutManager";

class MouseClickEventBuilder {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    bind(elements: JQuery, handler: (target: HTMLElement) => void) {
        if (elements.length === 0) return;
        const configId = TownDashboardLayoutManager.loadDashboardLayoutConfigId(this.#credential);
        const doubleClick = (configId !== 6); // None mobile layout, use double click
        const events = doubleClick ? "dblclick" : "click";
        elements.on(events, event => {
            handler(event.target);
        });
    }

}

export = MouseClickEventBuilder;