import { dtPtr } from "../pointers/dtPtr"
import gameSystem from "./utils/gameSystem"

export const updateDTSystem = gameSystem({
    update: (target: { update: (dt: number) => void }) =>
        target.update(dtPtr[0])
})
