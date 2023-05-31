import { dtPtr } from "../pointers/dtPtr"
import createInternalSystem from "./utils/createInternalSystem"

export const updateDTSystem = createInternalSystem("updateDTSystem", {
    update: (target: { update: (dt: number) => void }) =>
        target.update(dtPtr[0])
})
