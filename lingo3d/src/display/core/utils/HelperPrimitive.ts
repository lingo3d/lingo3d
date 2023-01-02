import { createEffect } from "@lincode/reactivity"
import { BufferGeometry } from "three"
import { hiddenAppendables } from "../../../api/core/collections"
import MeshAppendable from "../../../api/core/MeshAppendable"
import { onTransformControls } from "../../../events/onTransformControls"
import {
    positionedDefaults,
    positionedSchema
} from "../../../interface/IPositioned"
import { getEditorModeComputed } from "../../../states/useEditorModeComputed"
import { getSelectionTarget } from "../../../states/useSelectionTarget"
import Primitive from "../Primitive"

//@ts-ignore
export default abstract class HelperPrimitive extends Primitive {
    public static componentName = "helper"
    public static override defaults = positionedDefaults
    public static override schema = positionedSchema

    public target: MeshAppendable = this

    public constructor(geometry: BufferGeometry) {
        super(geometry)
        hiddenAppendables.add(this)
        this.opacity = 0.5
        this.castShadow = false
        this.receiveShadow = false
    }

    private _onTranslateControl?: () => void
    public get onTranslateControl() {
        return this._onTranslateControl
    }
    public set onTranslateControl(cb) {
        this._onTranslateControl = cb
        this.cancelHandle(
            "onTranslateControl",
            cb &&
                (() =>
                    createEffect(() => {
                        if (
                            getEditorModeComputed() !== "translate" ||
                            getSelectionTarget() !== this.target
                        )
                            return

                        const handle = onTransformControls(cb)
                        return () => {
                            handle.cancel()
                        }
                    }, [getEditorModeComputed, getSelectionTarget]))
        )
    }
}
