/**
 * ----------------------------------------------------------------------------
 * 创建键盘快捷键的支持。
 * ----------------------------------------------------------------------------
 */
class KeyboardShortcutBuilder {

    readonly #handlerBuffer = new Map<string, () => void>;
    #predicate?: (key: string) => boolean;

    static newInstance(): KeyboardShortcutBuilder {
        return new KeyboardShortcutBuilder();
    }

    onKeyPressed(key: string, handler?: () => void): KeyboardShortcutBuilder {
        if (handler) {
            this.#handlerBuffer.set(key, handler);
        }
        return this;
    }

    onEscapePressed(handler?: () => void): KeyboardShortcutBuilder {
        return this.onKeyPressed("Escape", handler);
    }

    withPredicate(predicate?: (key: string) => boolean): KeyboardShortcutBuilder {
        this.#predicate = predicate;
        return this;
    }

    withDefaultPredicate(): KeyboardShortcutBuilder {
        return this.withPredicate(() =>
            $("input:text:focus").length === 0 && $("textarea:focus").length === 0
        );
    }

    #controlPressed?: boolean;

    bind() {
        $(document).off("keydown.city").on("keydown.city", event => {
            const key = event.key;
            if (!key) return;
            if (this.#predicate && !this.#predicate(key)) return;

            if (key === "Control") {
                this.#controlPressed = true;
            } else {
                if (this.#controlPressed) {
                    this.#controlPressed = false;
                    return;
                }
            }

            const handler = this.#handlerBuffer.get(key);
            if (!handler) return;
            handler();
        });
    }

}

export = KeyboardShortcutBuilder;