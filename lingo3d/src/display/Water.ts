import { Reactive } from "@lincode/reactivity"
import { planeGeometry } from "./primitives/Plane"
import { sphereGeometry } from "./primitives/Sphere"
import loadTexture from "./utils/loaders/loadTexture"
import IWater, { waterDefaults, waterSchema } from "../interface/IWater"
import { Cancellable } from "@lincode/promiselikes"
import { WATERNORMALS_URL } from "../api/assetsPath"
import { addWaterSystem } from "../systems/waterSystem"
import PhysicsObjectManager from "./core/PhysicsObjectManager"
import { ssrExcludeSet } from "../collections/ssrExcludeSet"
import type { Water as ThreeWater } from "three/examples/jsm/objects/Water"

export default class Water extends PhysicsObjectManager implements IWater {
    public static componentName = "water"
    public static defaults = waterDefaults
    public static schema = waterSchema

    public $water?: ThreeWater

    private shapeState = new Reactive<"plane" | "sphere">("plane")
    public get shape() {
        return this.shapeState.get()
    }
    public set shape(val) {
        this.shapeState.set(val)
    }

    private normalMapState = new Reactive<string | undefined>(undefined)
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

    public speed = 1

    public constructor() {
        super()
        ssrExcludeSet.add(this.outerObject3d)
        this.rotationX = 270
        this.object3d.scale.z = Number.EPSILON
        addWaterSystem(this)

        import("three/examples/jsm/objects/Water").then(({ Water }) => {
            this.createEffect(() => {
                const normalMap =
                    this.normalMapState.get() || WATERNORMALS_URL()

                const isPlane = this.shapeState.get() === "plane"
                const waterGeometry = isPlane ? planeGeometry : sphereGeometry

                const res = this.resolutionState.get()

                const handle = new Cancellable()
                const water = new Water(waterGeometry, {
                    textureWidth: res,
                    textureHeight: res,
                    waterNormals: loadTexture(normalMap, () => {
                        this.object3d.add(water)
                        handle.then(() => this.object3d.remove(water))
                    }),
                    // sunDirection: new Vector3(),
                    sunColor: 0xffffff,
                    waterColor: 0x001e0f,
                    distortionScale: 3.7
                })
                return () => {
                    handle.cancel()
                }
            }, [
                this.shapeState.get,
                this.normalMapState.get,
                this.resolutionState.get
            ])
        })
    }

    protected override disposeNode() {
        super.disposeNode()
        ssrExcludeSet.delete(this.outerObject3d)
    }

    public override get depth() {
        return 0
    }
    public override set depth(_) {}
    public override get scaleZ() {
        return 0
    }
    public override set scaleZ(_) {}
}
