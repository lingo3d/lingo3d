import { ComponentChild } from "preact"
import { useMemo, useState } from "preact/hooks"
import { APPBAR_HEIGHT } from "../../globals"
import useResizeObserver from "../hooks/useResizeObserver"
import PanDiv from "./PanDiv"

type Props = {
    children: Array<ComponentChild>
}

const ResizableRows = ({ children }: Props) => {
    const [elRef, { height }] = useResizeObserver()
    const childrenFiltered = children.filter(Boolean)
    const sizeOffsets = useMemo<Record<number, number | undefined>>(
        () => ({}),
        []
    )
    const [, setRefresh] = useState({})

    return (
        <div ref={elRef} className="lingo3d-absfull lingo3d-flexcol">
            {childrenFiltered.map((child, i) => (
                <div
                    key={i}
                    style={{
                        width: "100%",
                        height:
                            height / childrenFiltered.length +
                            (sizeOffsets[i] ?? 0),
                        minHeight: APPBAR_HEIGHT
                    }}
                >
                    {child}
                    {i < childrenFiltered.length - 1 && (
                        <PanDiv
                            style={{
                                width: "100%",
                                height: 6,
                                cursor: "row-resize",
                                position: "absolute",
                                bottom: 0
                            }}
                            onPan={({ deltaY }) => {
                                sizeOffsets[i] ??= 0
                                sizeOffsets[i + 1] ??= 0
                                sizeOffsets[i]! += deltaY
                                sizeOffsets[i + 1]! -= deltaY
                                setRefresh({})
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    )
}

export default ResizableRows
