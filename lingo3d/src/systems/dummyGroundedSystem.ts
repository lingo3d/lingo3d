import { groundedControllerManagers } from "../display/core/PhysicsObjectManager/physx/physxLoop"
import Dummy from "../display/Dummy"
import renderSystemWithData from "./utils/renderSystemWithData"

export const [addDummyGroundedSystem, deleteDummyGroundedSystem] =
    renderSystemWithData(
        (self: Dummy, data: { poseService: { send: (val: string) => void } }) =>
            groundedControllerManagers.has(self) &&
            data.poseService.send("JUMP_STOP")
    )
