/**
 * The smallest Chrome DevTools Protocol client that drives a Foundry page: no dependency, Node's own
 * `WebSocket` and `fetch`.
 *
 * It exists for what chrome-devtools MCP cannot send. That server's `click`, `hover` and `drag` take an
 * element from a page snapshot, never a point, and an aimed area is confirmed at a point on the canvas.
 * `Input.dispatchMouseEvent` is the browser's own input pipeline: the page receives trusted events
 * (`isTrusted: true`), the same kind a hand on a mouse produces.
 */

const DEFAULT_CDP = "http://127.0.0.1:9222";

export class Page {
    #socket;
    #next = 1;
    #pending = new Map();

    constructor(socket) {
        this.#socket = socket;
        socket.addEventListener("message", (event) => {
            const message = JSON.parse(event.data);
            const waiter = this.#pending.get(message.id);
            if (!waiter) return;
            this.#pending.delete(message.id);
            if (message.error) waiter.reject(new Error(`${message.error.message} (${message.error.code})`));
            else waiter.resolve(message.result);
        });
    }

    /**
     * Attach to the first page whose URL matches. Several clients may attach to one page at once, so this
     * coexists with chrome-devtools MCP on the same Chrome.
     */
    static async connect({ cdp = DEFAULT_CDP, match = /\/game\b/ } = {}) {
        const targets = await (await fetch(`${cdp}/json/list`)).json();
        const target = targets.find((t) => t.type === "page" && match.test(t.url));
        if (!target) {
            const seen = targets.filter((t) => t.type === "page").map((t) => t.url).join(", ") || "none";
            throw new Error(`no page matching ${match} on ${cdp} (pages: ${seen})`);
        }
        const socket = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise((resolve, reject) => {
            socket.addEventListener("open", resolve, { once: true });
            socket.addEventListener("error", () => reject(new Error(`could not attach to ${target.url}`)), { once: true });
        });
        return new Page(socket);
    }

    send(method, params = {}) {
        const id = this.#next++;
        this.#socket.send(JSON.stringify({ id, method, params }));
        return new Promise((resolve, reject) => this.#pending.set(id, { resolve, reject }));
    }

    /** Evaluate an expression in the page and return its value; a thrown error is rethrown here. */
    async eval(expression) {
        const { result, exceptionDetails } = await this.send("Runtime.evaluate", {
            expression, awaitPromise: true, returnByValue: true,
        });
        if (exceptionDetails) {
            throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
        }
        return result.value;
    }

    /** Resolve after the page has painted `frames` times, so an input has been seen before the next. */
    frames(frames = 2) {
        return this.eval(`new Promise((r) => { let n = ${frames};
            const tick = () => (--n > 0 ? requestAnimationFrame(tick) : r(true)); requestAnimationFrame(tick); })`);
    }

    /** A trusted mouse event at CSS pixel `(x, y)`. `modifiers` is CDP's bit field: Shift is 8. */
    mouse(type, x, y, { button = "left", modifiers = 0, deltaY = 0 } = {}) {
        const pressed = type === "mousePressed" || type === "mouseReleased";
        return this.send("Input.dispatchMouseEvent", {
            type, x, y, modifiers, deltaX: 0, deltaY,
            button: pressed ? button : "none",
            buttons: type === "mousePressed" ? 1 : 0,
            clickCount: pressed ? 1 : 0,
            pointerType: "mouse",
        });
    }

    async click(x, y) {
        await this.mouse("mousePressed", x, y);
        await this.mouse("mouseReleased", x, y);
    }

    async screenshot() {
        const { data } = await this.send("Page.captureScreenshot", { format: "png" });
        return Buffer.from(data, "base64");
    }

    close() {
        this.#socket.close();
    }
}
