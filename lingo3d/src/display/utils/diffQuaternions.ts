import { Quaternion } from "three"

export default (A: Quaternion, B: Quaternion) =>
    A.clone().multiply(B.clone().invert())
