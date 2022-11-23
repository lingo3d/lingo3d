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
import { setTimeline } from "../../states/useTimeline"
import { setSceneGraphExpanded } from "../states/useSceneGraphExpanded"
import mousePosition from "../utils/mousePosition"

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
    const [showSearch, setShowSearch] = useState(false)
    const [selectionTarget] = useSelectionTarget()
    const [[selectionFrozen]] = useSelectionFrozen()

    useEffect(() => {
        const handle = onSelectionTarget(
            ({ rightClick }) => rightClick && setPosition(mousePosition)
        )
        return () => {
            handle.cancel()
        }
    }, [])

    useEffect(() => {
        !position && setShowSearch(false)
    }, [position])

    if (!position) return null

    return (
        <ContextMenu position={position} setPosition={setPosition}>
            {showSearch ? (
                <input
                    ref={(el) => el?.focus()}
                    style={{ all: "unset", padding: 6 }}
                    onKeyDown={(e) => {
                        e.stopPropagation()
                        if (e.key !== "Enter" && e.key !== "Escape") return
                        e.key === "Enter" &&
                            selectionTarget &&
                            search(
                                (e.target as HTMLInputElement).value,
                                selectionTarget
                            )
                        setPosition(undefined)
                    }}
                />
            ) : (
                <>
                    {isMeshItem(selectionTarget) && (
                        <>
                            <MenuItem onClick={() => setShowSearch(true)}>
                                Search children
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
