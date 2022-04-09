import { ref, watch } from "vue"

export default (props: Record<string, any>, defaults: Record<string, any>) => {
    let propsOld: Record<string, any> = {}

    const changes = ref<Array<[string, any]>>([])
    let immediate = true

    watch(props, () => {
        changes.value = []
        for (const [key, value] of Object.entries(props)) {
            const valueOld = propsOld[key]
            if (valueOld === value) continue
            
            if (value && typeof value === "object") {
                if (JSON.stringify(value) !== JSON.stringify(valueOld))
                    if (!immediate || value !== defaults[key])
                        changes.value.push([key, value])
            }
            else if (!immediate || value !== defaults[key])
                changes.value.push([key, value])
        }
        propsOld = { ...props }
        immediate = false
    }, { immediate: true })

    return changes
}