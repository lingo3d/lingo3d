import { Cancellable } from "@lincode/promiselikes"
import {
    Color,
    Texture,
    WebGLCubeRenderTarget,
    CubeCamera,
    Material
} from "three"
import Appendable from "../../../api/core/Appendable"
import { NEAR } from "../../../globals"
import IAdjustMaterial from "../../../interface/IAdjustMaterial"
import {
    pushReflectionPairs,
    pullReflectionPairs
} from "../../../states/useReflectionPairs"
import unsafeGetValue from "../../../utils/unsafeGetValue"
import unsafeSetValue from "../../../utils/unsafeSetValue"
import { attachStandardMaterialManager } from "../../material/attachMaterialManager"
import StandardMaterialManager from "../../material/StandardMaterialManager"

const setNumber = (
    material: Material,
    property: string,
    factor: number | undefined
) => {
    const defaultValue: number | undefined = (material.userData[property] ??=
        unsafeGetValue(material, property))
    unsafeSetValue(
        material,
        property,
        factor === undefined
            ? defaultValue
            : Math.max(defaultValue || 0, 0.25) * factor
    )
}

const setProperty = (
    material: Material,
    property: string,
    value: boolean | Color | Texture | undefined
) => {
    const defaultValue: boolean | Color | Texture | undefined =
        (material.userData[property] ??= unsafeGetValue(material, property))
    unsafeSetValue(
        material,
        property,
        value === undefined ? defaultValue : value
    )
}

export default abstract class AdjustMaterialMixin
    extends Appendable
    implements IAdjustMaterial
{
    protected _refreshFactors(
        handle: Cancellable,
        materialManagers: Array<StandardMaterialManager>
    ) {
        const {
            _metalnessFactor,
            _roughnessFactor,
            _opacityFactor,
            _envFactor,
            _reflection
        } = this

        let reflectionTexture: Texture | undefined
        if (_reflection) {
            const cubeRenderTarget = new WebGLCubeRenderTarget(256)
            reflectionTexture = cubeRenderTarget.texture
            const cubeCamera = new CubeCamera(NEAR, 10, cubeRenderTarget)
            const pair: [AdjustMaterialMixin, CubeCamera] = [this, cubeCamera]
            pushReflectionPairs(pair)
            handle.then(() => {
                cubeRenderTarget.dispose()
                reflectionTexture = undefined
                pullReflectionPairs(pair)
            })
        }

        for (const materialManager of materialManagers) {
            const material = materialManager.nativeMaterial
            if (material.wireframe) return

            if (_metalnessFactor !== undefined)
                setNumber(
                    material,
                    "metalness",
                    _metalnessFactor !== 0 ? _metalnessFactor : undefined
                )

            if (_roughnessFactor !== undefined)
                setNumber(
                    material,
                    "roughness",
                    _roughnessFactor !== 1 ? _roughnessFactor : undefined
                )

            if (_opacityFactor !== undefined) {
                setNumber(material, "opacity", _opacityFactor)
                setProperty(
                    material,
                    "transparent",
                    _opacityFactor <= 1 ? true : undefined
                )
            }

            if (_envFactor !== undefined)
                setNumber(
                    material,
                    "envMapIntensity",
                    _envFactor !== 1 ? _envFactor : undefined
                )

            if (_reflection !== undefined)
                setProperty(material, "envMap", reflectionTexture)
        }
    }

    protected refreshFactors() {
        this.cancelHandle("refreshFactors", () => {
            const handle = new Cancellable()
            queueMicrotask(() => {
                if (handle.done) return
                this._refreshFactors(
                    handle,
                    attachStandardMaterialManager(this.nativeObject3d, this)
                )
            })
            return handle
        })
    }

    private _metalnessFactor?: number
    public get metalnessFactor() {
        return this._metalnessFactor
    }
    public set metalnessFactor(val) {
        this._metalnessFactor = val
        this.refreshFactors()
    }

    private _roughnessFactor?: number
    public get roughnessFactor() {
        return this._roughnessFactor
    }
    public set roughnessFactor(val) {
        this._roughnessFactor = val
        this.refreshFactors()
    }

    private _opacityFactor?: number
    public get opacityFactor() {
        return this._opacityFactor
    }
    public set opacityFactor(val) {
        this._opacityFactor = val
        this.refreshFactors()
    }

    private _envFactor?: number
    public get envFactor() {
        return this._envFactor
    }
    public set envFactor(val) {
        this._envFactor = val
        this.refreshFactors()
    }

    private _reflection?: boolean
    public get reflection() {
        return this._reflection ?? false
    }
    public set reflection(val: boolean) {
        this._reflection = val
        this.refreshFactors()
    }
}
