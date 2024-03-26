interface SetupItem {

    category(): string;

    code(): string;

    render(id?: string): void

}

export = SetupItem;