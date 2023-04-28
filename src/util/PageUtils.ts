class PageUtils {

    static currentPageHtml(): string {
        return $("body:first").html();
    }

    static currentPageText(): string {
        return $("body:first").text();
    }

}