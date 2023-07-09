import { createEffect } from "@lincode/reactivity"
import { getEditorBehavior } from "../../states/useEditorBehavior"
import { getGrid } from "../../states/useGrid"
import scene from "../scene"
import InfiniteGridHelper from "./InfiniteGridHelper"
import { ssrExcludeSet } from "../../collections/ssrExcludeSet"
import { renderCheckExcludeSet } from "../../collections/renderCheckExcludeSet"
import { editorBehaviorPtr } from "../../pointers/editorBehaviorPtr"
import { getWorldMode } from "../../states/useWorldMode"
import { worldModePtr } from "../../pointers/worldModePtr"
import { Mesh, PlaneGeometry } from "three"
import { standardMaterial } from "../../display/utils/reusables"
import { editorPlanePtr } from "../../pointers/editorPlanePtr"
import { DEG2RAD } from "three/src/math/MathUtils"

createEffect(() => {
    if (!getGrid() || !editorBehaviorPtr[0] || worldModePtr[0] !== "editor")
        return

    const gridHelper = new InfiniteGridHelper()
    ssrExcludeSet.add(gridHelper)
    renderCheckExcludeSet.add(gridHelper)
    scene.add(gridHelper)

    const editorPlane = (editorPlanePtr[0] = new Mesh(
        new PlaneGeometry(1000, 1000),
        standardMaterial
    ))
    editorPlane.rotateX(90 * DEG2RAD)
    editorPlane.visible = false
    scene.add(editorPlane)

    return () => {
        scene.remove(gridHelper)
        ssrExcludeSet.delete(gridHelper)
        renderCheckExcludeSet.delete(gridHelper)

        editorPlane.geometry.dispose()
        scene.remove(editorPlane)
        editorPlanePtr[0] = undefined
    }
}, [getGrid, getEditorBehavior, getWorldMode])
