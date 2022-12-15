import { createEffect } from "@lincode/reactivity"
import mainCamera from "../../engine/mainCamera"
import { onBeforeCameraLoop } from "../../events/onBeforeCameraLoop"
import { onBeforeRender } from "../../events/onBeforeRender"
import IThirdPersonCamera, {
    thirdPersonCameraDefaults,
    thirdPersonCameraSchema
} from "../../interface/IThirdPersonCamera"
import { getCameraRendered } from "../../states/useCameraRendered"
import { getEditorMounted } from "../../states/useEditorMounted"
import { getEditorPlay } from "../../states/useEditorPlay"
import CharacterCamera from "../core/CharacterCamera"
import MeshItem from "../core/MeshItem"
import fpsAlpha from "../utils/fpsAlpha"
import getWorldPosition from "../utils/getWorldPosition"
import getWorldQuaternion from "../utils/getWorldQuaternion"

const setVisible = (target: MeshItem, visible: boolean) => {
    "visible" in target && (target.visible = visible)
}

let alwaysVisible = false

createEffect(() => {
    alwaysVisible =
        !getEditorPlay() ||
        (getEditorMounted() && getCameraRendered() === mainCamera)
}, [getEditorMounted, getEditorMounted, getCameraRendered])

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

            let tooCloseOld = true
            setVisible(found, !tooCloseOld)

            let first = true
            const handle = onBeforeCameraLoop(() => {
                const origin = getWorldPosition(this.outerObject3d)
                const camPos = getWorldPosition(this.object3d)
                const dist = camPos.distanceTo(origin)

                cam.position.lerp(camPos, first ? 1 : fpsAlpha(0.1))
                const ratio = first ? 1 : cam.position.distanceTo(origin) / dist
                cam.position.lerpVectors(origin, camPos, ratio)

                cam.quaternion.copy(getWorldQuaternion(this.object3d))

                const tooClose = alwaysVisible ? false : ratio < 0.35
                tooClose !== tooCloseOld && setVisible(found, !tooClose)
                tooCloseOld = tooClose

                first = false
            })
            return () => {
                handle.cancel()
            }
        }, [this.foundState.get])
    }
}
