import { busyCookingPtr } from "../pointers/busyCookingPtr"
import { busyCountPtr } from "../pointers/busyCountPtr"

export default () => busyCountPtr[0] > 0 || busyCookingPtr[0] > 0
