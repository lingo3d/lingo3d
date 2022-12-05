import { useEffect, useState } from "preact/hooks"
import { Object3D } from "three"
import Appendable from "../../api/core/Appendable"
import Loaded from "../../display/core/Loaded"
import { onSelectionTarget } from "../../events/onSelectionTarget"
import { setSelectionNativeTarget } from "../../states/useSelectionNativeTarget"
import {
    addSelectionFrozen,
    clearSelectionFrozen,
    getSelectionFrozen,
    removeSelectionFrozen
} from "../../states/useSelectionFrozen"
import ContextMenu from "../component/ContextMenu"
import ContextMenuItem from "../component/ContextMenu/ContextMenuItem"
import { Point } from "@lincode/math"
import Timeline from "../../display/Timeline"
import { setSceneGraphExpanded } from "../../states/useSceneGraphExpanded"
import mousePosition from "../utils/mousePosition"
import { getTimeline, setTimeline } from "../../states/useTimeline"
import useSyncState from "../hooks/useSyncState"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { getTimelineData } from "../../states/useTimelineData"
import { getManager } from "../../api/utils/manager"

const traverseUp = (obj: Object3D, expandedSet: Set<Object3D>) => {
    expandedSet.add(obj)
    const nextParent = getManager(obj)?.parent?.outerObject3d ?? obj.parent
    nextParent && traverseUp(nextParent, expandedSet)
}

const search = (n: string, target: Loaded | Appendable) => {
    const name = n.toLowerCase()
    let found: Object3D | undefined
    if (target instanceof Loaded)
        target.loadedGroup.traverse((item) => {
            if (found) return
            item.name.toLowerCase().includes(name) && (found = item)
        })
    else
        target.outerObject3d.traverse((item) => {
            if (found) return
            item.name.toLowerCase().includes(name) && (found = item)
        })
    if (!found) return

    const expandedSet = new Set<Object3D>()
    traverseUp(found, expandedSet)
    setSceneGraphExpanded(expandedSet)
    setSelectionNativeTarget(found)
}

const SceneGraphContextMenu = () => {
    const [position, setPosition] = useState<Point & { search?: boolean }>()
    const selectionTarget = useSyncState(getSelectionTarget)
    const [selectionFrozen] = useSyncState(getSelectionFrozen)
    const [timelineData] = useSyncState(getTimelineData)
    const timeline = useSyncState(getTimeline)

    useEffect(() => {
        const handle = onSelectionTarget(
            ({ rightClick }) => rightClick && setPosition(mousePosition)
        )
        return () => {
            handle.cancel()
        }
    }, [])

    if (!position) return null

    return (
        <ContextMenu
            position={position}
            setPosition={setPosition}
            input={position.search && "Search child"}
            onInput={(value) =>
                selectionTarget && search(value, selectionTarget)
            }
        >
            {selectionTarget && !(selectionTarget instanceof Timeline) && (
                <>
                    <ContextMenuItem
                        onClick={(e) =>
                            setPosition({
                                x: e.clientX,
                                y: e.clientY,
                                search: true
                            })
                        }
                    >
                        Search children
                    </ContextMenuItem>

                    <ContextMenuItem
                        disabled={
                            !timelineData ||
                            selectionTarget.uuid in timelineData
                        }
                        onClick={() => {
                            timeline?.mergeData({ [selectionTarget.uuid]: {} })
                            setPosition(undefined)
                        }}
                    >
                        {timelineData && selectionTarget.uuid in timelineData
                            ? "Already in timeline"
                            : "Add to timeline"}
                    </ContextMenuItem>

                    <ContextMenuItem
                        onClick={() => {
                            selectionFrozen.has(selectionTarget)
                                ? removeSelectionFrozen(selectionTarget)
                                : addSelectionFrozen(selectionTarget)
                            setPosition(undefined)
                        }}
                    >
                        {selectionFrozen.has(selectionTarget)
                            ? "Unfreeze selection"
                            : "Freeze selection"}
                    </ContextMenuItem>
                </>
            )}
            {selectionTarget instanceof Timeline && (
                <ContextMenuItem
                    disabled={selectionTarget === timeline}
                    onClick={() => {
                        setTimeline(selectionTarget)
                        setPosition(undefined)
                    }}
                >
                    {selectionTarget === timeline
                        ? "Already editing"
                        : "Edit timeline"}
                </ContextMenuItem>
            )}
            <ContextMenuItem
                disabled={!selectionFrozen.size}
                onClick={() => {
                    clearSelectionFrozen()
                    setPosition(undefined)
                }}
            >
                Unfreeze all
            </ContextMenuItem>
        </ContextMenu>
    )
}

export default SceneGraphContextMenu
