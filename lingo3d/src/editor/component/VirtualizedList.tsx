import { valueof } from "@lincode/utils"
import { CSSProperties, useLayoutEffect, useRef, useState } from "preact/compat"

interface VirtualizedListProps<T extends Array<any>> {
    data?: T
    itemNum?: number
    itemHeight: number
    containerWidth: number
    containerHeight: number
    renderItem: (data: {
        index: number
        style: CSSProperties
        data: valueof<T>
    }) => any
    scrollTop?: number
    onScrollTop?: (scrollTop: number) => void
    style?: CSSProperties
}

const VirtualizedList = <T extends Array<any>>({
    data,
    itemNum = data?.length ?? 0,
    itemHeight,
    containerWidth,
    containerHeight,
    renderItem,
    scrollTop,
    onScrollTop,
    style
}: VirtualizedListProps<T>) => {
    const [scroll, setScroll] = useState(scrollTop ?? 0)

    const firstRef = useRef(true)
    useLayoutEffect(() => {
        if (firstRef.current) {
            firstRef.current = false
            return
        }
        onScrollTop?.(scroll)
    }, [scroll])

    const scrollRef = useRef<HTMLDivElement>(null)
    useLayoutEffect(() => {
        const div = scrollRef.current
        if (scrollTop === undefined || !div) return
        div.scrollTop = scrollTop
    }, [scrollTop])

    const innerHeight = itemNum * itemHeight
    const startIndex = Math.floor(scroll / itemHeight)
    const endIndex = Math.min(
        itemNum - 1,
        Math.floor((scroll + containerHeight) / itemHeight)
    )

    const items = []
    for (let i = startIndex; i <= endIndex; i++)
        items.push(
            renderItem({
                index: i,
                style: { position: "absolute", top: `${i * itemHeight}px` },
                data: data?.[i]
            })
        )

    return (
        <div
            ref={scrollRef}
            style={{
                overflowY: "scroll",
                overflowX: "hidden",
                width: containerWidth,
                height: containerHeight,
                ...style
            }}
            onScroll={(e) => {
                const { scrollTop } = e.currentTarget as HTMLDivElement
                setScroll(scrollTop)
            }}
        >
            <div style={{ position: "relative", height: innerHeight }}>
                {items}
            </div>
        </div>
    )
}

export default VirtualizedList
