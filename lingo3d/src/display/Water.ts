import { Reactive } from "@lincode/reactivity"
import ObjectManager from "./core/ObjectManager"
import { planeGeometry } from "./primitives/Plane"
import { sphereGeometry } from "./primitives/Sphere"
import { Water } from "three/examples/jsm/objects/Water"
import loadTexture from "./utils/loaders/loadTexture"
import { dt } from "../engine/eventLoop"
import { onBeforeRender } from "../events/onBeforeRender"

export default class SpawnPoint extends ObjectManager {
    // public static componentName = "spawnPoint"
    // public static defaults = spawnPointDefaults
    // public static schema = spawnPointSchema

    private shapeState = new Reactive<"plane" | "sphere">("plane")
    public get shape() {
        return this.shapeState.get()
    }
    public set shape(val) {
        this.shapeState.set(val)
    }

    public constructor() {
        super()

        this.createEffect(() => {
            const waterGeometry =
                this.shapeState.get() === "plane"
                    ? planeGeometry
                    : sphereGeometry

            const water = new Water(waterGeometry, {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: loadTexture("waternormals.jpeg"),
                // sunDirection: new Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 3.7
            })
            water.rotation.x = -Math.PI / 2

            this.outerObject3d.add(water)
            const handle = onBeforeRender(() => {
                water.material.uniforms["time"].value += dt[0]
            })
            return () => {
                this.outerObject3d.remove(water)
                handle.cancel()
            }
        }, [this.shapeState.get])
    }
}
