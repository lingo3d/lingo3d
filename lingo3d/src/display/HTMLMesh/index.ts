import { Reactive } from "@lincode/reactivity"
import { HTMLMesh as ThreeHTMLMesh, HTMLSprite } from "./HTMLMesh"
import { htmlMeshDefaults, htmlMeshSchema } from "../../interface/IHTMLMesh"
import ObjectManager from "../core/ObjectManager"
import createElement from "../../utils/createElement"

const elementContainerTemplate = createElement(`
    <div style="position: absolute; visibility: hidden; pointer-events: none;"></div>
`)

export default class HTMLMesh extends ObjectManager {
    public static componentName = "htmlMesh"
    public static defaults = htmlMeshDefaults
    public static schema = htmlMeshSchema

    public constructor() {
        super()

        this.createEffect(() => {
            const element = this.elementState.get() as HTMLElement | undefined
            if (!element) return

            const elementContainer = elementContainerTemplate.cloneNode()
            document.body.appendChild(elementContainer)
            elementContainer.appendChild(element)

            const mesh = this.spriteState.get()
                ? new HTMLSprite(element)
                : new ThreeHTMLMesh(element)
            this.object3d.add(mesh)

            return () => {
                this.object3d.remove(mesh)
                mesh.dispose()
                document.body.removeChild(elementContainer)
            }
        }, [this.elementState.get, this.spriteState.get])
    }

    private elementState = new Reactive<Element | undefined>(undefined)
    public get element() {
        return this.elementState.get()
    }
    public set element(val) {
        this.elementState.set(val)
    }

    private spriteState = new Reactive(false)
    public get sprite() {
        return this.spriteState.get()
    }
    public set sprite(val) {
        this.spriteState.set(val)
    }
}
