import { lightDistancePtr } from "./lightDistancePtr"

export const lightIncrementPtr = [0, 0, 0, 0]

export const computeLightIncrement = () => {
    const increment = lightDistancePtr[0] / 5
    lightIncrementPtr[0] = increment
    lightIncrementPtr[1] = increment * 2
    lightIncrementPtr[2] = increment * 3
    lightIncrementPtr[3] = increment * 4
}

computeLightIncrement()
