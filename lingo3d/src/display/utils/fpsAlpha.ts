import { fpsRatio } from "../../engine/eventLoop"

export default (alpha: number) => Math.min(alpha * fpsRatio[0], 1)
