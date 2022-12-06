import { valueof } from "@lincode/utils"
import { signal, Signal } from "@preact/signals"
import { CSSProperties, useLayoutEffect, useRef } from "preact/compat"

interface VirtualizedListProps<T extends Array<any>> {
    data?: T
    itemNum?: number
    itemHeight: number
    containerWidth: number
    containerHeight: number
    RenderComponent: (data: {
        index: number
        style: CSSProperties
        data: valueof<T>
    }) => any
    scrollSignal?: Signal<number>
    style?: CSSProperties
}

const VirtualizedList = <T extends Array<any>>({
    data,
    itemNum = data?.length ?? 0,
    itemHeight,
    containerWidth,
    containerHeight,
    RenderComponent,
    scrollSignal = signal(0),
    style
}: VirtualizedListProps<T>) => {
    const ref = useRef<HTMLDivElement>(null)
    useLayoutEffect(() => {
        const div = ref.current
        if (div) return scrollSignal.subscribe((val) => (div.scrollTop = val))
    }, [])

    const innerHeight = itemNum * itemHeight
    const startIndex = Math.floor(scrollSignal.value / itemHeight)
    const endIndex = Math.min(
        itemNum - 1,
        Math.floor((scrollSignal.value + containerHeight) / itemHeight)
    )

    const items = []
    for (let i = startIndex; i <= endIndex; ++i)
        items.push(
            <RenderComponent
                key={i}
                index={i}
                style={{ position: "absolute", top: i * itemHeight }}
                data={data?.[i]}
            />
        )

    return (
        <div
            ref={ref}
            style={{
                overflowY: "scroll",
                overflowX: "hidden",
                width: containerWidth,
                height: containerHeight,
                ...style
            }}
            onScroll={(e) => (scrollSignal.value = e.currentTarget.scrollTop)}
        >
            <div style={{ position: "relative", height: innerHeight }}>
                {items}
            </div>
        </div>
    )
}

export default VirtualizedList
