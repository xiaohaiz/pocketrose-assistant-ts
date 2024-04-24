interface SetupItem {

    category(): string;

    code(): string;

    accept(id?: string): boolean;

    render(id?: string, extension?: {}): void

}

export = SetupItem;