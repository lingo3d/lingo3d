import { groundedControllerManagers } from "../collections/pxCollections"
import Dummy from "../display/Dummy"
import createInternalSystem from "./utils/createInternalSystem"

export const dummyGroundedSystem = createInternalSystem("dummyGroundedSystem", {
    data: {} as { poseService: { send: (val: string) => void } },
    update: (self: Dummy, data) =>
        groundedControllerManagers.has(self) &&
        data.poseService.send("JUMP_STOP")
})
