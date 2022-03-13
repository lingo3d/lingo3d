import store, { createEffect } from "@lincode/reactivity"
import { getContainerSize } from "./useContainerSize"
import { getResolutionScale } from "./useResolutionScale"

export const [setResolution, getResolution] = store(getContainerSize().map(s => s * getResolutionScale()))

createEffect(() => {
    const [width, height] = getContainerSize()
    const scale = getResolutionScale()

    setResolution([width * scale, height * scale])

}, [getResolutionScale, getContainerSize])