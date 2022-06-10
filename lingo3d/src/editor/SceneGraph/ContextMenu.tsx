import { preventTreeShake } from "@lincode/utils"
import { Fragment, h } from "preact"
import { useEffect, useState } from "preact/hooks"
import { Object3D } from "three"
import Appendable from "../../api/core/Appendable"
import Model from "../../display/Model"
import { emitSelectionFrozen } from "../../events/onSelectionFrozen"
import { onSelectionTarget } from "../../events/onSelectionTarget"
import { setSceneGraphExpanded } from "../../states/useSceneGraphExpanded"
import { setSceneGraphTarget } from "../../states/useSceneGraphTarget"
import { getSelectionTarget } from "../../states/useSelectionTarget"

preventTreeShake(h)

const traverseUp = (obj: Object3D, expandedSet: Set<Object3D>) => {
    expandedSet.add(obj)
    const nextParent = obj.userData.manager?.parent?.outerObject3d ?? obj.parent
    nextParent && traverseUp(nextParent, expandedSet)
}

const search = (n: string) => {
    const model = getSelectionTarget()
    if (!(model instanceof Model)) return
    
    const name = n.toLowerCase()
    let found: Object3D | undefined
    model.loadedGroup.traverse(item => {
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
    onClick: () => void
    children: string
}

const MenuItem = ({ onClick, children }: MenuItemProps) => {
    const [hover, setHover] = useState(false)

    return (
        <div
         style={{ padding: 6, whiteSpace: "nowrap", background: hover ? "rgba(255, 255, 255, 0.1)" : undefined }}
         onClick={onClick}
         onMouseEnter={() => setHover(true)}
         onMouseLeave={() => setHover(false)}
        >
            {children}
        </div>
    )
}

const ContextMenu = () => {
    const [data, setData] = useState<{ x: number, y: number, target: Appendable } | undefined>(undefined)
    const [showSearch, setShowSearch] = useState(false)

    useEffect(() => {
        let [clientX, clientY] = [0, 0]
        const cb = (e: MouseEvent) => [clientX, clientY] = [e.clientX, e.clientY]
        document.addEventListener("mousemove", cb)

        const handle = onSelectionTarget(({ target, rightClick }) => {
            rightClick && target && setData({ x: clientX, y: clientY, target })
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
                         e.key === "Enter" && search((e.target as HTMLInputElement).value)
                         setData(undefined)
                     }}
                    />
                ) : (
                    <Fragment>
                        <MenuItem onClick={() => setShowSearch(true)}>
                            Search children
                        </MenuItem>
                        <MenuItem onClick={() => {
                            const target = getSelectionTarget()
                            target && emitSelectionFrozen(target)
                            setData(undefined)
                        }}>
                            Freeze selction
                        </MenuItem>
                    </Fragment>
                )}
            </div>
        </div>
    )
}

export default ContextMenu