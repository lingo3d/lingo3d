import { valueof } from "@lincode/utils"
import { signal, Signal } from "@preact/signals"
import { CSSProperties, useLayoutEffect, useRef } from "preact/compat"

interface VirtualizedListHorizontalProps<T extends Array<any>> {
    data?: T
    itemNum?: number
    itemWidth: number
    containerWidth: number
    containerHeight: number
    RenderComponent: (data: {
        index: number
        style: CSSProperties
        data: valueof<T>
    }) => any
    scrollSignal: Signal<number>
    style?: CSSProperties
}

const VirtualizedListHorizontal = <T extends Array<any>>({
    data,
    itemNum = data?.length ?? 0,
    itemWidth,
    containerWidth,
    containerHeight,
    RenderComponent,
    scrollSignal = signal(0),
    style
}: VirtualizedListHorizontalProps<T>) => {
    const ref = useRef<HTMLDivElement>(null)
    useLayoutEffect(() => {
        const div = ref.current
        if (div) return scrollSignal.subscribe((val) => (div.scrollLeft = val))
    }, [])

    const innerWidth = itemNum * itemWidth
    const startIndex = Math.floor(scrollSignal.value / itemWidth)
    const endIndex = Math.min(
        itemNum - 1,
        Math.floor((scrollSignal.value + containerWidth) / itemWidth)
    )

    const items = []
    for (let i = startIndex; i <= endIndex; ++i)
        items.push(
            <RenderComponent
                key={i}
                index={i}
                style={{ position: "absolute", left: i * itemWidth }}
                data={data?.[i]}
            />
        )

    return (
        <div
            ref={ref}
            style={{
                overflowX: "scroll",
                overflowY: "hidden",
                width: containerWidth,
                height: containerHeight + 4,
                ...style
            }}
            onScroll={(e) => (scrollSignal.value = e.currentTarget.scrollLeft)}
        >
            <div style={{ position: "relative", width: innerWidth }}>
                {items}
            </div>
        </div>
    )
}

export default VirtualizedListHorizontal
