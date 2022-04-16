import { outline } from "lingo3d"
import { createVNode, render } from "vue"
import { refreshOutline } from "./build"
import Outline from "./Outline.vue"

const vnode = createVNode(Outline)
render(vnode, outline)

export default () => {
    refreshOutline.value = {}
}