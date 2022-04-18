import { ref, watch, Ref } from "vue"

export default <T>(state: Ref<T> | (() => T)) => {
    const previous = ref<T>()

    watch(state, (_, oldVal) => {
        previous.value = oldVal
    })

    return previous
}