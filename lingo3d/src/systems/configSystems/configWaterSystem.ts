import { lazy } from "@lincode/utils"
import configSystemWithCleanUp from "../utils/configSystemWithCleanUp"
import Water from "../../display/Water"
import type { Water as ThreeWater } from "three/examples/jsm/objects/Water"
import { WATERNORMALS_URL } from "../../api/assetsPath"
import { planeGeometry } from "../../display/primitives/Plane"
import { sphereGeometry } from "../../display/primitives/Sphere"
import loadTexture from "../../display/utils/loaders/loadTexture"
import { addWaterSystem, deleteWaterSystem } from "../waterSystem"

let WaterClass: typeof ThreeWater

const importWater = lazy(async () => {
    const { Water } = await import("three/examples/jsm/objects/Water")
    WaterClass = Water
})

export const [addConfigWaterSystem] = configSystemWithCleanUp(
    (self: Water) => {
        const normalMap = self.normalMap || WATERNORMALS_URL()

        const isPlane = self.shape === "plane"
        const waterGeometry = isPlane ? planeGeometry : sphereGeometry
        const res = self.resolution

        const water = (self.$water = new WaterClass(waterGeometry, {
            textureWidth: res,
            textureHeight: res,
            waterNormals: loadTexture(normalMap),
            // sunDirection: new Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7
        }))
        self.object3d.add(water)
        addWaterSystem(self)

        return () => {
            self.object3d.remove(water)
            deleteWaterSystem(self)
        }
    },
    [importWater]
)
