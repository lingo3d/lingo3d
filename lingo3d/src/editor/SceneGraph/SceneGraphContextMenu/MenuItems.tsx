import { ComponentChild } from "preact"
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
import Connector from "../../../visualScripting/Connector"
import GameGraph from "../../../visualScripting/GameGraph"
import ContextMenuItem from "../../component/ContextMenu/ContextMenuItem"
import useSyncState from "../../hooks/useSyncState"
import selectAllJointed from "../utils/selectAllJointed"
import CreateJointItems from "./CreateJointItems"
import sceneGraphMenuSignal from "./sceneGraphMenuSignal"

type Props = {
    selectionTarget: Appendable | MeshAppendable | undefined
    nativeTarget: Object3D | undefined
}

const MenuItems = ({ selectionTarget, nativeTarget }: Props) => {
    const [selectionFrozen] = useSyncState(getSelectionFrozen)
    const [timelineData] = useSyncState(getTimelineData)
    const timeline = useSyncState(getTimeline)
    const gameGraph = useSyncState(getGameGraph)
    const [multipleSelectionTargets] = useSyncState(getMultipleSelectionTargets)
    const selectionFocus = useSyncState(getSelectionFocus)

    if (sceneGraphMenuSignal.value?.createJoint) return <CreateJointItems />

    const children: Array<ComponentChild> = []
    if (multipleSelectionTargets.size)
        children.push(
            <ContextMenuItem
                disabled={multipleSelectionTargets.size === 1}
                onClick={() => {
                    // createJoint("d6Joint")
                    // setPosition(undefined)
                    sceneGraphMenuSignal.value = {
                        x: sceneGraphMenuSignal.value?.x ?? 0,
                        y: sceneGraphMenuSignal.value?.y ?? 0,
                        createJoint: true
                    }
                }}
            >
                Create joint
            </ContextMenuItem>
        )
    else if (selectionTarget instanceof Timeline)
        children.push(
            <ContextMenuItem
                disabled={selectionTarget === timeline}
                onClick={() => {
                    setTimeline(selectionTarget)
                    sceneGraphMenuSignal.value = undefined
                }}
            >
                {selectionTarget === timeline
                    ? "Already editing"
                    : "Edit Timeline"}
            </ContextMenuItem>
        )
    else if (selectionTarget instanceof GameGraph)
        children.push(
            <ContextMenuItem
                disabled={selectionTarget === gameGraph}
                onClick={() => {
                    setGameGraph(selectionTarget)
                    sceneGraphMenuSignal.value = undefined
                }}
            >
                {selectionTarget === gameGraph
                    ? "Already editing"
                    : "Edit GameGraph"}
            </ContextMenuItem>
        )
    else if (selectionTarget instanceof Connector) {
        //todo: connector context menu
    } else if (selectionTarget && !nativeTarget) {
        if (selectionTarget instanceof SpriteSheet)
            children.push(
                <ContextMenuItem
                    onClick={() => {
                        downloadBlob(
                            "spriteSheet.png",
                            selectionTarget.toBlob()
                        )
                        sceneGraphMenuSignal.value = undefined
                    }}
                >
                    Save image
                </ContextMenuItem>
            )
        else if (selectionTarget instanceof MeshAppendable) {
            if (selectionTarget instanceof PhysicsObjectManager)
                children.push(
                    <ContextMenuItem
                        onClick={() =>
                            (sceneGraphMenuSignal.value = {
                                x: sceneGraphMenuSignal.value?.x ?? 0,
                                y: sceneGraphMenuSignal.value?.y ?? 0,
                                search: true
                            })
                        }
                    >
                        Search children
                    </ContextMenuItem>,

                    <ContextMenuItem
                        onClick={() => {
                            setSelectionFocus(
                                selectionFocus === selectionTarget
                                    ? undefined
                                    : selectionTarget
                            )
                            emitSelectionTarget(undefined)
                            sceneGraphMenuSignal.value = undefined
                        }}
                    >
                        {selectionFocus === selectionTarget
                            ? "Exit selected"
                            : "Enter selected"}
                    </ContextMenuItem>,

                    <ContextMenuItem
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
                            sceneGraphMenuSignal.value = undefined
                        }}
                    >
                        Select all jointed
                    </ContextMenuItem>
                )
            children.push(
                <ContextMenuItem
                    onClick={() => {
                        selectionFrozen.has(selectionTarget)
                            ? removeSelectionFrozen(selectionTarget)
                            : addSelectionFrozen(selectionTarget)
                        sceneGraphMenuSignal.value = undefined
                    }}
                >
                    {selectionFrozen.has(selectionTarget)
                        ? "Unfreeze selection"
                        : "Freeze selection"}
                </ContextMenuItem>
            )
        }
        children.push(
            <ContextMenuItem
                disabled={!timelineData || selectionTarget.uuid in timelineData}
                onClick={() => {
                    timeline?.mergeData({
                        [selectionTarget.uuid]: {}
                    })
                    sceneGraphMenuSignal.value = undefined
                }}
            >
                {timelineData && selectionTarget.uuid in timelineData
                    ? "Already in Timeline"
                    : "Add to Timeline"}
            </ContextMenuItem>
        )
    }
    if (!selectionTarget)
        children.push(
            <ContextMenuItem
                disabled={!selectionFrozen.size}
                onClick={() => {
                    clearSelectionFrozen()
                    sceneGraphMenuSignal.value = undefined
                }}
            >
                Unfreeze all
            </ContextMenuItem>,

            <ContextMenuItem
                disabled={!selectionFocus}
                onClick={() => {
                    setSelectionFocus(undefined)
                    emitSelectionTarget(undefined)
                    sceneGraphMenuSignal.value = undefined
                }}
            >
                Exit all
            </ContextMenuItem>
        )
    else
        children.push(
            <ContextMenuItem
                disabled={!selectionTarget}
                onClick={() => {
                    sceneGraphMenuSignal.value = undefined
                    deleteSelected()
                }}
            >
                Delete selected
            </ContextMenuItem>
        )

    return <>{children}</>
}

export default MenuItems
