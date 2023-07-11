import { busyProcesses } from "../collections/busyProcesses"
import { busyCookingPtr } from "../pointers/busyCookingPtr"

export default () => busyProcesses.size > 0 || busyCookingPtr[0] > 0
