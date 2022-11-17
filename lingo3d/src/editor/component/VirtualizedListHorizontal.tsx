import { CSSProperties, useLayoutEffect, useRef, useState } from "preact/compat"

type VirtualizedListHorizontalProps = {
    data?: Array<any>
    itemNum?: number
    itemWidth: number
    containerWidth: number
    containerHeight: number
    renderItem: (data: {
        index: number
        style: CSSProperties
        data: any
    }) => any
    scrollLeft?: number
    onScrollLeft?: (scrollLeft: number) => void
    style?: CSSProperties
}

const VirtualizedListHorizontal = ({
    data,
    itemNum = data?.length ?? 0,
    itemWidth,
    containerWidth,
    containerHeight,
    renderItem,
    scrollLeft,
    onScrollLeft,
    style
}: VirtualizedListHorizontalProps) => {
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
            style={{
                overflow: "hidden",
                width: containerWidth,
                height: containerHeight,
                ...style
            }}
        >
            <div
                ref={scrollRef}
                style={{
                    overflowX: "scroll",
                    width: containerWidth,
                    height: containerHeight + 4
                }}
                onScroll={(e) => {
                    const { scrollLeft } = e.currentTarget as HTMLDivElement
                    setScroll(scrollLeft)
                }}
            >
                <div style={{ position: "relative", width: innerWidth }}>
                    {items}
                </div>
            </div>
        </div>
    )
}

export default VirtualizedListHorizontal
