import Credential from "../../util/Credential";

abstract class CredentialSupport {

    readonly credential: Credential;

    protected constructor(credential: Credential) {
        this.credential = credential;
    }

}

export {CredentialSupport};