interface SetupItem {

    category(): string;

    code(): string;

    accept(id?: string): boolean;

    render(id?: string): void

}

export = SetupItem;