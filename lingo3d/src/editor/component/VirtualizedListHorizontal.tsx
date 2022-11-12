import { CSSProperties, useState } from "preact/compat"

type VirtualizedListHorizontalProps = {
    itemNum: number
    itemWidth: number
    containerWidth: number
    containerHeight: number
    renderItem: (data: { index: number; style: CSSProperties }) => any
}

const VirtualizedListHorizontal = ({
    itemNum,
    itemWidth,
    containerWidth,
    containerHeight,
    renderItem
}: VirtualizedListHorizontalProps) => {
    const [scrollLeft, setScrollLeft] = useState(0)

    const innerWidth = itemNum * itemWidth
    const startIndex = Math.floor(scrollLeft / itemWidth)
    const endIndex = Math.min(
        itemNum - 1,
        Math.floor((scrollLeft + containerWidth) / itemWidth)
    )

    const items = []
    for (let i = startIndex; i <= endIndex; i++)
        items.push(
            renderItem({
                index: i,
                style: { position: "absolute", left: `${i * itemWidth}px` }
            })
        )

    const onScroll = (e: Event) =>
        setScrollLeft((e.currentTarget as HTMLDivElement).scrollLeft)

    return (
        <div
            style={{
                overflowX: "scroll",
                width: containerWidth,
                height: containerHeight
            }}
            onScroll={onScroll}
        >
            <div style={{ position: "relative", width: innerWidth }}>
                {items}
            </div>
        </div>
    )
}

export default VirtualizedListHorizontal
