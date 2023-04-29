class Credential {

    readonly id: string;
    readonly pass: string;

    constructor(id: string, pass: string) {
        this.id = id;
        this.pass = pass;
    }

    asRequest(): {} {
        return {"id": this.id, "pass": this.pass};
    }

}

export = Credential;