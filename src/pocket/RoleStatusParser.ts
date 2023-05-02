import RoleStatus from "./RoleStatus";

class RoleStatusParser {

    static parseRoleStatus(pageHtml: string) {
        const status = new RoleStatus();
        const text = $(pageHtml).text();
        status.canConsecrate = text.includes("可以进行下次祭奠了");
        return status;
    }

}

export = RoleStatusParser;
