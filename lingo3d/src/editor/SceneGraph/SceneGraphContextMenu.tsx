import { Fragment } from "preact"
import { useEffect, useState } from "preact/hooks"
import { Object3D } from "three"
import Appendable from "../../api/core/Appendable"
import Loaded from "../../display/core/Loaded"
import { isMeshItem } from "../../display/core/MeshItem"
import Dummy, { dummyTypeMap } from "../../display/Dummy"
import { onSelectionTarget } from "../../events/onSelectionTarget"
import { DUMMY_URL, YBOT_URL } from "../../globals"
import { setSceneGraphExpanded } from "../../states/useSceneGraphExpanded"
import { setSelectionNativeTarget } from "../../states/useSelectionNativeTarget"
import {
    addSelectionFrozen,
    clearSelectionFrozen,
    removeSelectionFrozen
} from "../../states/useSelectionFrozen"
import downloadBlob from "../../api/files/downloadBlob"
import ContextMenu from "../component/ContextMenu"
import MenuItem from "../component/ContextMenu/MenuItem"
import {
    useSelectionFocus,
    useSelectionFrozen,
    useSelectionTarget
} from "../states"
import { getChildManagers } from "../../states/useSelectionFocus"

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
    const [data, setData] = useState<
        { x: number; y: number; target: Appendable | undefined } | undefined
    >(undefined)
    const [showSearch, setShowSearch] = useState(false)
    const [selectionTarget] = useSelectionTarget()
    const [[selectionFrozen]] = useSelectionFrozen()
    const [selectionFocus, setSelectionFocus] = useSelectionFocus()

    useEffect(() => {
        let [clientX, clientY] = [0, 0]
        const cb = (e: MouseEvent) =>
            ([clientX, clientY] = [e.clientX, e.clientY])
        document.addEventListener("mousemove", cb)

        const handle = onSelectionTarget(({ target, rightClick }) => {
            rightClick && setData({ x: clientX, y: clientY, target })
        })
        return () => {
            handle.cancel()
            document.removeEventListener("mousemove", cb)
        }
    }, [])

    useEffect(() => {
        !data && setShowSearch(false)
    }, [data])

    if (!data) return null

    return (
        <ContextMenu data={data} setData={setData}>
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
                        setData(undefined)
                    }}
                />
            ) : (
                <Fragment>
                    {data.target && isMeshItem(selectionTarget) && (
                        <Fragment>
                            <MenuItem
                                setData={undefined}
                                onClick={() => setShowSearch(true)}
                            >
                                Search children
                            </MenuItem>

                            {/* {selectionTarget instanceof Dummy && (
                                <MenuItem onClick={() => {
                                    setRetargetBones(selectionTarget)
                                    setSelectionLocked(true)
                                }}>
                                    Convert to Mixamo
                                </MenuItem>
                            )} */}

                            <MenuItem
                                setData={setData}
                                onClick={() =>
                                    selectionFrozen.has(selectionTarget)
                                        ? removeSelectionFrozen(selectionTarget)
                                        : addSelectionFrozen(selectionTarget)
                                }
                            >
                                {selectionFrozen.has(selectionTarget)
                                    ? "Unfreeze selection"
                                    : "Freeze selection"}
                            </MenuItem>

                            <MenuItem
                                setData={setData}
                                onClick={() =>
                                    selectionFocus?.has(selectionTarget)
                                        ? setSelectionFocus(undefined)
                                        : setSelectionFocus(
                                              getChildManagers(selectionTarget)
                                          )
                                }
                            >
                                {selectionFocus?.has(selectionTarget)
                                    ? "Unfocus selection"
                                    : "Focus selection"}
                            </MenuItem>

                            {selectionTarget instanceof Dummy &&
                                dummyTypeMap.has(selectionTarget) && (
                                    <MenuItem
                                        setData={setData}
                                        onClick={async () => {
                                            const url =
                                                dummyTypeMap.get(
                                                    selectionTarget
                                                ) === "dummy"
                                                    ? YBOT_URL
                                                    : DUMMY_URL +
                                                      "readyplayerme/reference.fbx"

                                            const res = await fetch(url)
                                            downloadBlob(
                                                "model.fbx",
                                                await res.blob()
                                            )
                                        }}
                                    >
                                        Download for Mixamo
                                    </MenuItem>
                                )}
                        </Fragment>
                    )}
                    <MenuItem
                        setData={setData}
                        disabled={!selectionFrozen.size}
                        onClick={() => clearSelectionFrozen()}
                    >
                        Unfreeze all
                    </MenuItem>

                    <MenuItem
                        setData={setData}
                        disabled={!selectionFocus}
                        onClick={() => setSelectionFocus(undefined)}
                    >
                        Unfocus all
                    </MenuItem>
                </Fragment>
            )}
        </ContextMenu>
    )
}

export default SceneGraphContextMenu
