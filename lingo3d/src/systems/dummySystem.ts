import { deg2Rad, endPoint } from "@lincode/math"
import fpsAlpha from "../display/utils/fpsAlpha"
import { euler } from "../display/utils/reusables"
import { Point3dType } from "../utils/isPoint"
import createSystem from "./utils/createSystem"
import { StrideMode } from "../interface/IDummy"
import FoundManager from "../display/core/FoundManager"
import { Quaternion } from "three"
import Dummy from "../display/Dummy"

export const dummySystem = createSystem("dummySystem", {
    data: {} as {
        poseService: { send: (val: string) => void }
        backwards: boolean
        strideMode: StrideMode
        spine: FoundManager | undefined
        spineQuaternion: Quaternion | undefined
        loadedItemQuaternion: Quaternion
        strideMove: boolean
        angle: number
        strideForward: number
        strideRight: number
    },
    update: (
        self: Dummy,
        {
            poseService,
            backwards,
            strideMode,
            spine,
            spineQuaternion,
            loadedItemQuaternion,
            strideMove,
            angle,
            strideForward,
            strideRight
        }
    ) => {
        poseService.send(backwards ? "RUN_BACKWARDS_START" : "RUN_START")

        const loadedObject3d = self.$loadedObject3d!
        const quaternionOld = loadedObject3d.quaternion.clone()

        let spinePoint: Point3dType | undefined
        if (strideMode === "aim" && spine && spineQuaternion) {
            loadedObject3d.quaternion.copy(loadedItemQuaternion)
            spine.quaternion.copy(spineQuaternion)
            spinePoint = spine.pointAt(1000)
        }

        loadedObject3d.quaternion.setFromEuler(euler.set(0, angle * deg2Rad, 0))
        const quaternionNew = loadedObject3d.quaternion.clone()
        loadedObject3d.quaternion
            .copy(quaternionOld)
            .slerp(quaternionNew, fpsAlpha(0.2))

        spinePoint && spine?.lookAt(spinePoint)

        if (!strideMove) return

        const { x, y } = endPoint(
            0,
            0,
            angle + 90,
            Math.max(Math.abs(strideForward), Math.abs(strideRight))
        )
        self.moveForward(backwards ? y : -y)
        self.moveRight(backwards ? x : -x)
    }
})
