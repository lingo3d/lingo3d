import "./Editor"
import "./SceneGraph"
import "./Toolbar"
import "./Library"
import "./HUD"
import LingoEditor from "./LingoEditor"
import { Disposable } from "@lincode/promiselikes"
import { render } from "preact"
import { Reactive } from "@lincode/reactivity"

export default class extends Disposable {
    public constructor() {
        super()

        const el = document.createElement("div")
        document.body.appendChild(el)

        render(<LingoEditor />, el)

        this.then(() => {
            el.remove()
            render(undefined, el)
        })
    }
}
