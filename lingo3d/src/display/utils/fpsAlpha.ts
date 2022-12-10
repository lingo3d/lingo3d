import { fpsRatioPtr } from "../../engine/eventLoop"

export default (alpha: number) => Math.min(alpha * fpsRatioPtr[0], 1)
