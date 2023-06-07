import FastLogin from "../../common/FastLogin";
import FastLoginLoader from "./FastLoginLoader";

class FastLoginManager {

    static getAllFastLogins() {
        const configs: FastLogin[] = [];
        for (let i = 0; i < 50; i++) {
            const config = FastLoginLoader.loadFastLogin(i);
            if (config !== null) {
                configs.push(config);
            }
        }
        return configs;
    }

}

export = FastLoginManager;