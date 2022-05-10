import { Group } from "three"
import { flatGeomScaleZ } from "../engine/constants"
import ObjectManager from "./core/ObjectManager"
import { planeGeometry } from "./primitives/Plane"
import { HEIGHT, WIDTH } from "../globals"
import { setSSRGroundReflector } from "../states/useSSRGroundReflector"
import { lazy } from "@lincode/utils"
import IGroundReflector, { groundReflectorDefaults, groundReflectorSchema } from "../interface/IGroundReflector"

const lazyReflectorForSSRPass = lazy(() => import("three/examples/jsm/objects/ReflectorForSSRPass"))

export default class GroundReflector extends ObjectManager<Group> implements IGroundReflector {
    public static componentName = "groundReflector"
    public static defaults = groundReflectorDefaults
    public static schema = groundReflectorSchema

    public constructor() {
        super(new Group())
        this.object3d.scale.z = flatGeomScaleZ
        this.rotationX = -90
        this.scale = 9999

        ;(async () => {
            //@ts-ignore
            const { ReflectorForSSRPass } = await lazyReflectorForSSRPass()

            if (this.done) return

            const groundReflector = new ReflectorForSSRPass(planeGeometry, {
                clipBias: 0.0003,
                textureWidth: WIDTH,
                textureHeight: HEIGHT,
                color: 0x888888,
                useDepthTexture: true
            })
            groundReflector.material.depthWrite = false
            groundReflector.visible = false
            this.object3d.add(groundReflector)

            groundReflector.fresnel = true
            groundReflector.distanceAttenuation = true
            groundReflector.maxDistance = 5

            setSSRGroundReflector(groundReflector)
        })()
    }

    public override dispose() {
        super.dispose()
        setSSRGroundReflector(null)
        return this
    }
}