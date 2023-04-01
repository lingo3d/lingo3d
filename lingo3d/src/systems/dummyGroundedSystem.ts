import { groundedControllerManagers } from "../collections/pxCollections"
import Dummy from "../display/Dummy"
import renderSystemWithData from "./utils/renderSystemWithData"

export const [addDummyGroundedSystem, deleteDummyGroundedSystem] =
    renderSystemWithData(
        (self: Dummy, data: { poseService: { send: (val: string) => void } }) =>
            groundedControllerManagers.has(self) &&
            data.poseService.send("JUMP_STOP")
    )
