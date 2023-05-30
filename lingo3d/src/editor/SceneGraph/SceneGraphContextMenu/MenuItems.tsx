import { ComponentChild } from "preact"
import Appendable from "../../../display/core/Appendable"
import MeshAppendable from "../../../display/core/MeshAppendable"
import downloadBlob from "../../../utils/downloadBlob"
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
import MenuButton from "../../component/MenuButton"
import useSyncState from "../../hooks/useSyncState"
import selectAllJointed from "./selectAllJointed"
import CreateJointItems from "./CreateJointItems"
import Template from "../../../display/Template"
import VisibleObjectManager from "../../../display/core/VisibleObjectManager"
import { librarySignal } from "../../Library/librarySignal"
import { selectTab } from "../../component/tabs/Tab"
import { sceneGraphContextMenuSignal } from "."
import Model from "../../../display/Model"
import {
    clearSelectionHideId,
    getSelectionHideId
} from "../../../states/useSelectionHideId"
import groupSelected from "../../../engine/hotkeys/groupSelected"

type Props = {
    selectionTarget: Appendable | MeshAppendable | undefined
}

const MenuItems = ({ selectionTarget }: Props) => {
    const [selectionFrozen] = useSyncState(getSelectionFrozen)
    const [timelineData] = useSyncState(getTimelineData)
    const timeline = useSyncState(getTimeline)
    const gameGraph = useSyncState(getGameGraph)
    const [multipleSelectionTargets] = useSyncState(getMultipleSelectionTargets)
    const selectionFocus = useSyncState(getSelectionFocus)
    const [selectionHideId] = useSyncState(getSelectionHideId)

    if (sceneGraphContextMenuSignal.value?.createJoint)
        return <CreateJointItems />

    const children: Array<ComponentChild> = []
    if (multipleSelectionTargets.size)
        children.push(
            <>
                <MenuButton
                    disabled={multipleSelectionTargets.size === 1}
                    onClick={() => {
                        sceneGraphContextMenuSignal.value = {
                            x: sceneGraphContextMenuSignal.value?.x ?? 0,
                            y: sceneGraphContextMenuSignal.value?.y ?? 0,
                            createJoint: true
                        }
                    }}
                >
                    Create joint
                </MenuButton>
                <MenuButton
                    disabled={multipleSelectionTargets.size === 1}
                    onClick={groupSelected}
                >
                    Group selected
                </MenuButton>
            </>
        )
    else if (selectionTarget instanceof Timeline)
        children.push(
            <MenuButton
                disabled={selectionTarget === timeline}
                onClick={() => {
                    setTimeline(selectionTarget)
                    sceneGraphContextMenuSignal.value = undefined
                }}
            >
                {selectionTarget === timeline
                    ? "Already editing"
                    : "Edit Timeline"}
            </MenuButton>
        )
    else if (selectionTarget instanceof GameGraph)
        children.push(
            <MenuButton
                disabled={selectionTarget === gameGraph}
                onClick={() => {
                    setGameGraph(selectionTarget)
                    sceneGraphContextMenuSignal.value = undefined
                }}
            >
                {selectionTarget === gameGraph
                    ? "Already editing"
                    : "Edit GameGraph"}
            </MenuButton>
        )
    else if (selectionTarget instanceof Connector) {
        //todo: connector context menu
    } else if (selectionTarget) {
        if (selectionTarget instanceof SpriteSheet)
            children.push(
                <MenuButton
                    onClick={() => {
                        downloadBlob(
                            "spriteSheet.png",
                            selectionTarget.toBlob()
                        )
                        sceneGraphContextMenuSignal.value = undefined
                    }}
                >
                    Save image
                </MenuButton>
            )
        else if (selectionTarget instanceof MeshAppendable) {
            if (selectionTarget instanceof Model)
                children.push(
                    <MenuButton
                        onClick={() =>
                            (sceneGraphContextMenuSignal.value = {
                                x: sceneGraphContextMenuSignal.value?.x ?? 0,
                                y: sceneGraphContextMenuSignal.value?.y ?? 0,
                                search: true
                            })
                        }
                    >
                        Search children
                    </MenuButton>
                )
            if (selectionTarget instanceof VisibleObjectManager) {
                children.push(
                    <MenuButton
                        onClick={() => {
                            setSelectionFocus(
                                selectionFocus === selectionTarget
                                    ? undefined
                                    : selectionTarget
                            )
                            emitSelectionTarget(undefined)
                            sceneGraphContextMenuSignal.value = undefined
                        }}
                    >
                        {selectionFocus === selectionTarget
                            ? "Unfocus children"
                            : "Focus children"}
                    </MenuButton>,

                    <MenuButton
                        onClick={() => {
                            const template = new Template()
                            template.source = selectionTarget
                            selectTab(librarySignal, "templates")
                            sceneGraphContextMenuSignal.value = undefined
                        }}
                    >
                        Convert to template
                    </MenuButton>
                )
                if (selectionTarget instanceof PhysicsObjectManager)
                    children.push(
                        <MenuButton
                            onClick={() => {
                                selectAllJointed(
                                    selectionTarget instanceof JointBase
                                        ? selectionTarget.$fromManager ??
                                              selectionTarget.$toManager
                                        : selectionTarget instanceof
                                          PhysicsObjectManager
                                        ? selectionTarget
                                        : undefined
                                )
                                sceneGraphContextMenuSignal.value = undefined
                            }}
                        >
                            Select all jointed
                        </MenuButton>
                    )
            }
            children.push(
                <MenuButton
                    onClick={() => {
                        selectionFrozen.has(selectionTarget)
                            ? removeSelectionFrozen(selectionTarget)
                            : addSelectionFrozen(selectionTarget)
                        sceneGraphContextMenuSignal.value = undefined
                    }}
                >
                    {selectionFrozen.has(selectionTarget)
                        ? "Unfreeze selection"
                        : "Freeze selection"}
                </MenuButton>
            )
        }
        children.push(
            <MenuButton
                disabled={!timelineData || selectionTarget.uuid in timelineData}
                onClick={() => {
                    timeline?.mergeData({
                        [selectionTarget.uuid]: {}
                    })
                    sceneGraphContextMenuSignal.value = undefined
                }}
            >
                {timelineData && selectionTarget.uuid in timelineData
                    ? "Already in Timeline"
                    : "Add to Timeline"}
            </MenuButton>
        )
    }
    children.push(
        <MenuButton
            onClick={() =>
                (sceneGraphContextMenuSignal.value = {
                    x: sceneGraphContextMenuSignal.value?.x ?? 0,
                    y: sceneGraphContextMenuSignal.value?.y ?? 0,
                    hideId: true
                })
            }
        >
            Hide objects by id
        </MenuButton>
    )
    if (!selectionTarget)
        children.push(
            <MenuButton
                disabled={!selectionFrozen.size}
                onClick={() => {
                    clearSelectionFrozen()
                    sceneGraphContextMenuSignal.value = undefined
                }}
            >
                Unfreeze all
            </MenuButton>,

            <MenuButton
                disabled={!selectionFocus}
                onClick={() => {
                    setSelectionFocus(undefined)
                    emitSelectionTarget(undefined)
                    sceneGraphContextMenuSignal.value = undefined
                }}
            >
                Unfocus all
            </MenuButton>,

            <MenuButton
                disabled={!selectionHideId.size}
                onClick={() => {
                    clearSelectionHideId()
                    sceneGraphContextMenuSignal.value = undefined
                }}
            >
                Unhide all
            </MenuButton>
        )
    else
        children.push(
            <MenuButton
                disabled={!selectionTarget}
                onClick={() => {
                    deleteSelected()
                    sceneGraphContextMenuSignal.value = undefined
                }}
            >
                Delete selected
            </MenuButton>
        )

    return <>{children}</>
}

export default MenuItems
