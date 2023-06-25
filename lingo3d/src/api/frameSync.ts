import { fpsRatioPtr } from "../pointers/fpsRatioPtr"

export default (num: number) => num * fpsRatioPtr[0]

export const frameSyncAlpha = (num: number) => Math.min(num * fpsRatioPtr[0], 1)
