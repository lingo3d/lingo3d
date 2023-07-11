import { busyProcesses } from "../collections/busyProcesses"
import { busyCookingPtr } from "../pointers/busyCookingPtr"
import { worldModePtr } from "../pointers/worldModePtr"

export default () =>
    busyProcesses.size > 0 ||
    (busyCookingPtr[0] > 0 && worldModePtr[0] === "default")
