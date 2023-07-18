import store, { createEffect } from "@lincode/reactivity"
import { Mesh, PlaneGeometry } from "three"
import { DEG2RAD } from "three/src/math/MathUtils"
import { standardMaterial } from "../display/utils/reusables"
import scene from "../engine/scene"
import { editorBehaviorPtr } from "../pointers/editorBehaviorPtr"
import { editorPlanePtr } from "../pointers/editorPlanePtr"
import { worldModePtr } from "../pointers/worldModePtr"
import { getEditorBehavior } from "./useEditorBehavior"
import { getWorldMode } from "./useWorldMode"
import Plane from "../display/primitives/Plane"
import { texturesUrlPtr } from "../pointers/assetsPathPointers"
import { lazy } from "@lincode/utils"
import { getGridY } from "./useGridY"
import { CM2M } from "../globals"

export const [setGrid, getGrid] = store(true)

const lazyGrid = lazy(() => {
    const grid = new Plane()
    grid.remove()
    grid.scale = 100
    grid.rotationX = -90
    grid.texture = texturesUrlPtr[0] + "/grid.jpg"
    grid.textureRepeat = 10
    return grid
})

createEffect(() => {
    if (!getGrid() || !editorBehaviorPtr[0] || worldModePtr[0] !== "editor")
        return

    const grid = lazyGrid()
    grid.visible = true

    const editorPlane = (editorPlanePtr[0] = new Mesh(
        new PlaneGeometry(1000, 1000),
        standardMaterial
    ))
    editorPlane.rotateX(90 * DEG2RAD)
    editorPlane.visible = false
    scene.add(editorPlane)

    const handle = getGridY((val) => {
        grid.y = val
        editorPlane.position.y = val * CM2M
    })
    return () => {
        grid.visible = false
        editorPlane.geometry.dispose()
        scene.remove(editorPlane)
        editorPlanePtr[0] = undefined
        handle.cancel()
    }
}, [getGrid, getEditorBehavior, getWorldMode])
