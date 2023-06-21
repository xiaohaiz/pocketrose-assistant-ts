class TaskGuide {

    id?: string;
    task?: string;
    createTime?: number;

    asDocument() {
        const document = {};
        // @ts-ignore
        thid.id && (document.id = this.id);
        // @ts-ignore
        thid.task && (document.task = this.task);
        // @ts-ignore
        (this.createTime !== undefined) && (document.createTime = this.createTime);
        return document;
    }
}

export = TaskGuide;