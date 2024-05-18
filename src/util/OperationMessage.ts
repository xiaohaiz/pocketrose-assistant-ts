class OperationMessage {

    readonly extensions = new Map<string, any>();

    success?: boolean;

    doRefresh?: boolean;

    static newInstance(success: boolean): OperationMessage {
        return success ? OperationMessage.success() : OperationMessage.failure();
    }

    static success(): OperationMessage {
        const message = new OperationMessage();
        message.success = true;
        return message;
    }

    static failure(): OperationMessage {
        const message = new OperationMessage();
        message.success = false;
        return message;
    }
}

export = OperationMessage;