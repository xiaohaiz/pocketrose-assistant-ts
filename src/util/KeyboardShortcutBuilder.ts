/**
 * ----------------------------------------------------------------------------
 * 创建键盘快捷键的支持。
 * ----------------------------------------------------------------------------
 */
class KeyboardShortcutBuilder {

    readonly #handlerBuffer = new Map<string, () => void>;

    onKeyPressed(key: string, handler?: () => void): KeyboardShortcutBuilder {
        if (handler) {
            this.#handlerBuffer.set(key, handler);
        }
        return this;
    }

    bind() {
        $(document).off("keydown.city").on("keydown.city", event => {
            const key = event.key;
            if (!key) return;
            const handler = this.#handlerBuffer.get(key);
            if (!handler) return;
            handler();
        });
    }

}

export = KeyboardShortcutBuilder;