import { preventTreeShake } from "@lincode/utils"
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import { defineComponent, PropType, VNode, h, ref, watchEffect } from "vue"

preventTreeShake(h)

const style = { position: "absolute", left: 0, top: 0, display: "none" } as const

export default defineComponent({
    props: {
        el: Object as PropType<VNode>,
        manager: Object as PropType<ObjectManager>
    },
    setup(props) {
        const divRef = ref<HTMLDivElement>()

        watchEffect(cleanUp => {
            const div = divRef.value
            const manager = props.manager
            if (!div || !manager) return

            let frustumVisibleOld = false

            const handle = manager.loop(() => {
                const { frustumVisible } = manager
                
                if (frustumVisible !== frustumVisibleOld)
                    div.style.display = frustumVisible ? "block" : "none"

                frustumVisibleOld = frustumVisible

                if (!frustumVisible) return
                
                div.style.transform = `translateX(${manager.clientX}px) translateY(${manager.clientY}px)`
            })
            cleanUp(() => {
                handle.cancel()
            })
        })

        return {
            divRef
        }
    },
    render() {
        return (
            <div style={style} ref="divRef">{this.el}</div>
        )
    }
})