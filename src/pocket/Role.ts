export = Role;

class Role {
    name?: string;               // 姓名
    race?: string;
    gender?: string;
    level?: number;              // 等级
    country?: string;
    unit?: string;
    image?: string;
    health?: number;
    maxHealth?: number;
    mana?: number;
    maxMana?: number;
    spell?: string;
    attack?: number;
    defense?: number;
    specialAttack?: number;
    specialDefense?: number;
    speed?: number;
    pet?: string;
    attribute?: string;
    location?: string;           // 所在位置(TOWN|CASTLE|WILD)
    coordinate?: string;         // 所在坐标(location=CASTLE)
    castleName?: string;         // 城堡名称(location=CASTLE)
    townName?: string;           // 城市名称(location=TOWN)
    task?: string;
    experience?: number;
    cash?: number;
    career?: string;
    masterCareerList?: [string?];
    treasureList?: [string?];

    asShortText(): string {
        return this.name + " " + this.level +
            " " + this.health + "/" + this.maxHealth +
            " " + this.mana + "/" + this.maxMana +
            " " + this.attack +
            " " + this.defense +
            " " + this.specialAttack +
            " " + this.specialDefense +
            " " + this.speed;
    }
}