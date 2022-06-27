import { Object3D, Raycaster } from "three"
import { MouseEventName, mouseEvents } from "../../../api/mouse"
import { createEffect, createNestedEffect, createRef } from "@lincode/reactivity"
import { getSelection } from "../../../states/useSelection"
import { getSelectionTarget, setSelectionTarget } from "../../../states/useSelectionTarget"
import scene from "../../../engine/scene"
import { getMultipleSelection } from "../../../states/useMultipleSelection"
import { getMultipleSelectionTargets, pullMultipleSelectionTargets, pushMultipleSelectionTargets, resetMultipleSelectionTargets } from "../../../states/useMultipleSelectionTargets"
import { emitSelectionTarget, onSelectionTarget } from "../../../events/onSelectionTarget"
import { LingoMouseEvent } from "../../../interface/IMouse"
import { scaleUp } from "../../../engine/constants"
import { Cancellable } from "@lincode/promiselikes"
import { vec2Point } from "../../utils/vec2Point"
import mainCamera from "../../../engine/mainCamera"
import { getTransformControlsDragging } from "../../../states/useTransformControlsDragging"
import { debounce } from "@lincode/utils"
import { onSceneGraphChange } from "../../../events/onSceneGraphChange"
import { getSelectionBlockMouse } from "../../../states/useSelectionBlockMouse"
import StaticObjectManager from "."
import { isPositionedItem } from "../../../api/core/PositionedItem"
import { getCameraRendered } from "../../../states/useCameraRendered"
import { getObject3d } from "../MeshItem"
import { getSelectionFrozen } from "../../../states/useSelectionFrozen"
import { onSelectionRecompute } from "../../../events/onSelectionRecompute"

const raycaster = new Raycaster()

export const selectionCandidates = new Set<Object3D>()
const getSelectionCandidates = debounce(() => {
    const [frozenSet] = getSelectionFrozen()

    selectionCandidates.clear()
    scene.traverse(c => {
        const { manager } = c.userData
        manager && !frozenSet.has(manager) && selectionCandidates.add(getObject3d(manager))
    })
}, 0, "trailing")

const raycast = (x: number, y: number, candidates: Set<Object3D>) => {
    raycaster.setFromCamera({ x, y }, getCameraRendered())
    return raycaster.intersectObjects([...candidates])[0]
}

type Then = (obj: StaticObjectManager, e: LingoMouseEvent) => void

const pickable = (name: MouseEventName | Array<MouseEventName>, candidates: Set<Object3D>, then: Then) => (
    mouseEvents.on(name, e => {
        if (!candidates.size) return

        const result = raycast(e.xNorm, e.yNorm, candidates)
        if (!result) return

        const point = vec2Point(result.point)
        const distance = result.distance * scaleUp

        then(
            result.object.userData.manager,
            new LingoMouseEvent(e.clientX, e.clientY, e.x, e.y, e.z, e.xNorm, e.yNorm, point, distance)
        )
    })
)

export const clickSet = new Set<Object3D>()
export const mouseDownSet = new Set<Object3D>()
export const mouseUpSet = new Set<Object3D>()
export const mouseOverSet = new Set<Object3D>()
export const mouseOutSet = new Set<Object3D>()
export const mouseMoveSet = new Set<Object3D>()

const enableMouseEvents = () => {
    const handle = new Cancellable()

    handle.watch(pickable("click", clickSet, (obj, e) => obj.onClick?.(e)))
    handle.watch(pickable("down", mouseDownSet, (obj, e) => obj.onMouseDown?.(e)))
    handle.watch(pickable("up", mouseUpSet, (obj, e) => obj.onMouseUp?.(e)))

    let moveSet = new Set<StaticObjectManager>()
    let moveSetOld = new Set<StaticObjectManager>()

    handle.watch(pickable("move", mouseOverSet, (obj, e) => {
        moveSet.add(obj)
        obj.outerObject3d.userData.eMove = e
    }))
    handle.watch(pickable("move", mouseOutSet, (obj, e) => {
        moveSet.add(obj)
        obj.outerObject3d.userData.eMove = e
    }))
    handle.watch(pickable("move", mouseMoveSet, (obj, e) => {
        moveSet.add(obj)
        obj.outerObject3d.userData.eMove = e
    }))
    
    handle.watch(mouseEvents.on("move", () => {
        for (const obj of moveSet) {
            if (!moveSetOld.has(obj))
                obj.onMouseOver?.(obj.outerObject3d.userData.eMove)

            obj.onMouseMove?.(obj.outerObject3d.userData.eMove)
        }

        for (const obj of moveSetOld)
            if (!moveSet.has(obj))
                obj.onMouseOut?.(obj.outerObject3d.userData.eMove)

        moveSetOld = moveSet
        moveSet = new Set()
    }))

    return handle
}

createEffect(() => {
    const selection = getSelection() && getCameraRendered() === mainCamera
    const multipleSelection = getMultipleSelection()
    const firstMultipleSelection = createRef(true)

    createNestedEffect(() => {
        !multipleSelection && (firstMultipleSelection.current = true)
    }, [multipleSelection])

    if (selection && !getTransformControlsDragging()) {
        const handle = new Cancellable()

        getSelectionCandidates()
        handle.watch(onSceneGraphChange(getSelectionCandidates))
        handle.watch(onSelectionRecompute(() => (getSelectionCandidates(), emitSelectionTarget())))
        handle.watch(mouseEvents.on("click", () => emitSelectionTarget()))

        let rightClick = false
        handle.watch(mouseEvents.on("rightClick", () => {
            rightClick = true
            queueMicrotask(() => {
                if (!rightClick) return
                rightClick = false
                emitSelectionTarget(undefined, true)
            })
        }))
        
        handle.watch(pickable(["click", "rightClick"], selectionCandidates, target => {
            emitSelectionTarget(target, rightClick)
            rightClick = false
        }))
        handle.watch(onSelectionTarget(({ target, rightClick }) => {
            if (multipleSelection) {
                if (!isPositionedItem(target) || rightClick) return

                if (firstMultipleSelection.current) {
                    const currentTarget = getSelectionTarget()
                    isPositionedItem(currentTarget) && pushMultipleSelectionTargets(currentTarget)
                }
                firstMultipleSelection.current = false

                if (getMultipleSelectionTargets().includes(target))
                    pullMultipleSelectionTargets(target)
                else
                    pushMultipleSelectionTargets(target)
                    
                return
            }
            resetMultipleSelectionTargets()
            setSelectionTarget(rightClick ? target : (target === getSelectionTarget() ? undefined : target))
        }))

        if (!multipleSelection && !getSelectionBlockMouse())
            handle.watch(enableMouseEvents())

        return () => {
            handle.cancel()
        }
    }
    
    if (selection) return

    resetMultipleSelectionTargets()
    setSelectionTarget(undefined)

    const handle = enableMouseEvents()

    return () => {
        handle.cancel()
    }
}, [getSelection, getSelectionBlockMouse, getTransformControlsDragging, getCameraRendered, getMultipleSelection])