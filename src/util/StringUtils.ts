class StringUtils {
    static substringAfterLast(text: string, searchString: string): string {
        const idx = text.lastIndexOf(searchString)
        if (idx === -1) {
            return text
        }
        return text.substring(idx + searchString.length)
    }
}