import { ref, watchEffect } from "vue"
import { render, h as preactH } from "preact"
import "lingo3d/lib/editor"

export default (Component: any, props?: any) => {
    const divRef = ref<HTMLDivElement>()

    watchEffect(cleanup => {
        const el = divRef.value
        if (!el) return

        render(preactH(Component, props && { ...props }), el)
        
        cleanup(() => {
            render(undefined, el)
        })
    })

    return divRef
}