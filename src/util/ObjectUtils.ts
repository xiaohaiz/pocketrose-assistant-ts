class ObjectUtils {

    static convertMapToObject(map: Map<string, string>) {
        const result = {};
        map.forEach(function (value, key) {
            // @ts-ignore
            result[key] = value;
        });
        return result;
    }

}

export = ObjectUtils;