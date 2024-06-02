class BattleFieldThreshold {

    a?: number;
    b?: number;
    c?: number;
    forceSenior?: boolean;

    asDocument(): {} {
        const document = {};
        // @ts-ignore
        document["a"] = this.a;
        // @ts-ignore
        document["b"] = this.b;
        // @ts-ignore
        document["c"] = this.c;
        // @ts-ignore
        document["forceSenior"] = this.forceSenior;
        return document;
    }

    static defaultInstance(): BattleFieldThreshold {
        const inst = new BattleFieldThreshold();
        inst.a = 100;
        inst.b = 300;
        inst.c = 500;
        inst.forceSenior = false;
        return inst;
    }
}

export = BattleFieldThreshold;