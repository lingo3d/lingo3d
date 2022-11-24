import { useEffect, useState } from "preact/hooks"
import { Object3D } from "three"
import Appendable from "../../api/core/Appendable"
import Loaded from "../../display/core/Loaded"
import { isMeshItem } from "../../display/core/MeshItem"
import { onSelectionTarget } from "../../events/onSelectionTarget"
import { setSelectionNativeTarget } from "../../states/useSelectionNativeTarget"
import {
    addSelectionFrozen,
    clearSelectionFrozen,
    removeSelectionFrozen
} from "../../states/useSelectionFrozen"
import ContextMenu from "../component/ContextMenu"
import MenuItem from "../component/ContextMenu/MenuItem"
import { useSelectionFrozen, useSelectionTarget } from "../states"
import { Point } from "@lincode/math"
import Timeline from "../../display/Timeline"
import { setSceneGraphExpanded } from "../states/useSceneGraphExpanded"
import mousePosition from "../utils/mousePosition"
import { useTimelineData } from "../states/useTimelineData"
import { setTimeline, getTimeline } from "../states/useTimeline"

const traverseUp = (obj: Object3D, expandedSet: Set<Object3D>) => {
    expandedSet.add(obj)
    const nextParent = obj.userData.manager?.parent?.outerObject3d ?? obj.parent
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
    const [position, setPosition] = useState<Point>()
    const [input, setInput] = useState<"search" | "timeline">()
    const [selectionTarget, setSelectionTarget] = useSelectionTarget()
    const [[selectionFrozen]] = useSelectionFrozen()
    const [[timelineData]] = useTimelineData()

    useEffect(() => {
        const handle = onSelectionTarget(
            ({ rightClick }) => rightClick && setPosition(mousePosition)
        )
        return () => {
            handle.cancel()
        }
    }, [])

    useEffect(() => {
        !position && setInput(undefined)
    }, [position])

    if (!position) return null

    return (
        <ContextMenu position={position} setPosition={setPosition}>
            {input ? (
                <input
                    ref={(el) => el?.focus()}
                    style={{ all: "unset", padding: 6 }}
                    placeholder={
                        input === "search"
                            ? "Search child"
                            : "New timeline name"
                    }
                    onKeyDown={(e) => {
                        e.stopPropagation()
                        if (e.key !== "Enter" && e.key !== "Escape") return
                        if (e.key === "Enter" && selectionTarget) {
                            const { value } = e.target as HTMLInputElement
                            if (input === "search")
                                search(value, selectionTarget)
                            else if (input === "timeline") {
                                const timeline = new Timeline()
                                timeline.name = value
                                timeline.data = {
                                    [selectionTarget.uuid]: {}
                                }
                                setTimeline(timeline)
                                setSelectionTarget(timeline)
                            }
                        }
                        setPosition(undefined)
                    }}
                />
            ) : (
                <>
                    {isMeshItem(selectionTarget) && (
                        <>
                            <MenuItem onClick={() => setInput("search")}>
                                Search children
                            </MenuItem>

                            <MenuItem
                                disabled={
                                    !timelineData ||
                                    selectionTarget.uuid in timelineData
                                }
                                onClick={() => {
                                    const timeline = getTimeline()
                                    timeline?.mergeData({
                                        [selectionTarget.uuid]: {}
                                    })
                                    setPosition(undefined)
                                }}
                            >
                                Add to timeline
                            </MenuItem>

                            <MenuItem onClick={() => setInput("timeline")}>
                                Create timeline
                            </MenuItem>

                            <MenuItem
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
                            </MenuItem>
                        </>
                    )}
                    {selectionTarget instanceof Timeline && (
                        <MenuItem
                            onClick={() => {
                                setTimeline(selectionTarget)
                                setPosition(undefined)
                            }}
                        >
                            Edit timeline
                        </MenuItem>
                    )}
                    <MenuItem
                        disabled={!selectionFrozen.size}
                        onClick={() => {
                            clearSelectionFrozen()
                            setPosition(undefined)
                        }}
                    >
                        Unfreeze all
                    </MenuItem>
                </>
            )}
        </ContextMenu>
    )
}

export default SceneGraphContextMenu
