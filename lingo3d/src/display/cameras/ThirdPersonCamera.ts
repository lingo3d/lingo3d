import { createEffect } from "@lincode/reactivity"
import mainCamera from "../../engine/mainCamera"
import { onBeforeRender } from "../../events/onBeforeRender"
import IThirdPersonCamera, {
    thirdPersonCameraDefaults,
    thirdPersonCameraSchema
} from "../../interface/IThirdPersonCamera"
import { getCameraRendered } from "../../states/useCameraRendered"
import { getEditorBehavior } from "../../states/useEditorBehavior"
import { getWorldPlayComputed } from "../../states/useWorldPlayComputed"
import { physXPtr } from "../../states/usePhysX"
import CharacterCamera from "../core/CharacterCamera"
import { managerActorPtrMap } from "../core/PhysicsObjectManager/physx/pxMaps"
import {
    assignPxVec,
    assignPxVec_
} from "../core/PhysicsObjectManager/physx/pxMath"
import getWorldDirection from "../utils/getWorldDirection"
import getWorldPosition from "../utils/getWorldPosition"
import getWorldQuaternion from "../utils/getWorldQuaternion"
import MeshAppendable from "../../api/core/MeshAppendable"

const setVisible = (target: MeshAppendable, visible: boolean) =>
    "visible" in target && (target.visible = visible)

let alwaysVisible = false

createEffect(() => {
    alwaysVisible =
        !getWorldPlayComputed() ||
        (getEditorBehavior() && getCameraRendered() === mainCamera)
}, [getEditorBehavior, getEditorBehavior, getCameraRendered])

export default class ThirdPersonCamera
    extends CharacterCamera
    implements IThirdPersonCamera
{
    public static componentName = "thirdPersonCamera"
    public static override defaults = thirdPersonCameraDefaults
    public static override schema = thirdPersonCameraSchema

    public constructor() {
        super()
        this.innerZ = 300
        this.orbitMode = true

        const cam = this.camera

        this.createEffect(() => {
            const found = this.foundState.get()
            if (!found) {
                const handle = onBeforeRender(() => {
                    cam.position.copy(getWorldPosition(this.object3d))
                    cam.quaternion.copy(getWorldQuaternion(this.object3d))
                })
                return () => {
                    handle.cancel()
                }
            }

            let tooCloseOld = false
            setVisible(found, true)

            const handle = onBeforeRender(() => {
                const origin = getWorldPosition(this.outerObject3d)
                const position = getWorldPosition(this.object3d)

                const pxHit = physXPtr[0].pxRaycast?.(
                    assignPxVec(origin),
                    assignPxVec_(getWorldDirection(this.object3d)),
                    position.distanceTo(origin),
                    managerActorPtrMap.get(found)
                )
                pxHit && position.lerpVectors(position, pxHit.position, 1.1)

                cam.position.copy(position)
                cam.quaternion.copy(getWorldQuaternion(this.object3d))

                const tooClose = alwaysVisible
                    ? false
                    : cam.position.distanceTo(origin) < 1
                tooClose !== tooCloseOld && setVisible(found, !tooClose)
                tooCloseOld = tooClose
            })
            return () => {
                handle.cancel()
            }
        }, [this.foundState.get])
    }
}
