class TaskGuide {

    id?: string;
    task?: string;
    createTime?: number;

    asDocument() {
        const document = {};
        // @ts-ignore
        this.id && (document.id = this.id);
        // @ts-ignore
        this.task && (document.task = this.task);
        // @ts-ignore
        (this.createTime !== undefined) && (document.createTime = this.createTime);
        return document;
    }
}

export = TaskGuide;