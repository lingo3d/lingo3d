import { Object3D, Raycaster } from "three"
import { MouseEventName, mouseEvents } from "../../../api/mouse"
import { createEffect, createRef } from "@lincode/reactivity"
import { getSelection } from "../../../states/useSelection"
import { getSelectionTarget, setSelectionTarget } from "../../../states/useSelectionTarget"
import { getCamera } from "../../../states/useCamera"
import { getSelectionEnabled } from "../../../states/useSelectionEnabled"
import scene from "../../../engine/scene"
import SimpleObjectManager from "."
import { getMultipleSelection } from "../../../states/useMultipleSelection"
import { getMultipleSelectionTargets, pullMultipleSelectionTargets, pushMultipleSelectionTargets, resetMultipleSelectionTargets } from "../../../states/useMultipleSelectionTargets"
import { emitSelectionTarget, onSelectionTarget } from "../../../events/onSelectionTarget"
import { MouseInteractionPayload } from "../../../interface/IMouse"
import Point3d from "../../../api/Point3d"
import { scaleUp } from "../../../engine/constants"

const raycaster = new Raycaster()

const getSelectionCandidates = (): Set<Object3D> => {
    const result = new Set<Object3D>()
    scene.traverse(c => {
        const { manager } = c.userData
        manager && result.add(manager.object3d)
    })
    return result
}

const raycast = (x: number, y: number, objectSet: Set<Object3D>) => {
    raycaster.setFromCamera({ x, y }, getCamera())
    return raycaster.intersectObjects([...objectSet])[0]
}

type Then = (obj: SimpleObjectManager | undefined, e: MouseInteractionPayload) => void

const pickable = (name: MouseEventName, objectSet: Set<Object3D>, then: Then) => (
    mouseEvents.on(name, e => {
        const result = raycast(e.xNorm, e.yNorm, objectSet)
        if (!result) return

        const { x, y, z } = result.point

        const point = new Point3d(x * scaleUp, y * scaleUp, z * scaleUp)
        const distance = result.distance * scaleUp

        then(result.object.userData.manager, { ...e, point, distance })
    })
)

export const clickSet = new Set<Object3D>()
export const mouseDownSet = new Set<Object3D>()
export const mouseUpSet = new Set<Object3D>()
export const mouseOverSet = new Set<Object3D>()
export const mouseOutSet = new Set<Object3D>()
export const mouseMoveSet = new Set<Object3D>()

createEffect(() => {
    const selection = getSelection()
    const selectionEnabled = getSelectionEnabled()
    const multipleSelection = getMultipleSelection()
    const firstMultipleSelection = createRef(true)

    createEffect(() => {
        !multipleSelection && (firstMultipleSelection.current = true)
    }, [multipleSelection])

    if (selection) {
        if (selectionEnabled) {
            const handle0 = pickable("click", getSelectionCandidates(), target => {
                const parent = target?.outerObject3d.parent
                const parentInstance = parent?.userData.manager
                emitSelectionTarget(parentInstance ?? target)
            })
            const handle1 = onSelectionTarget(target => {
                if (multipleSelection) {
                    if (target) {
                        if (firstMultipleSelection.current) {
                            const currentTarget = getSelectionTarget()
                            currentTarget && pushMultipleSelectionTargets(currentTarget)
                        }
                        firstMultipleSelection.current = false

                        if (getMultipleSelectionTargets().includes(target))
                            pullMultipleSelectionTargets(target)
                        else
                            pushMultipleSelectionTargets(target)
                    }
                }
                else {
                    resetMultipleSelectionTargets()
                    setSelectionTarget(target)
                }
            })
            return () => {
                handle0.cancel()
                handle1.cancel()
            }
        }
    }
    else {
        resetMultipleSelectionTargets()
        setSelectionTarget(undefined)

        const clickHandle = pickable("click", clickSet, (obj, e) => obj?.onClick?.(e))
        const downHandle = pickable("down", mouseDownSet, (obj, e) => obj?.onMouseDown?.(e))
        const upHandle = pickable("up", mouseUpSet, (obj, e) => obj?.onMouseUp?.(e))

        let moveSet = new Set<SimpleObjectManager>()
        let moveSetOld = new Set<SimpleObjectManager>()

        const overHandle = pickable("move", mouseOverSet, (obj, e) => {
            if (!obj) return
            moveSet.add(obj)
            obj.outerObject3d.userData.eMove = e
        })
        const outHandle = pickable("move", mouseOutSet, (obj, e) => {
            if (!obj) return
            moveSet.add(obj)
            obj.outerObject3d.userData.eMove = e
        })
        const moveHandle = pickable("move", mouseMoveSet, (obj, e) => {
            if (!obj) return
            moveSet.add(obj)
            obj.outerObject3d.userData.eMove = e
        })
        
        const mouseMoveHandle = mouseEvents.on("move", () => {
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
        })

        return () => {
            clickHandle.cancel()
            downHandle.cancel()
            upHandle.cancel()
            overHandle.cancel()
            outHandle.cancel()
            moveHandle.cancel()
            mouseMoveHandle.cancel()
        }
    }
}, [getSelection, getSelectionEnabled, getMultipleSelection])