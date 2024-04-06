class EquipmentProfile {

    name: string;
    category: string;
    power: number;
    weight: number;
    maxEndure: number;
    holeCount: number;
    canSell: boolean;
    canRepair: boolean;
    canSend: boolean;
    canConsecrate: boolean;

    constructor(name: string,
                category: string,
                power: number,
                weight: number,
                maxEndure: number,
                holeCount: number,
                canSell: boolean,
                canRepair: boolean,
                canSend: boolean,
                canConsecrate: boolean) {
        this.name = name;
        this.category = category;
        this.power = power;
        this.weight = weight;
        this.maxEndure = maxEndure;
        this.holeCount = holeCount;
        this.canSell = canSell;
        this.canRepair = canRepair;
        this.canSend = canSend;
        this.canConsecrate = canConsecrate;
    }
}

export = EquipmentProfile;