class Credential {

    readonly id: string;
    readonly pass: string;

    constructor(id: string, pass: string) {
        this.id = id;
        this.pass = pass;
    }

    asRequest() {
        return {"id": this.id, "pass": this.pass};
    }

    asRequestMap() {
        const request = new Map<string, string>();
        request.set("id", this.id);
        request.set("pass", this.pass);
        return request;
    }

    static newInstance(): Credential | undefined {
        const id = $("input:hidden[name='id']:last").val();
        const pass = $("input:hidden[name='pass']:last").val();
        if (id === undefined || pass === undefined) {
            return undefined;
        }
        return new Credential(id.toString(), pass.toString());
    }
}

export = Credential;