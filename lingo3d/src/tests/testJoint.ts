import { createEffect } from "@lincode/reactivity"
import "../display/core/PhysicsObjectManager/physx"
import { managerActorMap } from "../display/core/PhysicsObjectManager/physx/pxMaps"
import {
    multPxTransform,
    setPxPose,
    setPxPosePQ,
    setPxPosePQ_,
    setPxPosePQ__,
    setPxVec_,
    setPxVec__
} from "../display/core/PhysicsObjectManager/physx/updatePxVec"
import Cube from "../display/primitives/Cube"
import { getPhysX } from "../states/usePhysX"

const createLimitedSpherical = (a0: any, t0: any, a1: any, t1: any) => {
    const { physics, Px, PxJointLimitCone, PxSphericalJointFlagEnum } =
        getPhysX()

    const j = Px.SphericalJointCreate(physics, a0, t0, a1, t1)
    j.setLimitCone(new PxJointLimitCone(Math.PI / 4, Math.PI / 4, 0.05))
    j.setSphericalJointFlag(PxSphericalJointFlagEnum.eLIMIT_ENABLED(), true)
    return j
}

const createChain = (
    t: any,
    length: number,
    g: any,
    separation: number,
    createJoint: Function
) => {
    const { PxCreateDynamic, physics, material, scene } = getPhysX()

    const offset = setPxVec__(separation * 0.5, 0, 0)
    const localTm = setPxPosePQ__(offset)
    let prev = null

    for (let i = 0; i < length; i++) {
        const current = PxCreateDynamic(
            physics,
            multPxTransform(t, localTm),
            g,
            material,
            1
        )
        createJoint(
            prev,
            prev ? setPxPosePQ(offset) : t,
            current,
            setPxPosePQ_(setPxVec_(-separation * 0.5, 0, 0))
        )
        scene.addActor(current)

        const manager = new Cube()
        managerActorMap.set(manager, current)

        prev = current
        localTm.p.x += separation
    }
}

createEffect(() => {
    const { physics, Px, PxBoxGeometry } = getPhysX()
    if (!physics) return

    createChain(
        setPxPose(0, 20, 0),
        5,
        new PxBoxGeometry(2, 0, 0),
        4,
        createLimitedSpherical
    )
}, [getPhysX])
