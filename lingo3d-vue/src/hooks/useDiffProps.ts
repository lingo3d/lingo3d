import { Ref, ref, watchEffect } from "vue"

export default (props: Record<string, any>, defaults: Record<string, any>, paused?: Ref<boolean>) => {
    let propsOld: Record<string, any> = defaults

    const changesRef = ref<Array<[string, any]>>([])

    watchEffect(() => {
        if (paused?.value) return

        const changes: Array<[string, any]> = changesRef.value = []
        for (const [key, value] of Object.entries(props)) {
            const valueOld = propsOld[key]
            if (valueOld === value) continue
            
            if (value && typeof value === "object") {
                if (JSON.stringify(value) !== JSON.stringify(valueOld))
                    changes.push([key, value])
            }
            else changes.push([key, value])
        }
        propsOld = props
    })

    return changesRef
}