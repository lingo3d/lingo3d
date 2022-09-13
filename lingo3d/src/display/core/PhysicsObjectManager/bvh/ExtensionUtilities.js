import { Mesh } from "three"

const origMeshRaycastFunc = Mesh.prototype.raycast

function convertRaycastIntersect(hit, object, raycaster) {
    if (hit === null) {
        return null
    }

    hit.distance = hit.point.distanceTo(raycaster.ray.origin)
    hit.object = object

    if (hit.distance < raycaster.near || hit.distance > raycaster.far) {
        return null
    } else {
        return hit
    }
}

export function acceleratedRaycast(raycaster, intersects) {
    if (this.geometry.boundsTree) {
        if (this.material === undefined) return

        const bvh = this.geometry.boundsTree
        if (raycaster.firstHitOnly === true) {
            const hit = convertRaycastIntersect(
                bvh.raycastFirst(raycaster.ray, this.material),
                this,
                raycaster
            )
            if (hit) {
                intersects.push(hit)
            }
        } else {
            const hits = bvh.raycast(ray, this.material)
            for (let i = 0, l = hits.length; i < l; i++) {
                const hit = convertRaycastIntersect(hits[i], this, raycaster)
                if (hit) {
                    intersects.push(hit)
                }
            }
        }
    } else {
        origMeshRaycastFunc.call(this, raycaster, intersects)
    }
}
