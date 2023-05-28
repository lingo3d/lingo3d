import { groundedControllerManagers } from "../collections/pxCollections"
import Dummy from "../display/Dummy"
import gameSystem from "./utils/gameSystem"

export const dummyGroundedSystem = gameSystem({
    data: {} as { poseService: { send: (val: string) => void } },
    update: (self: Dummy, data) =>
        groundedControllerManagers.has(self) &&
        data.poseService.send("JUMP_STOP")
})
