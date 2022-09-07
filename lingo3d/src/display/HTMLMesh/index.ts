import { Reactive } from "@lincode/reactivity"
import { HTMLMesh as ThreeHTMLMesh } from "./HTMLMesh"
import { htmlMeshDefaults, htmlMeshSchema } from "../../interface/IHTMLMesh"
import ObjectManager from "../core/ObjectManager"

export default class HTMLMesh extends ObjectManager {
    public static componentName = "htmlMesh"
    public static defaults = htmlMeshDefaults
    public static schema = htmlMeshSchema

    public constructor() {
        super()

        this.createEffect(() => {
            const element = this.elementState.get()
            if (!element) return

            const mesh = new ThreeHTMLMesh(element as HTMLElement)
            this.object3d.add(mesh)

            return () => {
                this.object3d.remove(mesh)
                mesh.dispose()
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
