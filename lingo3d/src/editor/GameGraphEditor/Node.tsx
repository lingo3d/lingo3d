import { Cancellable } from "@lincode/promiselikes"
import { valueof } from "@lincode/utils"
import { useEffect, useMemo, useState } from "preact/hooks"
import { uuidMap } from "../../api/core/collections"
import { EDITOR_WIDTH } from "../../globals"
import { GameGraphData } from "../../interface/IGameGraph"
import unsafeGetValue from "../../utils/unsafeGetValue"
import SearchBox from "../component/SearchBox"
import addTargetInputs from "../Editor/addTargetInputs"
import usePane from "../Editor/usePane"
import usePan, { PanEvent } from "../hooks/usePan"
import getDisplayName from "../utils/getDisplayName"

type NodeProps = {
    uuid: string
    data: valueof<GameGraphData>
    onPan?: (e: PanEvent) => void
}

const Node = ({ uuid, data, onPan }: NodeProps) => {
    const manager = useMemo(() => uuidMap.get(uuid), [uuid])
    const displayName = useMemo(
        () => manager && getDisplayName(manager),
        [manager]
    )
    const pressRef = usePan({ onPan })
    const [pane, setContainer] = usePane()
    const [includeKeys, setIncludeKeys] = useState<Array<string>>([])

    useEffect(() => {
        if (!manager || !pane) return
        const handle = addTargetInputs(pane, manager, includeKeys, true, () => {
            console.log("connect")
        })
        return () => {
            handle.cancel()
        }
    }, [manager, includeKeys, pane])

    return (
        <div
            style={{
                width: EDITOR_WIDTH,
                minHeight: 100,
                position: "absolute",
                left: data.x,
                top: data.y
            }}
        >
            <div style={{ fontSize: 16, marginTop: -24 }} ref={pressRef}>
                {displayName}
            </div>
            <SearchBox
                fullWidth
                style={{ marginTop: 8 }}
                onChange={(val) => {
                    console.log(val)

                    if (!val || !manager) {
                        setIncludeKeys([])
                        return
                    }
                    val = val.toLowerCase()
                    setIncludeKeys(
                        Object.keys(
                            unsafeGetValue(manager, "constructor").schema
                        ).filter((key) => key.toLowerCase().includes(val))
                    )
                }}
            />
            <div ref={setContainer} style={{ width: "100%" }} />
        </div>
    )
}

export default Node
