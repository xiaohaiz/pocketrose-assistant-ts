class PersonalRequestInterceptor implements RequestInterceptor {

    readonly cgi: string = "mydata.cgi";

    process(): void {
        const pageText = PageUtils.currentPageText()
        if (pageText.includes("仙人的宝物")) {
            new PersonalStatus(PageUtils.currentPageHtml(), pageText).process();
        }
    }


}