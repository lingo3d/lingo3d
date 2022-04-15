import { html, LitElement } from "lit"
import { customElement } from "lit/decorators.js"
import { createRef, Ref } from "lit/directives/ref.js"
import { Pane } from "tweakpane"

@customElement("lingo3d-editor")
export default class Editor extends LitElement {
    private containerRef: Ref<HTMLInputElement> = createRef()

    protected override firstUpdated() {
        const container = this.containerRef.value
        if (!container) return

        console.log(container)
    }

    protected override render() {
        console.log("here")

        return html`<div ref=${this.containerRef} />`
    }
}