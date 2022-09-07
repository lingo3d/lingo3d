import { Reactive } from "@lincode/reactivity"
import { HTMLMesh as ThreeHTMLMesh } from "three/examples/jsm/interactive/HTMLMesh"
import { InteractiveGroup } from "three/examples/jsm/interactive/InteractiveGroup"
import { onBeforeRender } from "../events/onBeforeRender"
import { htmlMeshDefaults, htmlMeshSchema } from "../interface/IHTMLMesh"
import { getCameraRendered } from "../states/useCameraRendered"
import { getRenderer } from "../states/useRenderer"
import ObjectManager from "./core/ObjectManager"

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

            const mesh = new ThreeHTMLMesh(element as any)
            group.add(mesh)

            const handle = onBeforeRender(() => {
                ;(mesh.material as any).map.update()
            })
            return () => {
                this.object3d.remove(group)
                mesh.dispose()
                handle.cancel()
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
