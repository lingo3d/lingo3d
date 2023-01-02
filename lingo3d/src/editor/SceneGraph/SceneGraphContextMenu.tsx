import { useEffect, useState } from "preact/hooks"
import { onSelectionTarget } from "../../events/onSelectionTarget"
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
import mousePosition from "../utils/mousePosition"
import { getTimeline, setTimeline } from "../../states/useTimeline"
import useSyncState from "../hooks/useSyncState"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { getTimelineData } from "../../states/useTimelineData"
import { getMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import search from "./utils/search"
import createJoint from "./utils/createJoint"

const SceneGraphContextMenu = () => {
    const [position, setPosition] = useState<Point & { search?: boolean }>()
    const selectionTarget = useSyncState(getSelectionTarget)
    const [selectionFrozen] = useSyncState(getSelectionFrozen)
    const [timelineData] = useSyncState(getTimelineData)
    const timeline = useSyncState(getTimeline)
    const multipleSelectionTargets = useSyncState(getMultipleSelectionTargets)

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
            input={position.search && "Child name"}
            onInput={(value) =>
                position.search &&
                selectionTarget &&
                search(value, selectionTarget)
            }
        >
            {multipleSelectionTargets.length ? (
                <ContextMenuItem
                    disabled={multipleSelectionTargets.length === 1}
                    onClick={() => {
                        createJoint()
                        setPosition(undefined)
                    }}
                >
                    Create joints
                </ContextMenuItem>
            ) : selectionTarget instanceof Timeline ? (
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
            ) : (
                selectionTarget && (
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
                                timeline?.mergeData({
                                    [selectionTarget.uuid]: {}
                                })
                                setPosition(undefined)
                            }}
                        >
                            {timelineData &&
                            selectionTarget.uuid in timelineData
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
                )
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
