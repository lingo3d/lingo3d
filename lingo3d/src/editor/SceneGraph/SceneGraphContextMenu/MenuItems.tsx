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
import { emitEditorGroupItems } from "../../../events/onEditorGroupItems"
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
import sceneGraphMenuSignal from "./sceneGraphMenuSignal"
import Template from "../../../display/Template"
import VisibleObjectManager from "../../../display/core/VisibleObjectManager"
import { librarySignal } from "../../Library/librarySignal"
import { selectTab } from "../../component/tabs/Tab"

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
            <>
                <MenuButton
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
                </MenuButton>
                <MenuButton
                    disabled={multipleSelectionTargets.size === 1}
                    onClick={() => emitEditorGroupItems()}
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
                    sceneGraphMenuSignal.value = undefined
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
                    sceneGraphMenuSignal.value = undefined
                }}
            >
                {selectionTarget === gameGraph
                    ? "Already editing"
                    : "Edit GameGraph"}
            </MenuButton>
        )
    else if (selectionTarget instanceof Connector) {
        //todo: connector context menu
    } else if (selectionTarget && !nativeTarget) {
        if (selectionTarget instanceof SpriteSheet)
            children.push(
                <MenuButton
                    onClick={() => {
                        downloadBlob(
                            "spriteSheet.png",
                            selectionTarget.toBlob()
                        )
                        sceneGraphMenuSignal.value = undefined
                    }}
                >
                    Save image
                </MenuButton>
            )
        else if (selectionTarget instanceof MeshAppendable) {
            if (selectionTarget instanceof VisibleObjectManager) {
                children.push(
                    <MenuButton
                        onClick={() =>
                            (sceneGraphMenuSignal.value = {
                                x: sceneGraphMenuSignal.value?.x ?? 0,
                                y: sceneGraphMenuSignal.value?.y ?? 0,
                                search: true
                            })
                        }
                    >
                        Search children
                    </MenuButton>,

                    <MenuButton
                        onClick={() => {
                            const template = new Template()
                            template.source = selectionTarget
                            selectTab(librarySignal, "templates")
                            sceneGraphMenuSignal.value = undefined
                        }}
                    >
                        Convert to Template
                    </MenuButton>,

                    <MenuButton
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
                    </MenuButton>
                )
                if (selectionTarget instanceof PhysicsObjectManager)
                    children.push(
                        <MenuButton
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
                        </MenuButton>
                    )
            }
            children.push(
                <MenuButton
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
                    sceneGraphMenuSignal.value = undefined
                }}
            >
                {timelineData && selectionTarget.uuid in timelineData
                    ? "Already in Timeline"
                    : "Add to Timeline"}
            </MenuButton>
        )
    }
    if (!selectionTarget)
        children.push(
            <MenuButton
                disabled={!selectionFrozen.size}
                onClick={() => {
                    clearSelectionFrozen()
                    sceneGraphMenuSignal.value = undefined
                }}
            >
                Unfreeze all
            </MenuButton>,

            <MenuButton
                disabled={!selectionFocus}
                onClick={() => {
                    setSelectionFocus(undefined)
                    emitSelectionTarget(undefined)
                    sceneGraphMenuSignal.value = undefined
                }}
            >
                Exit all
            </MenuButton>
        )
    else
        children.push(
            <MenuButton
                disabled={!selectionTarget}
                onClick={() => {
                    deleteSelected()
                    sceneGraphMenuSignal.value = undefined
                }}
            >
                Delete selected
            </MenuButton>
        )

    return <>{children}</>
}

export default MenuItems
