import { createEffect } from "@lincode/reactivity"
import mainCamera from "../../engine/mainCamera"
import { onBeforeRender } from "../../events/onBeforeRender"
import IThirdPersonCamera, {
    thirdPersonCameraDefaults,
    thirdPersonCameraSchema
} from "../../interface/IThirdPersonCamera"
import { getCameraRendered } from "../../states/useCameraRendered"
import { getEditing } from "../../states/useEditing"
import { getEditorMounted } from "../../states/useEditorMounted"
import CharacterCamera from "../core/CharacterCamera"
import MeshItem from "../core/MeshItem"
import StaticObjectManager from "../core/StaticObjectManager"
import getWorldPosition from "../utils/getWorldPosition"
import getWorldQuaternion from "../utils/getWorldQuaternion"

const setVisible = (
    target: MeshItem | StaticObjectManager,
    visible: boolean
) => {
    "visible" in target && (target.visible = visible)
}

let alwaysVisible = false

createEffect(() => {
    alwaysVisible =
        getEditing() ||
        (!!getEditorMounted() && getCameraRendered() === mainCamera)
}, [getEditing, getEditorMounted, getCameraRendered])

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

        import("../core/PhysicsObjectManager/bvh/bvhCameraLoop").then(
            ({ bvhCameraSet, onBeforeCameraLoop }) => {
                this.createEffect(() => {
                    const target = this.targetState.get()
                    if (!target) {
                        const handle = onBeforeRender(() => {
                            cam.position.copy(getWorldPosition(this.object3d))
                            cam.quaternion.copy(
                                getWorldQuaternion(this.object3d)
                            )
                        })
                        return () => {
                            handle.cancel()
                        }
                    }

                    bvhCameraSet.add(cam)

                    let tooCloseOld = true
                    setVisible(target, !tooCloseOld)

                    let first = true
                    const handle = onBeforeCameraLoop(() => {
                        const origin = getWorldPosition(this.outerObject3d)
                        const camPos = getWorldPosition(this.object3d)
                        const dist = camPos.distanceTo(origin)

                        cam.position.lerp(camPos, first ? 1 : 0.1)
                        const ratio = first
                            ? 1
                            : cam.position.distanceTo(origin) / dist
                        cam.position.lerpVectors(origin, camPos, ratio)

                        cam.quaternion.copy(getWorldQuaternion(this.object3d))

                        const tooClose = alwaysVisible ? false : ratio < 0.35
                        tooClose !== tooCloseOld &&
                            setVisible(target, !tooClose)
                        tooCloseOld = tooClose

                        first = false
                    })
                    return () => {
                        handle.cancel()
                        bvhCameraSet.delete(cam)
                    }
                }, [this.targetState.get])
            }
        )
    }
}
