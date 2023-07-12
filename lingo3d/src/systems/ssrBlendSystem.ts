import { SSREffect } from "../engine/renderLoop/effectComposer/ssrEffect/SSREffect"
import { positionChanged } from "../memo/positionChanged"
import { quaternionChanged } from "../memo/quaternionChanged"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import { pixelRatioPtr } from "../pointers/pixelRatioPtr"
import createInternalSystem from "./utils/createInternalSystem"

export const ssrBlendSystem = createInternalSystem("ssrBlendSystem", {
    data: { blendCount: 0, pixelRatio: 1 },
    update: (self: SSREffect, data) => {
        const { blendCount } = data
        if (
            data.pixelRatio !== pixelRatioPtr[0] ||
            positionChanged(cameraRenderedPtr[0]) ||
            quaternionChanged(cameraRenderedPtr[0])
        )
            data.blendCount = 10
        else if (--data.blendCount < 0) data.blendCount = 0

        if (!blendCount && data.blendCount) {
            //@ts-ignore
            self.blend = 0.9
        } else if (blendCount && !data.blendCount) {
            //@ts-ignore
            self.blend = 0.99
        }
        data.pixelRatio = pixelRatioPtr[0]
    }
})
