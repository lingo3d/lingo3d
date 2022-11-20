import "./Editor"
import "./SceneGraph"
import "./Toolbar"
import "./Library"
import "./HUD"
import LingoEditor from "./LingoEditor"
import { Disposable } from "@lincode/promiselikes"
import { render } from "preact"

export default class extends Disposable {
    public constructor() {
        super()

        const el = document.createElement("div")
        document.body.appendChild(el)

        render(<LingoEditor />, el)

        this.then(() => {
            document.body.removeChild(el)
            render(undefined, el)
        })
    }
}
