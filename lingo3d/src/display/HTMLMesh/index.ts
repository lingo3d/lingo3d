import { Reactive } from "@lincode/reactivity"
import { HTMLMesh as ThreeHTMLMesh } from "./HTMLMesh"
import { InteractiveGroup } from "./InteractiveGroup"
import { htmlMeshDefaults, htmlMeshSchema } from "../../interface/IHTMLMesh"
import { getCameraRendered } from "../../states/useCameraRendered"
import { getRenderer } from "../../states/useRenderer"
import ObjectManager from "../core/ObjectManager"

export default class HTMLMesh extends ObjectManager {
    public static componentName = "htmlMesh"
    public static defaults = htmlMeshDefaults
    public static schema = htmlMeshSchema

    public constructor() {
        super()

        this.createEffect(() => {
            const element = this.elementState.get()
            const renderer = getRenderer()
            const camera = getCameraRendered()
            if (!element || !renderer) return

            const group = new InteractiveGroup(renderer, camera)
            this.object3d.add(group)

            const mesh = new ThreeHTMLMesh(element as HTMLElement)
            group.add(mesh)

            return () => {
                this.object3d.remove(group)
                mesh.dispose()
            }
        }, [this.elementState.get, getRenderer, getCameraRendered])
    }

    private elementState = new Reactive<Element | undefined>(undefined)
    public get element() {
        return this.elementState.get()
    }
    public set element(val) {
        this.elementState.set(val)
    }
}
