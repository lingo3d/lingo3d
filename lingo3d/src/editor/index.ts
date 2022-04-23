import { html, LitElement } from "lit"
import { customElement } from "lit/decorators.js"
import { createRef, ref, Ref } from "lit/directives/ref.js"
import { Pane } from "tweakpane"

@customElement("lingo3d-editor")
export default class Editor extends LitElement {
    private containerRef: Ref<HTMLInputElement> = createRef()

    protected override firstUpdated() {
        const container = this.containerRef.value
        if (!container) return

        const PARAMS = {
            factor: 123,
            title: 'hello',
            color: '#ff0055',
        }
          
        const pane = new Pane()
        
        pane.addInput(PARAMS, 'factor')
        pane.addInput(PARAMS, 'title')
        pane.addInput(PARAMS, 'color')
    }

    protected override render() {
        return html`<div ref=${ref(this.containerRef)} />`
    }
}