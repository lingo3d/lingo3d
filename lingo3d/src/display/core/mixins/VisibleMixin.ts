import { throttle } from "@lincode/utils"
import { Frustum, Object3D } from "three"
import {
    addOutline,
    deleteOutline
} from "../../../engine/renderLoop/effectComposer/outlineEffect"
import {
    addSelectiveBloom,
    deleteSelectiveBloom
} from "../../../engine/renderLoop/effectComposer/selectiveBloomEffect"
import IVisible from "../../../interface/IVisible"
import { getCameraRendered } from "../../../states/useCameraRendered"
import getCenter from "../../utils/getCenter"
import { matrix4 } from "../../utils/reusables"

const frustum = new Frustum()

const updateFrustum = throttle(
    () => {
        const camera = getCameraRendered()
        frustum.setFromProjectionMatrix(
            matrix4.multiplyMatrices(
                camera.projectionMatrix,
                camera.matrixWorldInverse
            )
        )
    },
    200,
    "leading"
)

export default abstract class VisibleMixin<T extends Object3D = Object3D>
    implements IVisible
{
    public declare object3d: T
    public declare outerObject3d: T

    protected _bloom?: boolean
    public get bloom() {
        return !!this._bloom
    }
    public set bloom(val) {
        this._bloom = val
        val
            ? addSelectiveBloom(this.object3d)
            : deleteSelectiveBloom(this.object3d)
    }

    protected _outline?: boolean
    public get outline() {
        return !!this._outline
    }
    public set outline(val) {
        this._outline = val
        val ? addOutline(this.object3d) : deleteOutline(this.object3d)
    }

    private _visible?: boolean
    public get visible() {
        return this._visible !== false
    }
    public set visible(val) {
        this._visible = val
        this.outerObject3d.visible = val
    }

    public get frustumCulled() {
        return this.outerObject3d.frustumCulled
    }
    public set frustumCulled(val) {
        this.outerObject3d.frustumCulled = val
        this.outerObject3d.traverse((child) => (child.frustumCulled = val))
    }

    public get frustumVisible() {
        updateFrustum()
        return frustum.containsPoint(getCenter(this.object3d))
    }

    protected _castShadow?: boolean
    public get castShadow() {
        return this._castShadow ?? true
    }
    public set castShadow(val) {
        this._castShadow = val
        this.outerObject3d.traverse((child) => (child.castShadow = val))
    }

    protected _receiveShadow?: boolean
    public get receiveShadow() {
        return this._receiveShadow ?? true
    }
    public set receiveShadow(val) {
        this._receiveShadow = val
        this.outerObject3d.traverse((child) => (child.receiveShadow = val))
    }
}
