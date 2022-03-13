import { Group } from "three"
import { flatGeomScaleZ } from "../engine/constants"
import ObjectManager from "./core/ObjectManager"
import { planeGeometry } from "./primitives/Plane"
import { HEIGHT, WIDTH } from "../globals"
import { getResolution } from "../states/useResolution"
import { setSSRGroundReflector } from "../states/useSSRGroundReflector"
import { lazy } from "@lincode/utils"
import { ReflectorShape } from "../interface/IReflector"
import { circleGeometry } from "./primitives/Circle"

const lazyReflectorForSSRPass = lazy(() => import("three/examples/jsm/objects/ReflectorForSSRPass"))

export default class GroundReflector extends ObjectManager<Group> {
    public constructor() {
        super(new Group())
        this.object3d.scale.z = flatGeomScaleZ
        this.rotationX = -90
        this.scale = 9999

        ;(async () => {
            //@ts-ignore
            const { ReflectorForSSRPass } = await lazyReflectorForSSRPass()

            if (this.done) return

            const groundReflector = new ReflectorForSSRPass(this.shape === "circle" ? circleGeometry : planeGeometry, {
                clipBias: 0.0003,
                textureWidth: WIDTH,
                textureHeight: HEIGHT,
                color: 0x888888,
                useDepthTexture: true
            })
            this.watch(getResolution(([w, h]) => groundReflector.getRenderTarget().setSize(w, h)))

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
        if (this.done) return this
        super.dispose()
        setSSRGroundReflector(null)
        return this
    }

    public shape?: ReflectorShape
}