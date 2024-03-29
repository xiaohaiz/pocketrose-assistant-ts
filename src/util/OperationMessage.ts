class OperationMessage {

    success?: boolean;

    doRefresh?: boolean;

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