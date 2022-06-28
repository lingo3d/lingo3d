import { preventTreeShake } from "@lincode/utils"
import { Fragment, h } from "preact"
import { useEffect, useState } from "preact/hooks"
import { Object3D } from "three"
import Appendable from "../../api/core/Appendable"
import Loaded from "../../display/core/Loaded"
import { isMeshItem } from "../../display/core/MeshItem"
import Dummy, { dummyTypeMap } from "../../display/Dummy"
import { onSelectionTarget } from "../../events/onSelectionTarget"
import { DUMMY_URL, YBOT_URL } from "../../globals"
import { setSceneGraphExpanded } from "../../states/useSceneGraphExpanded"
import { setSceneGraphTarget } from "../../states/useSceneGraphTarget"
import { addSelectionFrozen, clearSelectionFrozen } from "../../states/useSelectionFrozen"
import downloadBlob from "../../utils/downloadBlob"
import { useSelectionFrozen, useSelectionTarget } from "../states"

preventTreeShake(h)

const traverseUp = (obj: Object3D, expandedSet: Set<Object3D>) => {
    expandedSet.add(obj)
    const nextParent = obj.userData.manager?.parent?.outerObject3d ?? obj.parent
    nextParent && traverseUp(nextParent, expandedSet)
}

const search = (n: string, target: Loaded | Appendable) => {
    const name = n.toLowerCase()
    let found: Object3D | undefined
    if (target instanceof Loaded)
        target.loadedGroup.traverse(item => {
            if (found) return
            item.name.toLowerCase().includes(name) && (found = item)
        })
    else
        target.outerObject3d.traverse(item => {
            if (found) return
            item.name.toLowerCase().includes(name) && (found = item)
        })
    if (!found) return
    
    const expandedSet = new Set<Object3D>()
    traverseUp(found, expandedSet)
    setSceneGraphExpanded(expandedSet)
    setSceneGraphTarget(found)
}

type MenuItemProps = {
    disabled?: boolean
    onClick: () => void
    children: string
}

const MenuItem = ({ disabled, onClick, children }: MenuItemProps) => {
    const [hover, setHover] = useState(false)

    return (
        <div
         style={{
            padding: 6,
            whiteSpace: "nowrap",
            background: !disabled && hover ? "rgba(255, 255, 255, 0.1)" : undefined,
            opacity: disabled ? 0.5 : 1
        }}
         onClick={disabled ? undefined : onClick}
         onMouseEnter={disabled ? undefined : () => setHover(true)}
         onMouseLeave={disabled? undefined : () => setHover(false)}
        >
            {children}
        </div>
    )
}

const ContextMenu = () => {
    const [data, setData] = useState<{ x: number, y: number, target: Appendable | undefined } | undefined>(undefined)
    const [showSearch, setShowSearch] = useState(false)
    const [selectionTarget] = useSelectionTarget()
    const [[selectionFrozen]] = useSelectionFrozen()

    useEffect(() => {
        let [clientX, clientY] = [0, 0]
        const cb = (e: MouseEvent) => [clientX, clientY] = [e.clientX, e.clientY]
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
        <div className="lingo3d-ui" onMouseDown={() => setData(undefined)} style={{
            zIndex: 9999,
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden"
        }}>
            <div onMouseDown={e => e.stopPropagation()} style={{
                position: "absolute",
                left: data.x,
                top: data.y,
                background: "rgb(40, 41, 46)",
                padding: 6
            }}>
                {showSearch ? (
                    <input
                     ref={el => el?.focus()}
                     style={{ all: "unset", padding: 6 }}
                     onKeyDown={e => {
                         e.stopPropagation()
                         if (e.key !== "Enter" && e.key !== "Escape") return
                         e.key === "Enter" && selectionTarget && search((e.target as HTMLInputElement).value, selectionTarget)
                         setData(undefined)
                     }}
                    />
                ) : <Fragment>
                    {data.target && (
                        <Fragment>
                            <MenuItem onClick={() => setShowSearch(true)}>
                                Search children
                            </MenuItem>

                            {/* {selectionTarget instanceof Dummy && (
                                <MenuItem onClick={() => {
                                    setRetargetBones(selectionTarget)
                                    setSelectionLocked(true)
                                    setData(undefined)
                                }}>
                                    Convert to Mixamo
                                </MenuItem>
                            )} */}

                            <MenuItem onClick={() => {
                                isMeshItem(selectionTarget) && addSelectionFrozen(selectionTarget)
                                setData(undefined)
                            }}>
                                Freeze selection
                            </MenuItem>

                            {selectionTarget instanceof Dummy && dummyTypeMap.has(selectionTarget) && (
                                <MenuItem onClick={async () => {
                                    setData(undefined)

                                    const url = dummyTypeMap.get(selectionTarget) === "dummy"
                                        ? YBOT_URL
                                        : DUMMY_URL + "readyplayerme/reference.fbx"

                                    const res = await fetch(url)
                                    downloadBlob("model.fbx", await res.blob())
                                }}>
                                    Download for Mixamo
                                </MenuItem>
                            )}
                        </Fragment>
                    )}
                    <MenuItem disabled={!selectionFrozen.size} onClick={() => {
                        clearSelectionFrozen()
                        setData(undefined)
                    }}>
                        Unfreeze all
                    </MenuItem>
                </Fragment>}
            </div>
        </div>
    )
}

export default ContextMenu