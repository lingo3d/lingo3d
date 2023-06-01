import { nanoid } from "nanoid"
import computeOnce from "./utils/computeOnce"

export default computeOnce((_: object) => nanoid())
