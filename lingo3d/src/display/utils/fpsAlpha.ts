import { fpsRatioPtr } from "../../pointers/fpsRatioPtr"

export default (alpha: number) => Math.min(alpha * fpsRatioPtr[0], 1)
