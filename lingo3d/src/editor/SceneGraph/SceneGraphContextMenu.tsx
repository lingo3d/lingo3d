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
import JointBase from "../../display/core/JointBase"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import selectAllJointed from "./utils/selectAllJointed"
import SpriteSheet from "../../display/SpriteSheet"
import downloadBlob from "../../api/files/downloadBlob"
import {
    getSelectionFocus,
    setSelectionFocus
} from "../../states/useSelectionFocus"

const SceneGraphContextMenu = () => {
    const [position, setPosition] = useState<
        Point & { search?: boolean; createJoint?: boolean }
    >()
    const selectionTarget = useSyncState(getSelectionTarget)
    const [selectionFrozen] = useSyncState(getSelectionFrozen)
    const [timelineData] = useSyncState(getTimelineData)
    const timeline = useSyncState(getTimeline)
    const [multipleSelectionTargets] = useSyncState(getMultipleSelectionTargets)
    const selectionFocus = useSyncState(getSelectionFocus)

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
            {position.createJoint ? (
                <>
                    <ContextMenuItem
                        onClick={() => {
                            createJoint("fixedJoint")
                            setPosition(undefined)
                        }}
                    >
                        Fixed joint
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() => {
                            createJoint("sphericalJoint")
                            setPosition(undefined)
                        }}
                    >
                        Spherical joint
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() => {
                            createJoint("revoluteJoint")
                            setPosition(undefined)
                        }}
                    >
                        Revolute joint
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() => {
                            createJoint("prismaticJoint")
                            setPosition(undefined)
                        }}
                    >
                        Prismatic joint
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() => {
                            createJoint("d6Joint")
                            setPosition(undefined)
                        }}
                    >
                        D6 joint
                    </ContextMenuItem>
                </>
            ) : (
                <>
                    {multipleSelectionTargets.size ? (
                        <ContextMenuItem
                            disabled={multipleSelectionTargets.size === 1}
                            onClick={() => {
                                // createJoint("d6Joint")
                                // setPosition(undefined)
                                setPosition({ ...position, createJoint: true })
                            }}
                        >
                            Create joint
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
                                {selectionTarget instanceof SpriteSheet && (
                                    <ContextMenuItem
                                        onClick={() => {
                                            downloadBlob(
                                                "spriteSheet.png",
                                                selectionTarget.toBlob()
                                            )
                                            setPosition(undefined)
                                        }}
                                    >
                                        Save image
                                    </ContextMenuItem>
                                )}

                                <ContextMenuItem
                                    onClick={() =>
                                        setPosition({
                                            ...position,
                                            search: true
                                        })
                                    }
                                >
                                    Search children
                                </ContextMenuItem>

                                <ContextMenuItem
                                    onClick={() => {
                                        setSelectionFocus(
                                            selectionFocus
                                                ? undefined
                                                : selectionTarget
                                        )
                                        setPosition(undefined)
                                    }}
                                >
                                    {selectionFocus
                                        ? "Unfocus selection"
                                        : "Focus selection"}
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
                                    disabled={
                                        !(
                                            selectionTarget instanceof
                                                JointBase ||
                                            selectionTarget instanceof
                                                PhysicsObjectManager
                                        )
                                    }
                                    onClick={() => {
                                        selectAllJointed(
                                            selectionTarget instanceof JointBase
                                                ? selectionTarget.fromManager ??
                                                      selectionTarget.toManager
                                                : selectionTarget instanceof
                                                  PhysicsObjectManager
                                                ? selectionTarget
                                                : undefined
                                        )
                                        setPosition(undefined)
                                    }}
                                >
                                    Select all jointed
                                </ContextMenuItem>

                                <ContextMenuItem
                                    onClick={() => {
                                        selectionFrozen.has(selectionTarget)
                                            ? removeSelectionFrozen(
                                                  selectionTarget
                                              )
                                            : addSelectionFrozen(
                                                  selectionTarget
                                              )
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
                </>
            )}
        </ContextMenu>
    )
}

export default SceneGraphContextMenu
