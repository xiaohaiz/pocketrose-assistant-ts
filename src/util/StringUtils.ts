export = StringUtils;

class StringUtils {
    static substringBefore(text: string, searchString: string): string {
        const idx = text.indexOf(searchString);
        if (idx === -1) {
            return text;
        }
        return text.substring(0, idx);
    }

    static substringAfter(text: string, searchString: string): string {
        const idx = text.indexOf(searchString);
        if (idx === -1) {
            return text;
        }
        return text.substring(idx + searchString.length);
    }

    static substringAfterLast(text: string, searchString: string): string {
        const idx = text.lastIndexOf(searchString);
        if (idx === -1) {
            return text;
        }
        return text.substring(idx + searchString.length);
    }

    static substringBetween(text: string, leftString: string, rightString: string): string {
        return StringUtils.substringBefore(StringUtils.substringAfter(text, leftString), rightString);
    }

    static substringBeforeSlash(text: string): string {
        if (text.includes(" /")) {
            return StringUtils.substringBefore(text, " /");
        }
        if (text.includes("/")) {
            return StringUtils.substringBefore(text, "/");
        }
        return text;
    }

    static substringAfterSlash(text: string): string {
        if (text.includes("/ ")) {
            return StringUtils.substringAfter(text, "/ ");
        }
        if (text.includes("/")) {
            return StringUtils.substringAfter(text, "/");
        }
        return text;
    }
}