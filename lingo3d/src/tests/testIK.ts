import {
    Bone,
    SkinnedMesh,
    Skeleton,
    Vector3,
    CylinderGeometry,
    Uint16BufferAttribute,
    Float32BufferAttribute
} from "three"
import { CCDIKSolver } from "three/examples/jsm/animation/CCDIKSolver"
import { standardMaterial } from "../display/utils/reusables"
import { onBeforeRender } from "../events/onBeforeRender"
import scene from "../engine/scene"
import { setSelectionTarget } from "../states/useSelectionTarget"
import SimpleObjectManager from "../display/core/SimpleObjectManager"

function createGeometry(sizing: any) {
    const geometry = new CylinderGeometry(
        5, // radiusTop
        5, // radiusBottom
        sizing.height, // height
        8, // radiusSegments
        sizing.segmentCount * 1, // heightSegments
        true // openEnded
    )

    const position = geometry.attributes.position as any

    const vertex = new Vector3()

    const skinIndices = []
    const skinWeights = []

    for (let i = 0; i < position.count; i++) {
        vertex.fromBufferAttribute(position, i)

        const y = vertex.y + sizing.halfHeight

        const skinIndex = Math.floor(y / sizing.segmentHeight)
        const skinWeight = (y % sizing.segmentHeight) / sizing.segmentHeight

        skinIndices.push(skinIndex, skinIndex + 1, 0, 0)
        skinWeights.push(1 - skinWeight, skinWeight, 0, 0)
    }

    geometry.setAttribute(
        "skinIndex",
        new Uint16BufferAttribute(skinIndices, 4)
    )
    geometry.setAttribute(
        "skinWeight",
        new Float32BufferAttribute(skinWeights, 4)
    )

    return geometry
}

const segmentHeight = 8
const segmentCount = 3
const height = segmentHeight * segmentCount
const halfHeight = height * 0.5

const sizing = {
    segmentHeight,
    segmentCount,
    height,
    halfHeight
}
const geometry = createGeometry(sizing)

let ikSolver: CCDIKSolver

let bones = []

// "root"
let rootBone = new Bone()
rootBone.position.y = -12
bones.push(rootBone)

// "bone0"
let prevBone = new Bone()
prevBone.position.y = 0
rootBone.add(prevBone)
bones.push(prevBone)

// "bone1", "bone2", "bone3"
for (let i = 1; i <= 3; i++) {
    const bone = new Bone()
    bone.position.y = 8
    bones.push(bone)

    prevBone.add(bone)
    prevBone = bone
}

// "target"
const targetBone = new Bone()
targetBone.position.y = 24 + 8
rootBone.add(targetBone)
bones.push(targetBone)

setSelectionTarget(new SimpleObjectManager(targetBone))

//
// skinned mesh
//

const mesh = new SkinnedMesh(geometry, standardMaterial)
scene.add(mesh)
const skeleton = new Skeleton(bones)

mesh.add(bones[0]) // "root" bone
mesh.bind(skeleton)

//
// ikSolver
//

const iks = [
    {
        target: 5, // "target"
        effector: 4, // "bone3"
        links: [{ index: 3 }, { index: 2 }, { index: 1 }] // "bone2", "bone1", "bone0"
    }
] as any
ikSolver = new CCDIKSolver(mesh, iks)

onBeforeRender(() => {
    ikSolver.update()
})
