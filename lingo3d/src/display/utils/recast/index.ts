import Model from "../../Model"
//@ts-ignore
import fairySrc from "../../../../assets-local/island.glb"
import { BufferGeometry, Mesh, Vector3 } from "three"
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils"
import { wireframeMaterial } from "../reusables"
import scene from "../../../engine/scene"
//@ts-ignore
import Recast from "./recast2"
import fit from "../fit"

export default async () => {
    const model = new Model()
    model.src = fairySrc

    model.onLoad = () => {
        const geometries: Array<BufferGeometry> = []
		model.outerObject3d.updateMatrixWorld(true)

		model.outerObject3d.traverse((c: any) => {
			if (!c.geometry || c === model.object3d) return
            const cloned = c.geometry.clone()
            // cloned.applyMatrix4(c.matrixWorld)
            for (const key in cloned.attributes)
                key !== "position" && cloned.deleteAttribute(key)

            geometries.push(cloned)
		})

        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries, false)
        const collider = new Mesh(mergedGeometry, wireframeMaterial)
		scene.add(collider)
     
        Recast().then((recast: any) => {
            const createNavMesh = (mesh: Mesh, parameters: any) => {
                const rc = new recast.rcConfig()
                rc.borderSize = 0
                rc.tileSize = 0
                Object.assign(rc, parameters)
                const navMesh = new recast.NavMesh()
                  
                navMesh.build(
                    mesh.geometry.attributes.position.array,
                    mesh.geometry.attributes.position.count,
                    mesh.geometry.index!.array,
                    mesh.geometry.index!.count,
                    rc
                )
                return navMesh
            }

            const createDebugNavMesh = (navMesh: any) => {
                const debugNavMesh = navMesh.getDebugNavMesh()
                const triangleCount = debugNavMesh.getTriangleCount()
                const indices = []
                const positions = []
                const geometry = new BufferGeometry()
        
                for (let tri = 0; tri < triangleCount * 3; tri++)
                    indices.push(tri)
                    
                for (let tri = 0; tri < triangleCount; tri++)
                    for (let pt = 0; pt < 3; pt++) {
                        const point = debugNavMesh.getTriangle(tri).getPoint(pt)
                        positions.push(new Vector3(point.x, point.y, point.z))
                    }
                geometry.setFromPoints(positions)
                geometry.setIndex(indices)
                return new Mesh(geometry, wireframeMaterial)
            }

            const navMesh = createNavMesh(collider, {
                cs: 0.9,
                ch: 0.9,
                walkableSlopeAngle: 35,
                walkableHeight: 2,
                walkableClimb: 2,
                walkableRadius: 10,
                maxEdgeLen: 12.,
                maxSimplificationError: 1.3,
                minRegionArea: 8,
                mergeRegionArea: 2,
                maxVertsPerPoly: 6,
                detailSampleDist: 6,
                detailSampleMaxError: .1,
            })

            const debugMesh = createDebugNavMesh(navMesh)
            fit(debugMesh, "adsfasdf")
            scene.add(debugMesh)
        })

        

        model.visible = false
    }
}