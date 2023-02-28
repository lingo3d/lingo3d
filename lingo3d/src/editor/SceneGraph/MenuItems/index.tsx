import { Object3D } from "three"
import Appendable from "../../../api/core/Appendable"
import MeshAppendable from "../../../api/core/MeshAppendable"
import downloadBlob from "../../../api/files/downloadBlob"
import JointBase from "../../../display/core/JointBase"
import PhysicsObjectManager from "../../../display/core/PhysicsObjectManager"
import SpriteSheet from "../../../display/SpriteSheet"
import Timeline from "../../../display/Timeline"
import deleteSelected from "../../../engine/hotkeys/deleteSelected"
import { emitSelectionTarget } from "../../../events/onSelectionTarget"
import { getGameGraph, setGameGraph } from "../../../states/useGameGraph"
import { getMultipleSelectionTargets } from "../../../states/useMultipleSelectionTargets"
import {
    getSelectionFocus,
    setSelectionFocus
} from "../../../states/useSelectionFocus"
import {
    removeSelectionFrozen,
    addSelectionFrozen,
    clearSelectionFrozen,
    getSelectionFrozen
} from "../../../states/useSelectionFrozen"
import { getTimeline, setTimeline } from "../../../states/useTimeline"
import { getTimelineData } from "../../../states/useTimelineData"
import GameGraph from "../../../visualScripting/GameGraph"
import ContextMenuItem from "../../component/ContextMenu/ContextMenuItem"
import useSyncState from "../../hooks/useSyncState"
import selectAllJointed from "../utils/selectAllJointed"
import CreateJointItems from "./CreateJointItems"
import { Position } from "./Position"

type Props = {
    position: Position
    setPosition: (val: Position | undefined) => void
    selectionTarget: Appendable | MeshAppendable | undefined
    nativeTarget: Object3D | undefined
}

const MenuItems = ({
    position,
    setPosition,
    selectionTarget,
    nativeTarget
}: Props) => {
    const [selectionFrozen] = useSyncState(getSelectionFrozen)
    const [timelineData] = useSyncState(getTimelineData)
    const timeline = useSyncState(getTimeline)
    const gameGraph = useSyncState(getGameGraph)
    const [multipleSelectionTargets] = useSyncState(getMultipleSelectionTargets)
    const selectionFocus = useSyncState(getSelectionFocus)

    return (
        <>
            {position.createJoint ? (
                <CreateJointItems setPosition={setPosition} />
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
                                : "Edit Timeline"}
                        </ContextMenuItem>
                    ) : selectionTarget instanceof GameGraph ? (
                        <ContextMenuItem
                            disabled={selectionTarget === gameGraph}
                            onClick={() => {
                                setGameGraph(selectionTarget)
                                setPosition(undefined)
                            }}
                        >
                            {selectionTarget === gameGraph
                                ? "Already editing"
                                : "Edit GameGraph"}
                        </ContextMenuItem>
                    ) : (
                        selectionTarget &&
                        !nativeTarget && (
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

                                {selectionTarget instanceof MeshAppendable && (
                                    <ContextMenuItem
                                        onClick={() => {
                                            setSelectionFocus(
                                                selectionFocus ===
                                                    selectionTarget
                                                    ? undefined
                                                    : selectionTarget
                                            )
                                            emitSelectionTarget(undefined)
                                            setPosition(undefined)
                                        }}
                                    >
                                        {selectionFocus === selectionTarget
                                            ? "Exit group"
                                            : "Enter group"}
                                    </ContextMenuItem>
                                )}

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
                                        ? "Already in Timeline"
                                        : "Add to Timeline"}
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

                    <ContextMenuItem
                        disabled={!selectionFocus}
                        onClick={() => {
                            setSelectionFocus(undefined)
                            emitSelectionTarget(undefined)
                            setPosition(undefined)
                        }}
                    >
                        Exit all groups
                    </ContextMenuItem>

                    <ContextMenuItem
                        disabled={!selectionTarget}
                        onClick={() => {
                            setPosition(undefined)
                            deleteSelected()
                        }}
                    >
                        Delete
                    </ContextMenuItem>
                </>
            )}
        </>
    )
}

export default MenuItems
