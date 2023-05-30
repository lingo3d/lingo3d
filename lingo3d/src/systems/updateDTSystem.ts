import { dtPtr } from "../pointers/dtPtr"
import createSystem from "./utils/createSystem"

export const updateDTSystem = createSystem({
    update: (target: { update: (dt: number) => void }) =>
        target.update(dtPtr[0])
})
