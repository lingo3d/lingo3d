import { getEditorActive } from "../../../../states/useEditorActive"
import ThirdPersonCamera from "../../../cameras/ThirdPersonCamera"
import getWorldPosition from "../../../utils/getWorldPosition"
import getWorldQuaternion from "../../../utils/getWorldQuaternion"
import { bvhCameraSet, onBeforeCameraLoop } from "./bvh/bvhCameraLoop"

function setVisible(this: ThirdPersonCamera, visible: boolean) {
    const target = this.targetState.get()

    //@ts-ignore
    if (target && target._visible === undefined)
        target.outerObject3d.visible = visible

    for (const child of this.camera.children)
        if (child.userData.manager?._visible === undefined)
            child.visible = visible
}

export default function(this: ThirdPersonCamera) {
    if (this.done) return

    const cam = this.camera
    
    bvhCameraSet.add(cam)
    this.then(() => bvhCameraSet.delete(cam))

    
    this.createEffect(() => {
        const target = this.targetState.get()
        if (!target) return

        let tooCloseOld = true
        setVisible.call(this, !tooCloseOld)

        let first = true

        const handle = onBeforeCameraLoop(() => {
            const origin = getWorldPosition(this.outerObject3d)
            const camPos = getWorldPosition(this.object3d)
            const dist = camPos.distanceTo(origin)
    
            cam.position.lerp(camPos, first ? 1 : 0.1)
            const ratio = first ? 1 : cam.position.distanceTo(origin) / dist
            cam.position.lerpVectors(origin, camPos, ratio)

            cam.quaternion.copy(getWorldQuaternion(this.object3d))
    
            const tooClose = getEditorActive() ? false : ratio < 0.35
            tooClose !== tooCloseOld && setVisible.call(this, !tooClose)
            tooCloseOld = tooClose

            first = false
        })
        return () => {
            handle.cancel()
        }
    }, [this.targetState.get])
}