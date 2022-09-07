import { Reactive } from "@lincode/reactivity"
import { HTMLMesh as ThreeHTMLMesh } from "./HTMLMesh"
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

            const mesh = new ThreeHTMLMesh(element)
            this.object3d.add(mesh)
            mesh.scale.setScalar(10)

            return () => {
                this.object3d.remove(mesh)
                mesh.dispose()
                document.body.removeChild(elementContainer)
            }
        }, [this.elementState.get])
    }

    private elementState = new Reactive<Element | undefined>(undefined)
    public get element() {
        return this.elementState.get()
    }
    public set element(val) {
        this.elementState.set(val)
    }
}
