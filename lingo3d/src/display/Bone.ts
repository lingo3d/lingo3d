import { distance3d } from "@lincode/math"
import randomColor from "randomcolor"
import { Object3D } from "three"
import Octahedron from "./primitives/Octahedron"
import getWorldPosition from "../memo/getWorldPosition"
import { vec2Point } from "./utils/vec2Point"
import { ColorString } from "../interface/ITexturedStandard"

export default class Bone extends Octahedron {
    public end: Octahedron

    public constructor(target: Object3D, child: Object3D) {
        super()
        // hiddenAppendables.add(this)

        const color = randomColor() as ColorString

        this.wireframe = true
        const thisMaterial = this.$innerObject.material
        thisMaterial.depthTest = false
        this.color = color
        this.width = 2
        this.height = 2
        this.depth = 2

        const joint = new Octahedron()
        this.append(joint)
        joint.scale = 0.05
        joint.wireframe = true
        const jointMaterial = joint.$innerObject.material
        jointMaterial.depthTest = false
        joint.color = color

        const end = (this.end = new Octahedron())
        this.append(end)
        end.scale = 0.05
        end.wireframe = true
        const endMaterial = end.$innerObject.material
        endMaterial.depthTest = false
        end.color = color

        const from = vec2Point(getWorldPosition(target))
        const to = vec2Point(getWorldPosition(child))

        const { x: x0, y: y0, z: z0 } = from
        const { x: x1, y: y1, z: z1 } = to

        this.x = x0
        this.y = y0
        this.z = z0

        const h = (this.depth = distance3d(x0, y0, z0, x1, y1, z1))
        this.innerZ = h * 0.5
        end.z = h
        const t = (this.width = this.height = h * 0.2)
        joint.scale = t * 0.01

        this.lookAt(to)
    }
}
