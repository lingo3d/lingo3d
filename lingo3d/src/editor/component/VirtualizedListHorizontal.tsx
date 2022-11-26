import { valueof } from "@lincode/utils"
import { CSSProperties, useLayoutEffect, useRef, useState } from "preact/compat"

interface VirtualizedListHorizontalProps<T extends Array<any>> {
    data?: T
    itemNum?: number
    itemWidth: number
    containerWidth: number
    containerHeight: number
    renderItem: (data: {
        index: number
        style: CSSProperties
        data: valueof<T>
    }) => any
    scrollLeft?: number
    onScrollLeft?: (scrollLeft: number) => void
    style?: CSSProperties
}

const VirtualizedListHorizontal = <T extends Array<any>>({
    data,
    itemNum = data?.length ?? 0,
    itemWidth,
    containerWidth,
    containerHeight,
    renderItem,
    scrollLeft,
    onScrollLeft,
    style
}: VirtualizedListHorizontalProps<T>) => {
    const [scroll, setScroll] = useState(scrollLeft ?? 0)

    const firstRef = useRef(true)
    useLayoutEffect(() => {
        if (firstRef.current) {
            firstRef.current = false
            return
        }
        onScrollLeft?.(scroll)
    }, [scroll])

    const scrollRef = useRef<HTMLDivElement>(null)
    useLayoutEffect(() => {
        const div = scrollRef.current
        if (scrollLeft === undefined || !div) return
        div.scrollLeft = scrollLeft
    }, [scrollLeft])

    const innerWidth = itemNum * itemWidth
    const startIndex = Math.floor(scroll / itemWidth)
    const endIndex = Math.min(
        itemNum - 1,
        Math.floor((scroll + containerWidth) / itemWidth)
    )

    const items = []
    for (let i = startIndex; i <= endIndex; i++)
        items.push(
            renderItem({
                index: i,
                style: { position: "absolute", left: `${i * itemWidth}px` },
                data: data?.[i]
            })
        )

    return (
        <div
            ref={scrollRef}
            style={{
                overflowX: "scroll",
                overflowY: "hidden",
                width: containerWidth,
                height: containerHeight + 4,
                ...style
            }}
            onScroll={(e) => setScroll(e.currentTarget.scrollLeft)}
        >
            <div style={{ position: "relative", width: innerWidth }}>
                {items}
            </div>
        </div>
    )
}

export default VirtualizedListHorizontal
