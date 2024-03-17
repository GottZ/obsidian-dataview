export class StyleProvider {
    private node: HTMLStyleElement;
    private styles: Map<string, string>;
    private waiting: boolean;
    private css: string;

    constructor(name: string) {
        this.node = document.createElement("style");
        this.node.setAttribute("type", "text/css");
        this.node.setAttribute("data-style-provider", name);
        this.styles = new Map();
        this.waiting = false;
        this.css = "";
        this.attach();
    }

    attach() {
        document.head.appendChild(this.node);
    }

    detach() {
        this.node.parentNode?.removeChild(this.node);
    }

    setStyle(name: string, style: string) {
        const old = this.styles.get(name);
        if (old === style) return;
        this.styles.set(name, style);
        this.updateStyles();
    }

    removeStyle(name: string) {
        this.styles.delete(name);
        this.updateStyles();
    }

    private updateStyles() {
        this.css = "";
        for (const [name, style] of this.styles) {
            this.css += `/* ${name}: */\n${style}\n\n`;
        }
        this.queueUpdate();
    }

    private queueUpdate = () => {
        if (this.waiting) return;
        this.waiting = true;
        requestAnimationFrame(() => {
            this.waiting = false;
            this.node.textContent = this.css.trimEnd();
        });
    };
}
