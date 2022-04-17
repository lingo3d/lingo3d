import { outline } from "lingo3d"
import { createVNode, Ref, ref, render } from "vue"
import Outline from "./Outline.vue"
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import { VNode } from "vue"

export const elements: Ref<Array<[Array<VNode>, ObjectManager]>> = ref([])

const vnode = createVNode(Outline)
render(vnode, outline)