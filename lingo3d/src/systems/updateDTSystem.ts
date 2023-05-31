import { dtPtr } from "../pointers/dtPtr"
import createSystem from "./utils/createInternalSystem"

export const updateDTSystem = createSystem("updateDTSystem", {
    update: (target: { update: (dt: number) => void }) =>
        target.update(dtPtr[0])
})
