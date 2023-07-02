import { useState } from "preact/hooks"
import useSyncState from "../hooks/useSyncState"
import { getDummyIK } from "../../states/useDummyIK"
import IDummyIK from "../../interface/IDummyIK"
import { draggingItemPtr } from "../../pointers/draggingItemPtr"
import { Object3D } from "three"
import unsafeSetValue from "../../utils/unsafeSetValue"
import { selectionTargetPtr } from "../../pointers/selectionTargetPtr"
import FoundManager from "../../display/core/FoundManager"
import { forceGetInstance } from "@lincode/utils"

type JointName = keyof IDummyIK

type JointProps = {
    x: number
    y: number
    name: JointName
    onMouseMove?: (e: MouseEvent) => void
    onMouseLeave?: (e: MouseEvent) => void
}

const parentChildrenMap = new Map<JointName, Array<JointName>>()
const childParentMap = new Map<JointName, JointName>()
const setParenting = (names: Array<JointName>) => {
    let parentName: JointName | undefined
    for (const childName of names) {
        if (parentName) {
            forceGetInstance(parentChildrenMap, parentName, Array).push(
                childName
            )
            childParentMap.set(childName, parentName)
        }
        parentName = childName
    }
}
setParenting(["hips", "spine0", "spine1", "spine2", "neck"])
setParenting(["spine2", "leftShoulder", "leftArm", "leftForeArm", "leftHand"])
setParenting([
    "spine2",
    "rightShoulder",
    "rightArm",
    "rightForeArm",
    "rightHand"
])
setParenting(["hips", "leftThigh", "leftLeg", "leftFoot", "leftForeFoot"])
setParenting(["hips", "rightThigh", "rightLeg", "rightFoot", "rightForeFoot"])

const Joint = ({ x, y, onMouseMove, onMouseLeave, name }: JointProps) => {
    const [dragOver, setDragOver] = useState(false)
    const dummyIK = useSyncState(getDummyIK)
    const [, setRefresh] = useState({})
    if (!dummyIK) return null

    return (
        <div
            style={{
                position: "absolute",
                width: 14,
                height: 14,
                left: 50 + x + "%",
                top: y + "%",
                transform: "translateX(-50%)",
                borderRadius: 20,
                border: "1px solid rgba(255, 255, 255, 0.5)",
                background: dummyIK[name]
                    ? "rgb(127, 127, 255)"
                    : `rgba(255, 255, 255, ${dragOver ? 0.5 : 0.2})`
            }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onDragOver={(e) => {
                e.stopPropagation()
                e.preventDefault()
                draggingItemPtr[0] && setDragOver(true)
            }}
            onDragEnter={(e) => {
                e.stopPropagation()
                e.preventDefault()
                draggingItemPtr[0] && setDragOver(true)
            }}
            onDragLeave={(e) => {
                e.stopPropagation()
                setDragOver(false)
            }}
            onDrop={(e) => {
                e.stopPropagation()
                setDragOver(false)
                const owner =
                    selectionTargetPtr[0] instanceof FoundManager
                        ? selectionTargetPtr[0].owner
                        : selectionTargetPtr[0]
                if (
                    !(draggingItemPtr[0] instanceof Object3D) ||
                    !owner ||
                    (dummyIK.target && dummyIK.target !== owner.uuid)
                )
                    return

                dummyIK.target = owner.uuid
                unsafeSetValue(dummyIK, name, draggingItemPtr[0].name)
                setRefresh({})
            }}
        />
    )
}

export default Joint
