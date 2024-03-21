class BattleFieldThreshold {

    a?: number;
    b?: number;
    c?: number;

    static defaultInstance(): BattleFieldThreshold {
        const inst = new BattleFieldThreshold();
        inst.a = 100;
        inst.b = 300;
        inst.c = 500;
        return inst;
    }
}

export = BattleFieldThreshold;