import "./Editor"
import "./SceneGraph"
import "./Toolbar"
import "./Library"
import "./HUD"
import LingoEditor from "./LingoEditor"
import { Disposable } from "@lincode/promiselikes"
import { render } from "preact"
import PreactTweakPane from "./TweakPane"
import PaneInput, { PaneInputProps } from "./TweakPane/PaneInput"
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

export class TweakPane extends Disposable {
    public constructor() {
        super()

        const el = document.createElement("div")
        document.body.appendChild(el)

        this.watch(
            this.inputState.get(() =>
                render(
                    <PreactTweakPane>
                        {this.inputState.get().map((option) => (
                            <PaneInput {...option} />
                        ))}
                    </PreactTweakPane>,
                    el
                )
            )
        )
        this.then(() => {
            el.remove()
            render(undefined, el)
        })
    }

    private inputState = new Reactive<Array<PaneInputProps>>([])
    public addInput(options: PaneInputProps) {
        this.inputState.set([...this.inputState.get(), options])
        return this
    }
}
