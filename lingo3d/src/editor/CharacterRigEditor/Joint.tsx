import { useState } from "preact/hooks"
import useSyncState from "../hooks/useSyncState"
import { getCharacterRig } from "../../states/useCharacterRig"
import { CharacterRigJointName } from "../../interface/ICharacterRig"
import { draggingItemPtr } from "../../pointers/draggingItemPtr"
import unsafeSetValue from "../../utils/unsafeSetValue"
import FoundManager from "../../display/core/FoundManager"

type JointProps = {
    x: number
    y: number
    name: CharacterRigJointName
    onMouseMove?: (e: MouseEvent) => void
    onMouseLeave?: (e: MouseEvent) => void
}

const Joint = ({ x, y, onMouseMove, onMouseLeave, name }: JointProps) => {
    const [dragOver, setDragOver] = useState(false)
    const characterRig = useSyncState(getCharacterRig)
    const [, setRefresh] = useState({})
    if (!characterRig) return null

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
                background: characterRig[name]
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
                if (!(draggingItemPtr[0] instanceof FoundManager)) return
                const { owner } = draggingItemPtr[0]
                if (
                    !owner ||
                    (characterRig.target && characterRig.target !== owner.uuid)
                )
                    return
                characterRig.target = owner.uuid
                unsafeSetValue(characterRig, name, draggingItemPtr[0].uuid)
                setRefresh({})
            }}
        />
    )
}

export default Joint
