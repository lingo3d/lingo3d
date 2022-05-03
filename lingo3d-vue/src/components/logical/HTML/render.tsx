import { ref, createApp, VNode, h, Fragment } from "vue"
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import { forceGet, preventTreeShake } from "@lincode/utils"
import HTMLChild from "./HTMLChild"
import { nanoid } from "nanoid"
import htmlContainer from "./htmlContainer"

preventTreeShake(h)

export const elements: Array<[Array<VNode>, ObjectManager, string]> = []
export const renderRef = ref({})

const managerIdMap = new WeakMap<ObjectManager, string>()

createApp({
    setup() {
        return {
            renderRef
        }
    },
    render() {
        this.renderRef

        return (
            <Fragment>
                {elements.map(([el, manager]: any) => (
                    <HTMLChild key={forceGet(managerIdMap, manager, nanoid)} el={el} manager={manager} />
                ))}
            </Fragment>
        )
    }

}).mount(htmlContainer)