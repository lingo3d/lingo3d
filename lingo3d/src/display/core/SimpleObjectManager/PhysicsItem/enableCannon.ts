import { Cancellable } from "@lincode/promiselikes"
import PhysicsItem from "."
import loadCannon from "./cannon/loadCannon"
import { cannonSet } from "./cannon/cannonLoop"
import scene from "../../../../engine/scene"

const physicsGroups = <const>[1, 2, 4, 8, 16, 32]
const physicsGroupIndexes = <const>[0, 1, 2, 3, 4, 5]

export default async function (this: PhysicsItem, handle: Cancellable) {
    if (handle.done) return

    scene.attach(this.outerObject3d)

    const { slipperyMaterial, defaultMaterial, world, Body, Vec3 } = await loadCannon()

    if (handle.done) return

    const body = this.cannonBody = new Body({
        mass: this._mass ?? 1,
        material: this._slippery ? slipperyMaterial : defaultMaterial,
        collisionFilterGroup: physicsGroups[this._physicsGroup ?? 0],
        collisionFilterMask:
            physicsGroupIndexes
                .filter(index => !this._ignorePhysicsGroups?.includes(index))
                .map(index => physicsGroups[index])
                .reduce((acc, curr) => acc + curr, 0)
    })
    await this._physicsShape()

    if (handle.done) return

    if (this._physics === "2d") {
        body.angularFactor = new Vec3(0, 0, 1)
        body.linearFactor = new Vec3(1, 1, 0)
    }
    if (this._noTumble)
        body.angularFactor = new Vec3(0, 0, 0)

    body.position.copy(this.outerObject3d.position as any)
    body.quaternion.copy(this.outerObject3d.quaternion as any)

    this.physicsUpdate = {}
    world.addBody(body)
    cannonSet.add(this)

    handle.then(() => {
        world.removeBody(body)
        cannonSet.delete(this)
        this.cannonBody = undefined
        this.physicsUpdate = undefined
    })
}