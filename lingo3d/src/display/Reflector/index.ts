import { Group, Mesh, Vector2 } from "three"
import ObjectManager from "../core/ObjectManager"
import { planeGeometry } from "../primitives/Plane"
import { circleGeometry } from "../primitives/Circle"
import clockDelta from "../utils/clockDelta"
import { flatGeomScaleZ } from "../../engine/constants"
import { HEIGHT, WIDTH } from "../../globals"
import { lazy } from "@lincode/utils"
import { getResolution } from "../../states/useResolution"
import IReflector, { ReflectorShape } from "../../interface/IReflector"

const planeGeo = planeGeometry.clone()
const circleGeo = circleGeometry.clone()

const lazyThreeNodes = lazy(() => import("./threeNodes"))
const lazyReflectorRTT = lazy(() => import("three/examples/jsm/objects/ReflectorRTT"))

export default class Reflector extends ObjectManager<Group> implements IReflector {
    public constructor() {
        super(new Group())
        this.object3d.scale.z = flatGeomScaleZ

        ;(async () => {
            const { ReflectorRTT } = await lazyReflectorRTT()

            if (this.done) return

            const reflectorRTT = new ReflectorRTT(this.shape === "circle" ? circleGeometry : planeGeometry, {
                clipBias: 0.003,
                textureWidth: WIDTH,
                textureHeight: HEIGHT
            })
            this.watch(getResolution(([w, h]) => reflectorRTT.getRenderTarget().setSize(w, h)))

            const threeNodes = await lazyThreeNodes()

            const reflectorNode = new threeNodes.ReflectorNode(reflectorRTT)
            let lastNode: any = reflectorNode

            const frame = new threeNodes.NodeFrame(0)
            
            const blurNode = new threeNodes.BlurNode(reflectorNode as any)
            blurNode.size = new Vector2(WIDTH, HEIGHT)
            this.watch(getResolution(([w, h]) => {
                blurNode.size.set(w, h)
                blurNode.updateFrame(frame)
            }))
            blurNode.uv = new threeNodes.ExpressionNode("projCoord.xyz / projCoord.q", "vec3") as any
            (blurNode.uv as any).keywords["projCoord"] = reflectorNode.uv
            blurNode.radius = new threeNodes.Vector2Node(this.blur, this.blur)
            lastNode = blurNode

            const contrast = new threeNodes.FloatNode(this.contrast)
            const contrastNode = new threeNodes.ColorAdjustmentNode(lastNode, contrast, threeNodes.ColorAdjustmentNode.CONTRAST)
            lastNode = contrastNode

            const material = new threeNodes.PhongNodeMaterial()
            material.environment = lastNode
            this.loop(() => frame.update(clockDelta[0]).updateNode(material as any))
            const reflectorMesh = new Mesh(this.shape === "circle" ? circleGeo : planeGeo, material)
            // reflectorMesh.castShadow = true
            reflectorRTT.add(reflectorMesh)
			this.object3d.add(reflectorRTT)
        })()
    }
    
    public shape?: ReflectorShape

    public contrast = 0.5
    
    public blur = 2
}