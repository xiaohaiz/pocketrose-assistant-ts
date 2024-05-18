import PageInterceptor from "../PageInterceptor";
import SetupLoader from "../../setup/SetupLoader";
import {DevelopmentPageProcessor} from "../../processor/stateless/DevelopmentPageProcessor";

class DevelopmentPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        return cgi === "story.htm";
    }

    intercept(): void {
        if (SetupLoader.isDebugModeEnabled()) {
            new DevelopmentPageProcessor().process();
        }
    }


}

export {DevelopmentPageInterceptor};