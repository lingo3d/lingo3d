import { CSSProperties, forwardRef, useState } from "preact/compat"

type VirtualizedListHorizontalProps = {
    itemNum: number
    itemWidth: number
    containerWidth: number
    containerHeight: number
    renderItem: (data: { index: number; style: CSSProperties }) => any
}

const VirtualizedListHorizontal = forwardRef<
    HTMLDivElement,
    VirtualizedListHorizontalProps
>(
    (
        { itemNum, itemWidth, containerWidth, containerHeight, renderItem },
        ref
    ) => {
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

        return (
            <div
                style={{
                    overflow: "hidden",
                    width: containerWidth,
                    height: containerHeight
                }}
            >
                <div
                    ref={ref}
                    style={{
                        overflowX: "scroll",
                        width: containerWidth,
                        height: containerHeight + 4
                    }}
                    onScroll={(e) =>
                        setScrollLeft(
                            (e.currentTarget as HTMLDivElement).scrollLeft
                        )
                    }
                >
                    <div style={{ position: "relative", width: innerWidth }}>
                        {items}
                    </div>
                </div>
            </div>
        )
    }
)
export default VirtualizedListHorizontal
