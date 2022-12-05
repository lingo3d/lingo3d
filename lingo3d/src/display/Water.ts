import { Reactive } from "@lincode/reactivity"
import { planeGeometry } from "./primitives/Plane"
import { sphereGeometry } from "./primitives/Sphere"
import loadTexture from "./utils/loaders/loadTexture"
import { dt } from "../engine/eventLoop"
import { onBeforeRender } from "../events/onBeforeRender"
import IWater, { waterDefaults, waterSchema } from "../interface/IWater"
import { WATERNORMALS_URL } from "../globals"
import { Cancellable } from "@lincode/promiselikes"
import VisibleObjectManager from "./core/VisibleObjectManager"
import { setManager } from "../api/utils/manager"

export default class Water extends VisibleObjectManager implements IWater {
    public static componentName = "water"
    public static defaults = waterDefaults
    public static schema = waterSchema

    private shapeState = new Reactive<"plane" | "sphere">("plane")
    public get shape() {
        return this.shapeState.get()
    }
    public set shape(val) {
        this.shapeState.set(val)
    }

    private normalMapState = new Reactive(WATERNORMALS_URL)
    public get normalMap() {
        return this.normalMapState.get()
    }
    public set normalMap(val) {
        this.normalMapState.set(val)
    }

    private resolutionState = new Reactive(512)
    public get resolution() {
        return this.resolutionState.get()
    }
    public set resolution(val) {
        this.resolutionState.set(val)
    }

    private speedState = new Reactive(1)
    public get speed() {
        return this.speedState.get()
    }
    public set speed(val) {
        this.speedState.set(val)
    }

    public constructor() {
        super()
        this.rotationX = 270

        import("three/examples/jsm/objects/Water").then(({ Water }) => {
            this.createEffect(() => {
                const normalMap = this.normalMapState.get()
                if (!normalMap) return

                const isPlane = this.shapeState.get() === "plane"
                const waterGeometry = isPlane ? planeGeometry : sphereGeometry

                const res = this.resolutionState.get()
                const speed = this.speedState.get()

                const handle = new Cancellable()
                const water = new Water(waterGeometry, {
                    textureWidth: res,
                    textureHeight: res,
                    waterNormals: loadTexture(normalMap, () => {
                        this.object3d.add(water)
                        const updateHandle = onBeforeRender(() => {
                            water.material.uniforms["time"].value +=
                                dt[0] * speed
                        })
                        handle.then(() => {
                            this.object3d.remove(water)
                            updateHandle.cancel()
                        })
                    }),
                    // sunDirection: new Vector3(),
                    sunColor: 0xffffff,
                    waterColor: 0x001e0f,
                    distortionScale: 3.7
                })
                setManager(water, this)

                return () => {
                    handle.cancel()
                }
            }, [
                this.shapeState.get,
                this.normalMapState.get,
                this.resolutionState.get,
                this.speedState.get
            ])
        })
    }
}
