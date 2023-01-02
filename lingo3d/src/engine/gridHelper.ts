import { createEffect } from "@lincode/reactivity"
import { GridHelper } from "three"
import { getGridHelper } from "../states/useGridHelper"
import { getGridHelperSize } from "../states/useGridHelperSize"
import { getWorldPlayComputed } from "../states/useWorldPlayComputed"
import scene from "./scene"

createEffect(() => {
    if (!getGridHelper() || getWorldPlayComputed()) return

    const size = getGridHelperSize()
    const gridHelper = new GridHelper(size, size)
    scene.add(gridHelper)

    return () => {
        scene.remove(gridHelper)
    }
}, [getGridHelper, getGridHelperSize, getWorldPlayComputed])
