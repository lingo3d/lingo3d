import { AnimationClip, AnimationMixer } from "three"
import computeOnce2 from "./utils/computeOnce2"

export default computeOnce2((mixer: AnimationMixer, clip: AnimationClip) =>
    mixer.clipAction(clip)
)
