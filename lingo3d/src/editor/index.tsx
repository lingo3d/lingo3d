import LingoEditor from "./LingoEditor"
import { Disposable } from "@lincode/promiselikes"
import { render } from "preact"
import { unmountComponentAtNode } from "preact/compat"

export default class extends Disposable {
    public constructor() {
        super()

        const el = document.createElement("div")
        document.body.appendChild(el)

        render(<LingoEditor />, el)

        this.then(() => {
            el.remove()
            unmountComponentAtNode(el)
        })
    }
}
