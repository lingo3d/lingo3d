import { Point3d } from "@lincode/math"
import { Reactive } from "@lincode/reactivity"
import EventLoopItem from "../api/core/EventLoopItem"
import {
    addBloom,
    deleteBloom
} from "../engine/renderLoop/effectComposer/selectiveBloomPass/renderSelectiveBloom"
import scene from "../engine/scene"
import { point2Vec } from "./utils/vec2Point"
import {
    BufferAttribute,
    BufferGeometry,
    CatmullRomCurve3,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    TubeBufferGeometry,
    Vector3
} from "three"
import Group from "./Group"
import { vector3 } from "./utils/reusables"

const ARC_SEGMENTS = 50

export default class Curve extends Group {
    private material = new MeshStandardMaterial()

    private bufferAttribute = new BufferAttribute(
        new Float32Array(ARC_SEGMENTS * 3),
        3
    )

    private vectors: Array<Vector3> = []

    private curve = new CatmullRomCurve3(
        this.vectors,
        undefined,
        "catmullrom",
        0.5
    )

    public constructor() {
        super()

        const geometry = new BufferGeometry()
        geometry.setAttribute("position", this.bufferAttribute)

        const curveMesh = new Line(
            geometry,
            new LineBasicMaterial({
                color: 0xff0000,
                opacity: 0.35
            })
        )
        scene.add(curveMesh)
        this.then(() => {
            geometry.dispose()
            scene.remove(curveMesh)
        })
        this.update()
    }

    public update() {
        for (let i = 0; i < ARC_SEGMENTS; i++) {
            const t = i / (ARC_SEGMENTS - 1)
            this.curve.getPoint(t, vector3)
            this.bufferAttribute.setXYZ(i, vector3.x, vector3.y, vector3.z)
        }
        this.bufferAttribute.needsUpdate = true
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()
        this.material.dispose()
        return this
    }
}
