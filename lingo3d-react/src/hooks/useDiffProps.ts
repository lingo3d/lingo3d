import { useRef } from "react"

export default (props: Record<string, any>) => {
    const propsOldRef = useRef<any>({})
    const propsOld = propsOldRef.current
    const changes: Array<[string, any]> = []

    for (const [key, value] of Object.entries(props)) {
        const valueOld = propsOld[key]
        if (valueOld === value) continue
        
        if (value && typeof value === "object") {
            if (JSON.stringify(value) !== JSON.stringify(valueOld))
                changes.push([key, value])
        }
        else changes.push([key, value])
    }

    propsOldRef.current = props

    return changes
}