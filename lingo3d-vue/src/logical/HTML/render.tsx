import { outline } from "lingo3d"
import { Ref, ref, createApp, VNode, h, Fragment } from "vue"
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import { forceGet, preventTreeShake } from "@lincode/utils"
import HTMLChild from "./HTMLChild"
import { nanoid } from "nanoid"

preventTreeShake(h)

export const elements: Ref<Array<[Array<VNode>, ObjectManager]>> = ref([])

const managerIdMap = new WeakMap<ObjectManager, string>()

createApp({
    setup() {
        return {
            elements
        }
    },
    render() {
        return (
            <Fragment>
                {this.elements.map(([el, manager]: any) => (
                    <HTMLChild key={forceGet(managerIdMap, manager, nanoid)} el={el} manager={manager} />
                ))}
            </Fragment>
        )
    }

}).mount(outline)