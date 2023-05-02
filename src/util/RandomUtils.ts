class RandomUtils {

    static randomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static randomElement<T>(list: T[]): T | null {
        if (list.length === 0) {
            return null;
        }
        if (list.length === 1) {
            return list[0];
        }
        const idx = RandomUtils.randomInt(0, list.length - 1);
        return list[idx];
    }
}

export = RandomUtils;