import "./Editor"
import "./SceneGraph"
import "./Toolbar"
import "./Library"
import "./HUD"
import "./LingoEditor"
import { Disposable } from "@lincode/promiselikes"

export default class LingoEditor extends Disposable {
    public constructor() {
        super()

        const el = document.createElement("lingo3d-lingoeditor")
        document.body.appendChild(el)

        this.then(() => {
            document.body.removeChild(el)
        })
    }
}
