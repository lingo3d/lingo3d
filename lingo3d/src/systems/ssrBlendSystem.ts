import { SSREffect } from "../engine/renderLoop/effectComposer/ssrEffect/SSREffect"
import { positionChanged } from "../memo/positionChanged"
import { quaternionChanged } from "../memo/quaternionChanged"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import unsafeSetValue from "../utils/unsafeSetValue"
import createInternalSystem from "./utils/createInternalSystem"

export const ssrBlendSystem = createInternalSystem("ssrBlendSystem", {
    data: { moving: false },
    effect: (self: SSREffect) => {
        unsafeSetValue(self, "blend", 0.99)
    },
    update: (self, data) => {
        const { moving } = data
        data.moving =
            positionChanged(cameraRenderedPtr[0]) ||
            quaternionChanged(cameraRenderedPtr[0])

        if (!moving && data.moving) unsafeSetValue(self, "blend", 0.9)
        else if (moving && !data.moving) unsafeSetValue(self, "blend", 0.99)
    }
})
