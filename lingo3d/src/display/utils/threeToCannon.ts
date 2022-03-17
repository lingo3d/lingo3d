import Model from "../Model"
//@ts-ignore
import fairySrc from "../../../assets-local/fairy.glb"
import { BufferGeometry, Mesh } from "three"
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils"
import { wireframeMaterial } from "./reusables"
import scene from "../../engine/scene"
//@ts-ignore
import { threeToCannon, ShapeType } from "three-to-cannon"
import PhysicsItem from "../core/SimpleObjectManager/PhysicsItem"
import Cube from "../primitives/Cube"
import Sphere from "../primitives/Sphere"
import { timer } from "../../engine/eventLoop"

export default async () => {
    const model = new Model()
    model.src = fairySrc
    model.scale = 10

    model.onLoad = () => {
        const geometries: Array<BufferGeometry> = []
		model.outerObject3d.updateMatrixWorld(true)

		model.outerObject3d.traverse((c: any) => {
			if (!c.geometry || c === model.object3d) return
            const cloned = c.geometry.clone()
            cloned.applyMatrix4(c.matrixWorld)
            for (const key in cloned.attributes)
                key !== "position" && cloned.deleteAttribute(key)

            geometries.push(cloned)
		})

        // const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries, false)
        // const collider = new Mesh(mergedGeometry, wireframeMaterial)
		// scene.add(collider)

        const trimeshShape = async function (this: PhysicsItem) {
            for (const geom of geometries) {
                const mesh = new Mesh(geom, wireframeMaterial)
                const result = threeToCannon(mesh as any, { type: ShapeType.MESH })
                this.cannonBody!.addShape(result!.shape)
                scene.add(mesh)
            }
        }

        model.physicsShape = trimeshShape
        model.physics = true
        model.mass = 0

        timer(1000, Infinity, () => {
            const ball = new Sphere()
            ball.scale = 0.1
            ball.y = 100
            ball.physics = true
        })
    }
}