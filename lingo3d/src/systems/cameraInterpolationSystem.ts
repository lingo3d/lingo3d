import { PerspectiveCamera, Vector3, Quaternion } from "three"
import fpsAlpha from "../display/utils/fpsAlpha"
import getWorldPosition from "../memo/getWorldPosition"
import getWorldQuaternion from "../memo/getWorldQuaternion"
import interpolationCamera from "../engine/interpolationCamera"
import gameSystem from "./utils/gameSystem"

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const cameraInterpolationSystem = gameSystem({
    data: {} as {
        positionFrom: Vector3
        quaternionFrom: Quaternion
        cameraFrom: PerspectiveCamera
        progress: number
        diffMax: number
        onFinish: () => void
    },
    update: (cameraTo: PerspectiveCamera, data) => {
        const positionTo = getWorldPosition(cameraTo)
        const quaternionTo = getWorldQuaternion(cameraTo)

        interpolationCamera.position.lerpVectors(
            data.positionFrom,
            positionTo,
            data.progress
        )
        interpolationCamera.quaternion.slerpQuaternions(
            data.quaternionFrom,
            quaternionTo,
            data.progress
        )

        interpolationCamera.zoom = lerp(
            data.cameraFrom.zoom,
            cameraTo.zoom,
            data.progress
        )
        interpolationCamera.fov = lerp(
            data.cameraFrom.fov,
            cameraTo.fov,
            data.progress
        )
        interpolationCamera.updateProjectionMatrix()

        data.progress =
            Math.min((1 - data.progress) * fpsAlpha(0.1), data.diffMax) +
            data.progress

        if (data.progress < 0.9999) return
        cameraInterpolationSystem.delete(cameraTo)
        data.onFinish()
    }
})
