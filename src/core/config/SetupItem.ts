interface SetupItem {

    category(): string;

    code(): string;

    render(id?: string, extension?: {}): void

}

export = SetupItem;