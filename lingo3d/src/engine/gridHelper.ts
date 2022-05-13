import { createEffect } from "@lincode/reactivity"
import { GridHelper } from "three"
import { getGridHelper } from "../states/useGridHelper"
import { getGridHelperSize } from "../states/useGridHelperSize"
import scene from "./scene"

export default {}

createEffect(() => {
    if (!getGridHelper()) return

    const size = getGridHelperSize()
    const gridHelper = new GridHelper(size, size)
    scene.add(gridHelper)

    return () => {
        scene.remove(gridHelper)
    }
}, [getGridHelper, getGridHelperSize])