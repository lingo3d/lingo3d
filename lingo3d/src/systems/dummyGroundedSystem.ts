import { groundedControllerManagers } from "../collections/pxCollections"
import Dummy from "../display/Dummy"
import createSystem from "./utils/createSystem"

export const dummyGroundedSystem = createSystem("dummyGroundedSystem", {
    data: {} as { poseService: { send: (val: string) => void } },
    update: (self: Dummy, data) =>
        groundedControllerManagers.has(self) &&
        data.poseService.send("JUMP_STOP")
})
