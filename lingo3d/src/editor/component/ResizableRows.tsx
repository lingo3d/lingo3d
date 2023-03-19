import { ComponentChild } from "preact"
import { useMemo, useState } from "preact/hooks"
import useResizeObserver from "../hooks/useResizeObserver"
import PanDiv from "./PanDiv"

type Props = {
    children: Array<ComponentChild>
}

const ResizableRows = ({ children }: Props) => {
    const [elRef, { height }] = useResizeObserver()
    const sizeOffsets = useMemo(() => children.map(() => 0), [])
    const [, setRefresh] = useState({})

    return (
        <div ref={elRef} className="lingo3d-absfull lingo3d-flexcol">
            {children.map((child, i) => (
                <>
                    <div
                        key={i}
                        style={{
                            width: "100%",
                            height: height / children.length + sizeOffsets[i]
                        }}
                    >
                        {child}
                    </div>
                    {i < children.length - 1 && (
                        <PanDiv
                            style={{
                                width: "100%",
                                height: 6,
                                cursor: "row-resize"
                            }}
                            onPan={(e) => {
                                sizeOffsets[i] += e.deltaY
                                setRefresh({})
                            }}
                        />
                    )}
                </>
            ))}
        </div>
    )
}

export default ResizableRows
