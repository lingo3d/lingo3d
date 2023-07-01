import { busyCookingPtr } from "../pointers/busyCookingPtr"
import { busyCountPtr } from "../pointers/busyCountPtr"
import { worldModePtr } from "../pointers/worldModePtr"

export default () =>
    busyCountPtr[0] > 0 ||
    (busyCookingPtr[0] > 0 && worldModePtr[0] === "default")
