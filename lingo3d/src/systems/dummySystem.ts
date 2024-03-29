import { euler } from "../display/utils/reusables"
import { Point3dType } from "../typeGuards/isPoint"
import createInternalSystem from "./utils/createInternalSystem"
import { StrideMode } from "../interface/IDummy"
import FoundManager from "../display/core/FoundManager"
import { Quaternion } from "three"
import Dummy from "../display/Dummy"
import { frameSyncAlpha } from "../api/frameSync"
import { DEG2RAD } from "three/src/math/MathUtils"
import polarTranslate from "../math/polarTranslate"

export const dummySystem = createInternalSystem("dummySystem", {
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

        const loadedObject = self.$loadedObject!
        const quaternionOld = loadedObject.quaternion.clone()

        let spinePoint: Point3dType | undefined
        if (strideMode === "aim" && spine && spineQuaternion) {
            loadedObject.quaternion.copy(loadedItemQuaternion)
            spine.quaternion.copy(spineQuaternion)
            spinePoint = spine.pointAt(1000)
        }

        loadedObject.quaternion.setFromEuler(euler.set(0, angle * DEG2RAD, 0))
        const quaternionNew = loadedObject.quaternion.clone()
        loadedObject.quaternion
            .copy(quaternionOld)
            .slerp(quaternionNew, frameSyncAlpha(0.2))

        spinePoint && spine?.lookAt(spinePoint)

        if (!strideMove) return

        const { x, y } = polarTranslate(
            0,
            0,
            angle + 90,
            Math.max(Math.abs(strideForward), Math.abs(strideRight))
        )
        self.moveForward(backwards ? y : -y)
        self.moveRight(backwards ? x : -x)
    }
})
